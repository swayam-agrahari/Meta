import { Router } from "express";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
import client from "@interspace/db/client"
import { userMiddleware } from "../../middleware/user";
import { adminMiddleware } from "../../middleware/admin";

export const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, async (req, res) => {

    console.log("endopibnt")
    const parsedData = CreateSpaceSchema.safeParse(req.body)

    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }
    if (!parsedData.data.mapId) {
        console.log("Creating space without mapid")
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        })
        res.json({
            spaceId: space.id
        })
        return
    }

    console.log("Creating space with mapid")
    const map = await client.map.findFirst({
        where: {
            id: parsedData.data.mapId
        },
        select: {
            mapElements: true,
            width: true,
            height: true
        }
    })
    if (!map) {
        res.status(400).json({
            message: "No map found"
        })
        return
    }

    let space = await client.$transaction(async () => {
        console.log("Creating space for transaction")
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!
            }
        })
        console.log("Creating space elements")
        await client.spaceElements.createMany({
            data: map.mapElements.map((e) => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!,

            }))
        })
        console.log("Returning space", space.id)
        return space
    })
    console.log("space crated")
    res.json({
        spaceId: space.id
    })

})
spaceRouter.delete("/element", userMiddleware, async (req, res) => {
    console.log("/elements")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return
    }
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        },
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({ message: "Unauthorized" })
        return
    }
    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({ message: "Element deleted" })
})

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
    const spaceId = req.params.spaceId;
    if (!spaceId) {
        res.status(400).json({
            message: "No space id provided"
        })
        return
    }
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }
    })

    if (!space) {
        res.status(400).json({
            message: "No space found"
        })
        return
    }
    if (space.creatorId !== req.userId) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }

    await client.space.delete({
        where: {
            id: spaceId
        }
    })
    res.json({
        message: "Space deleted"
    })

})
spaceRouter.get("/all", userMiddleware, async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
        }
    })
    if (spaces.length == 0) {
        res.json({
            spaces: []
        })
        return
    }
    res.json({
        spaces: spaces.map((s) => ({
            id: s.id,
            name: s.name,
            dimensions: `${s.width}x${s.height}`,
            thumbnail: s.thumbnail
        }))
    })

})

spaceRouter.get("/:spaceId", async (req, res) => {
    const spaceId = req.params['spaceId'];

    const space = await client.space.findFirst({
        where: {
            id: spaceId
        },
        include: {
            spaceElements: {
                include: {
                    element: true
                }
            },
        }
    })
    if (!space) {
        res.status(400).json({
            message: "No space found"
        })
        return
    }
    res.json({
        "dimensions": `${space.width}x${space.height}`,
        "elements": space.spaceElements.map((e, i) => ({
            id: e.id,
            element: {
                "id": e.element.id,
                "imageUrl": e.element.imageUrl,
                "static": e.element.static,
                "width": e.element.width,
                "height": e.element.height,
            },
            x: e.x,
            y: e.y
        }))
    })

})
spaceRouter.post("/element", userMiddleware, async (req, res) => {


    const parsedData = AddElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation error"
        })
        return
    }

    const space = await client.space.findUnique({
        where: {
            id: parsedData.data.spaceId,
            creatorId: req.userId
        },
        select: {
            width: true,
            height: true,

        }
    })
    if (!space) {
        res.status(400).json({
            message: "No space found"
        })
        return
    }
    if (parsedData.data.x > space.width || parsedData.data.y > space.height || parsedData.data.x < 0 || parsedData.data.y < 0) {
        res.status(400).json({
            message: "Element out of bounds"
        })
        return
    }

    const spaceElement = await client.spaceElements.create({
        data: {
            spaceId: parsedData.data.spaceId,
            elementId: parsedData.data.elementId,
            x: parsedData.data.x,
            y: parsedData.data.y
        }
    })

    if (!spaceElement) {
        res.status(400).json({
            message: "Element not added"
        })
        return
    }

    res.json({
        message: "Element added"
    })

})
