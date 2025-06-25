import express from "express";
import cors from "cors";
const app = express();
import { prismaClient } from "@repo/db/prisma";
import { pushManyToQueue } from "@repo/backend-common/rabbit";
import authRouter from "../routes/auth.routes";
import addServiceRouter from "../routes/add_service.route";
import metricRouter from "../routes/metric.routes";
import websiteRouter from "../routes/website.routes";

  app.use(express.json());
  
  // Configure CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use("/auth", authRouter);
app.use("/add-service", addServiceRouter);
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
    status:status?.status
  })

});


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

// taskScheduler();


app.listen(process.env.PORT || 3001 ,()=>{
    console.log("Server started on port 3001");
});
