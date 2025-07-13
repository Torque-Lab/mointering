import { DeleteServiceSchema, ServiceSchema } from "../zodSchema/serviceSchema";
import {Request, Response} from "express"
import {prismaClient} from "@repo/db"

export const createService=async(req:Request,res:Response)=>{
  
      try {
        const parsedData = ServiceSchema.safeParse(req.body);
           if(!parsedData.success) {
             res.status(400).json({ error: "Invalid data",success:false });
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
           res.status(201).json({ message: "Service added successfully",serviceId:website.id ,success:true});   
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add service, please try again after some time",success:false });
      }
}

export const deleteService=async(req:Request,res:Response)=>{
  try {
    const websiteId=DeleteServiceSchema.parse(req.body) 
    const userId=req.userId!
    await prismaClient.$transaction(async(tx)=>{
      await tx.website.update({
        where:{
          id:websiteId.id,
          user_id:userId
        },
        data:{
          isDeleted:true
        }
      })
    },{ 
      isolationLevel: "Serializable"
    })
    res.status(200).json({ message: "Service deleted successfully",success:true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete service, please try again after some time",success:false });
  }
}