import { outgoingMessage } from "./types";
import { User } from "./User";

export class RoomManager {
    rooms: Map<string, User[]>
    static instance: RoomManager

    static getInstance() {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager()
        }
        return RoomManager.instance
    }

    private constructor() {
        this.rooms = new Map()
    }


    public addUser(spaceId: string, user: User) {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user])
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user])
    }
    public removeUser(spaceId: string, user: User) {
        if (!this.rooms.has(spaceId)) {
            return
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId) ?? []).filter((u) => u.id !== user.id))
    }

    public broadcast(roomId: string, user: User, message: outgoingMessage) {
        if (!this.rooms.has(roomId)) {
            console.error("Room not found")
            return
        }

        this.rooms.get(roomId)?.forEach((u) => {
            if (u.id !== user.id) {
                u.send(message)
            }
        })
    }
}