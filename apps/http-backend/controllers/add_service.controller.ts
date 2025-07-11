import { ServiceSchema } from "../zodSchema/serviceSchema";
import {Request, Response} from "express"
import {prismaClient} from "@repo/db"

export const createService=async(req:Request,res:Response)=>{
  
      try {
        const parsedData = ServiceSchema.safeParse(req.body);
           if(!parsedData.success) {
             res.status(400).json({ error: "Invalid data" });
             return;
           }
           const {serviceName,url ,email}=parsedData.data
           const  user_id=req.userId!
           const website=await prismaClient.website.create({
            data:{
                serviceName,
                url,
                email,
                user_id
            }
           })
           res.status(201).json({ message: "Website created successfully",serviceId:website.id });   
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create website" });
      }
}
