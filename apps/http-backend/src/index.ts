import express from "express";
import cors from "cors";
const app = express();
import { prismaClient } from "@repo/db/prisma";

import {pushManyToQueue} from "@repo/backend-common/rabbit"
app.use(express.json());

app.use(cors());

app.post("/website", async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      createdAt: new Date(),
      user_id: req.body.userId,
    },
  });

  res.json({
    id: website.id,
  });
});

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

      if (response.length > 0) {
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

taskScheduler();


app.listen(process.env.PORT || 3001 ,()=>{
    console.log("Server started on port 3001");
});
