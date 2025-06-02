import {consumeFromQueue} from "@repo/backend-common/rabbit"
import { prismaClient } from "@repo/db/prisma"
import axios from "axios"

async function poller(url:string,id:string){
    const response=await axios.post(url)
    const status=response.status
    const response_time_ms=2
    const regionName = "india";
    let region = await prismaClient.region.findFirst({
        where: { name: regionName }
    });

    if (!region) {
        region = await prismaClient.region.create({
            data: { name: regionName }
        });
    }

    const status_n = status == 200 ? "Up" : status == 500 ? "Down" : "Unknown";
    
    try {
        const websiteTick = await prismaClient.websiteTick.create({
            data: {
                response_time_ms: response_time_ms,
                status: status_n,
                region_id: region.id,
                website_id: id,
            }
        });
        return true;
    } catch (error) {
        console.error("Error creating website tick:", error);
        return false;
    }
}

async function start_task(){
        consumeFromQueue("task_Q",poller)
}
start_task()
