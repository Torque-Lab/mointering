import { z } from "zod";

export const ServiceSchema=z.object({
    serviceName:z.string().min(4).max(69),
    url:z.string(),
    email:z.string().email()
})

export type ServiceSchema= z.infer<typeof ServiceSchema>

export const DeleteServiceSchema=z.object({
    id:z.string()
})

export type DeleteServiceSchema= z.infer<typeof DeleteServiceSchema>