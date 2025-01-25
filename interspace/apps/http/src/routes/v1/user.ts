import { Router } from "express";
import client from "@interspace/db/client"
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();
userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Input validation error"
        })
        return
    }

    try {
        const response = await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })

        if (!response) {
            res.status(400).json({
                message: "Metadata update failed"
            })
            return
        }
        res.json({
            message: "Metadata updates successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "Metadata update failed"
        })

    }


})

userRouter.get("/metadata/bulk", userMiddleware, async (req, res) => {
    const array = (req.query.ids ?? "[]") as string;
    const newArr = (array).slice(1, array?.length - 1).split(",");
    try {
        const response = await client.user.findMany({
            where: {
                id: {
                    in: newArr
                }
            },
            select: {
                avatar: true,
                id: true
            }
        })
        
        res.json({
            avatars: response.map((t) => ({
                userId: t.id,
                avatarId: t.avatar?.imageUrl
            }))
        })
    } catch (error) {

        res.json({
            message: "wrong query params"
        })
        return

    }


})
