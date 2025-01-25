import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { JWT_SECRET } from "../config";



export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    const token = header?.split(" ")[1];


    if (!token) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }
    try {
        const decoded = JWT.verify(token, JWT_SECRET) as { role: string, userId: string }
        console.log("Generated Token Payload:", decoded);
        req.userId = decoded.userId
        next()

    } catch (error) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }


}