import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { outgoingMessage } from "./types";
import client from "@interspace/db/client"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./config";

function generateRandomString(lenght: number) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < lenght; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export class User {
    public id: string;
    private spaceId?: string;
    private userId?: string;
    private x: number;
    private y: number;


    constructor(private ws: WebSocket) {
        this.id = generateRandomString(10)
        this.x = 0
        this.y = 0
        this.initHandlers()
    }

    initHandlers() {
        this.ws.on("message", async (message) => {
            const parsedMessage = JSON.parse(message.toString())
            switch (parsedMessage.type) {
                case "join":
                    const spaceId = parsedMessage.payload.spaceId
                    const token = parsedMessage.payload.token
                    if (!token) {
                        this.send({
                            type: "error",
                            payload: { message: "Token must be provided" }
                        });
                        this.ws.close();
                        return;
                    }

                    try {
                        const userId = (jwt.verify(token, JWT_SECRET) as JwtPayload).userId

                        if (!userId) {
                            this.ws.close()
                            return
                        }
                        console.log("eta samma pugyo")
                        this.userId = userId

                    } catch (error) {

                        this.send({
                            type: "error",
                            payload: { message: "Invalid or expired token" }
                        });
                        this.ws.close();
                        return;

                    }


                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId
                        }

                    })
                    if (!space) {
                        this.send({
                            type: "error",
                            payload: {
                                message: "Space not found"
                            }
                        })
                        this.ws.close()
                        return
                    }
                    this.spaceId = spaceId
                    this.x = Math.floor(Math.random() * space.width);
                    this.y = Math.floor(Math.random() * space.height);
                    RoomManager.getInstance().addUser(spaceId, this);

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            userId: this.userId,
                        },
                        users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id != this.id).map((u) => {
                            console.log("userid" + u.userId + " for this user " + u.id)
                            return {
                                id: u.userId,
                                x: u.x,
                                y: u.y,

                            };  // Correctly return the object with the `id` property
                        }) ?? []  // Fallback to an empty array if no users are present
                    })


                    RoomManager.getInstance().broadcast(spaceId, this, {
                        type: "user-join",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    })
                    break;

                case "move":
                    const x = parsedMessage.payload.x
                    const y = parsedMessage.payload.y
                    console.log("user ley move pathayo", x, y)

                    const xDisplacement = Math.abs(this.x - x)
                    const yDisplacement = Math.abs(this.y - y)
                    console.log("xDisplacement " + xDisplacement + " yDisplacement" + yDisplacement)
                    if (Math.abs(this.x - x) <= 5 && Math.abs(this.y - y) <= 5) {
                        this.x = x;
                        this.y = y;
                        console.log("id of user that send move is" + this.userId)
                        RoomManager.getInstance().broadcast(this.spaceId!, this, {
                            type: "move",
                            payload: {
                                userId: this.userId,
                                x: this.x,
                                y: this.y
                            }
                        })
                        return;
                    }

                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                    })

            }
        })
    }

    public destroy() {
        RoomManager.getInstance().broadcast(this.spaceId!, this, {
            type: "user-left",
            payload: {
                userId: this.userId
            }
        })
        RoomManager.getInstance().removeUser(this.spaceId!, this)

    }
    send(payload: outgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }

}