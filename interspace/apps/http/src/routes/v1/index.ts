import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@interspace/db/client"
import { hash, compare } from "../../scrypt"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
    const parsedResponse = SignupSchema.safeParse(req.body)
    if (!parsedResponse.success) {
        res.status(400).json({

            message: "Validation Failed"
        })
        return
    }
    const hashedPassword = await hash(parsedResponse.data.password);

    try {
        const user = await client.user.create({
            data: {
                username: parsedResponse.data.username,
                password: hashedPassword,
                role: parsedResponse.data.type == "admin" ? "Admin" : "User"
            }
        })
        res.json({
            userId: user.id
        })
    } catch (error) {
        res.status(400).json({

            message: "User already exists"
        })


    }
})
router.post("/signin", async (req, res) => {
    const parsedResponse = SigninSchema.safeParse(req.body);
    if (!parsedResponse.success) {
        res.status(403).json({
            message: "Validation Failed"
        })
        return
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedResponse.data.username
            }
        })

        if (!user) {
            res.status(403).json({
                message: "user not verified"
            })
            return
        }

        const isValid = await compare(parsedResponse.data.password, user.password)

        if (!isValid) {
            res.status(403).json({
                message: "Wrong password"
            })
            return
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET)

        res.json({
            token: token
        })


    } catch (error) {
        res.status(400).json({
            message: "User can't signin"
        })


    }
})


router.get("/elements", (req, res) => {

})

router.get("/avatars", (req, res) => {

})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)
