import z from "zod"

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
    type: z.enum(["user", "admin"])
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string()
})

export const AddElementSchema = z.object({
    elementId: z.string(),
    spaceId: z.string(),
    x: z.number(),
    y: z.number()
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean()
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const CreateAvatar = z.object({
    imageUrl: z.string(),
    name: z.string()
})

const defaultElementSchema = z.object({
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const CreateMap = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(defaultElementSchema)
})


declare global {
    namespace Express {
        export interface Request {
            userId: string
        }
    }
}
