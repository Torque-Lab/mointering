import express from "express";
const app = express();
import { prismaClient } from "@repo/db/prisma";

import {pushManyToQueue} from "@repo/backend-common/rabbit"
app.use(express.json());

app.post("/website", async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      createdAt: new Date(),
    },
  });

  res.json({
    id: website.id,
  });
});

app.get("/status", async (req, res) => {
  const websiteId = req.query
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
  setInterval(async () => {
    try {
      const response = await prismaClient.website.findMany({
        select: { id: true, url: true },
      });

      if (response.length > 0) {
        await pushManyToQueue("task_Q", response);
        console.log(` Pushed ${response.length} tasks to queue.`);
      } else {
        console.log(" No tasks found.");
      }
    } catch (e) {
      console.error(" Error in taskScheduler:", e);
    }
  }, 3000);
}

 taskScheduler()

app.listen(process.env.PORT || 3001);
