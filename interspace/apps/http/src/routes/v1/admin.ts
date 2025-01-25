import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { CreateAvatar, CreateElementSchema, CreateMap, UpdateElementSchema } from "../../types";
import client from "@interspace/db/client"

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }

    try {
        const element = await client.element.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                width: parsedData.data.width,
                height: parsedData.data.height,
                static: parsedData.data.static
            }
        })

        res.json({
            elementId: element.id
        })

    } catch (error) {
        res.status(400).json({
            message: "Element creation failed"
        })
    }


})

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
    const elementId = req.params.elementId;
    console.log("el", elementId)

    const parsedData = UpdateElementSchema.safeParse(req.body)

    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }

    try {
        const element = await client.element.update({
            where: {
                id: elementId
            },
            data: {
                imageUrl: parsedData.data.imageUrl
            }
        })
        console.log(element)
        if (!element) {
            res.status(400).json({
                message: "Element not found"
            })
            return
        }
        res.json({
            message: "Element updated"
        })


    } catch (error) {

        res.status(400).json({
            message: "Element update failed"
        })
    }


})
adminRouter.post("/avatar", adminMiddleware, async (req, res) => {
    const parsedData = CreateAvatar.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }

    try {
        const avatar = await client.avatar.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                name: parsedData.data.name
            }
        })

        res.json({
            avatarId: avatar.id
        })

    } catch (error) {
        res.status(400).json({
            message: "Avatar creation failed"
        })
    }

})
adminRouter.post("/map", adminMiddleware, async (req, res) => {
    const parsedData = CreateMap.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }

    try {
        const map = await client.map.create({
            data: {
                name: parsedData.data.name,
                thumbnail: parsedData.data.thumbnail,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                mapElements: {
                    create: parsedData.data.defaultElements.map((e) => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            }
        })

        res.json({
            mapId: map.id
        })

    } catch (error) {
        res.status(400).json({
            message: "Map creation failed"
        })

    }




})