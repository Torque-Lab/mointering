
import {consumeFromQueue} from "@repo/backend-common/rabbit"
import { prismaClient } from "@repo/db/prisma"
import axios from "axios"
async function poller(url:string,id:string){
    const response=await axios.post(url)
    const status=response.status
    const response_time_ms=response.data.response_time_ms
    const region_id=response.data.region_id
    const website_id=response.data.website_id
    const region=response.data.region
    let status_n:"Up" | "Down" | "Unknown"
status_n=status==200?"Up":status==500?"Down":"Unknown"
    const websiteTick=await prismaClient.websiteTick.create({
        data:{
            id:id,
            response_time_ms:response_time_ms,
            status:status_n,
            region_id:region_id,
            website_id:website_id,
            region:region,
        }
    })
    return true
}
async function start_task(){
        consumeFromQueue("task_Q",poller)

}
start_task()
