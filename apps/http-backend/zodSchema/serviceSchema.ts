import { z } from "zod";

export const ServiceSchema=z.object({
    serviceName:z.string().min(4).max(69),
    url:z.string(),
    email:z.string().email(),
})

export type ServiceSchema= z.infer<typeof ServiceSchema>