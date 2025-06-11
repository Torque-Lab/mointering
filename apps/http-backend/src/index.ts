import express from "express";
import cors from "cors";
const app = express();
import { prismaClient } from "@repo/db/prisma";
import {pushManyToQueue} from "@repo/backend-common/rabbit"
app.use(express.json());

app.use(cors());

app.post("/sign-up",async(req,res)=>{

  const {username,password}=req.body 
  if(!username &&!password){
    return
  }
  const response= await prismaClient.user.create({
    data:{
      username:username,
      password:password
    },
  })

  res.json({
    response
  })

})
app.post("/website", async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
  try{
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
  }catch(e){
    console.log("error making entry...",e)
    res.status(500).json(e)
  }

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

app.get('/api/website/:id/metrics', async (req, res) => {
  const { id } = req.params;
  const { from, to, interval = '1h' } = req.query;
  try{
    
  const metrics = await prismaClient.$queryRaw`
  SELECT 
    time_bucket(${interval}::interval, "createdAt") as bucket,
    AVG(response_time_ms) as avg_response_time,
    COUNT(CASE WHEN status = 'Up' THEN 1 END) as uptime_count,
    COUNT(*) as total_checks
  FROM "website_tick"
  WHERE website_id = ${id}
    AND "createdAt" >= ${new Date(from as string)}
    AND "createdAt" <= ${new Date(to as string)}
  GROUP BY bucket
  ORDER BY bucket DESC
`;

res.json({metrics});

  }catch(e){
    console.log("error fetching metrix data..",e)
  }
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

taskScheduler();


app.listen(process.env.PORT || 3001 ,()=>{
    console.log("Server started on port 3001");
});
