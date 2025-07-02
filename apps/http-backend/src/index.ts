import express from "express";
import cors from "cors";
import { prismaClient } from "@repo/db/prisma";
import { consumeFromQueueForAlerts, pushManyToQueue } from "@repo/backend-common/rabbit";
import { redisService } from "../services/redis.service";
import authRouter from "../routes/auth.routes";
import addServiceRouter from "../routes/add_service.route";
import metricRouter from "../routes/metric.routes";
import websiteRouter from "../routes/website.routes";
import cookieParser from "cookie-parser";
import { sendEmail } from "../utils/sendOtp";

const app = express();
app.use(express.json());
const isDev=process.env.NODE_ENV==='developement';
if(!isDev){
  app.set("trust proxy", 1);
}
app.use(cookieParser());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use("/api/auth", authRouter);
app.use("/api/add-service", addServiceRouter);
app.use("/api", metricRouter);
app.use("/api", websiteRouter);

app.get("/status", async (req, res) => {
  const websiteId = req.query.websiteId as string
  const status = await prismaClient.websiteTick.findFirst({
    where: {
      id: websiteId
    }
  })

  res.json({
    status: status?.status
  })

});


app.get('/api/test', async (req, res) => {
  console.log("Hello from the server!")
  res.status(200).json({ message: "Hello from the server!" })
})


async function taskScheduler() {
  async function run() {
    try {
      const response = await prismaClient.website.findMany({
        select: { id: true, url: true },
      });

      if (response.length != 1) {
        await pushManyToQueue("task_Q", response);
        console.log(`Pushed ${response.length} tasks to queue.`);
      } else {
        console.log("No tasks found.");
      }
    } catch (e) {
      console.error("Error in taskScheduler:", e);
    } finally {
      setTimeout(run, 3000);
    }
  }

  run();
}


async function start_alerts() {
  consumeFromQueueForAlerts("alerts", sendEmailAlert);
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
      sendEmail(email, serviceName);
    console.log(`Email sent to ${email} for website ${url}.`);
    return true;
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


startServer();
taskScheduler();
start_alerts();
