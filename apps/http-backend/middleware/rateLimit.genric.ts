import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisService } from "../services/redis.service";

const client = redisService.getClient();
export function genricRateLimiter(windowInMinutes:number,max:number){
    return rateLimit({
        store: new RedisStore({
            sendCommand: async (...args: string[])=>client.sendCommand(args)
        }),
          windowMs: windowInMinutes * 60 * 1000,
          max: max,
          message: {
            status: 429,
            message: "Too many requests - try after some time.",
          },
          
    });
}
