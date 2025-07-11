import { consumeFromQueue, pushToQueue } from "@repo/backend-common"
import { prismaClient } from "@repo/db"
import axios from "axios"
const BATCH_SIZE = 100; 
const BATCH_TIMEOUT_MS = 5000;
const regionName = process.env.REGION_NAME || "India";

interface Batch{
    response_time_ms: number;
    status: 'Up' | 'Down' | 'Unknown';
    website_id: string;
    createdAt: Date;
}

let batch: Batch[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

async function processBatch() {
    if (batch.length === 0) return;

    const currentBatch = [...batch];
    batch = [];
    
    try {
        if(!regionName){
            return
        }
        let region = await prismaClient.region.findFirst({
            where: { name: regionName },
        });

        if (!region) {
            region = await prismaClient.region.create({
                data: { name: regionName },
            });
        }

        const batchData = currentBatch.map(item => ({
            response_time_ms: item.response_time_ms,
            status: item.status,
            region_id: region.id,
            website_id: item.website_id,
            createdAt: item.createdAt
        }));

        await prismaClient.websiteTick.createMany({
            data: batchData,
            skipDuplicates: true
        });

        console.log(`Processed batch of ${currentBatch.length} items`);
    } catch (error) {
        console.error("Error processing batch:", error);
    }
}

async function poller(url: string, id: string) {
    try {
        const startTime = Date.now();
        const response = await axios.get(url, { timeout: 10000 }); 
        const responseTime = Date.now() - startTime;
        
        const status = response.status === 200 ? "Up" : 
                      (response.status === 500 ? "Down" : "Unknown");
        
        if(status === "Down"){
           await pushToQueue("alerts", { url, id });
        }

        batch.push({
            website_id: id,
            response_time_ms: responseTime,
            status: status,
            createdAt: new Date()
        });

       
        if (batch.length >= BATCH_SIZE) {
            await processBatch();
            if (batchTimeout) {
                clearTimeout(batchTimeout);
                batchTimeout = null;
            }
        } 
       
        else if (!batchTimeout) {
            batchTimeout = setTimeout(() => {
                processBatch().finally(() => {
                    batchTimeout = null;
                });
            }, BATCH_TIMEOUT_MS);
        }

        return true;
    } catch (error) {
        console.error(`Error polling ${url}:`, error);

        return false;
    }
}


async function start_task() {
    await consumeFromQueue("task_Q", poller);
    console.log("worker started");
            }

start_task();

process.on('SIGTERM', async () => {
    if (batch.length > 0) {
        console.log('Processing final batch before shutdown...');
        await processBatch();
    }
    process.exit(0);
});
