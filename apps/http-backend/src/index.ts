import express from "express";
const app = express();
import { prismaClient } from "@repo/db/prisma";

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

app.get("/status/:websiteId", (req, res) => {

  
});

app.listen(process.env.PORT || 3001);
