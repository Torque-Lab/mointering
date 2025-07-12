
console.log("Running from:", process.cwd());
console.log("NODE_PATH:", process.env.NODE_PATH || 'not set');
console.log("NODE_ENV:", process.env.NODE_ENV || 'not set');
console.log("NODE_VERSION:", process.env.NODE_VERSION || 'not set');

import express from "express";
import { prismaClient } from "@repo/db";
import { consumeFromQueueForAlerts, pushManyToQueue } from "@repo/backend-common";
import { redisService } from "../services/redis.service";
import authRouter from "../routes/auth.routes";
import addServiceRouter from "../routes/add_service.route";
import metricRouter from "../routes/metric.routes";
import websiteRouter from "../routes/website.routes";
import cookieParser from "cookie-parser";
import { sendEmail } from "../utils/sendOtp";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const isDev=process.env.NODE_ENV==='developement';
if(!isDev){
  app.set("trust proxy", 1);
}

app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api", addServiceRouter);
app.use("/api", metricRouter);
app.use("/api", websiteRouter);

app.get("/api/health", (req:Request, res:Response) => {
  res.status(200).json({ message: "Server is running" });
})

interface service{
    id:string;
    url:string;
}
let cachedData: service[] = [];
let previousCount: number = 0;
let isRunning: boolean = false;

async function taskScheduler() {
  async function run() {

    if (isRunning) {
      console.log('Skipping task as the previous one is still running...');
      return;
    }
    isRunning = true;
    try {
      const currentCount = await prismaClient.website.count();

      if (currentCount !== previousCount) {
        const response = await prismaClient.website.findMany({
          select: { id: true, url: true },
        });

        cachedData = response; 
        previousCount = currentCount; 
        console.log(`Data count changed. New count: ${currentCount}`);
      } else {
        console.log("Data count is the same. Using cached data.");
      }
      await pushManyToQueue("task_Q", cachedData);  
      console.log(`Pushed ${cachedData.length} tasks to queue.`);
    } catch (e) {
      console.error("Error in taskScheduler:", e);
    }finally{
      isRunning = false;
    }
  }

  const intervalId = setInterval(run, 10000); 
  return intervalId;
}
async function start_alerts() {
  await consumeFromQueueForAlerts("alerts", sendEmailAlert);
}

async function sendEmailAlert(url: string, id: string) {
  try {
    const website = await prismaClient.website.findUnique({
      where: { id },
    });
    if (!website) {
      console.log(`Website with id ${id} not found.`);
      return false;
    }
    const { email,serviceName } = website;
    if (!email) {
      console.log(`No email found for website with id ${id}.`);
      return false;
    }
      if(await sendEmail(email, serviceName)){
        console.log(`Email sent to ${email} for website ${url}.`);
        return true;
      }
    return false;
  } catch (error) {
    console.error(`Error sending email for website ${url}:`, error);
    return false;
  }
} 

async function startServer() {
  try {
    await redisService.connect();
    console.log('Connected to Redis');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
taskScheduler();
start_alerts();
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down ......');
  try {
    await redisService.disconnect();
    console.log('Redis connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});