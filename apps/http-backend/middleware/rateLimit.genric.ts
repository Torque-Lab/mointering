import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../utils/otp";


export function genricRateLimiter(windowInMinutes:number,max:number){
    return rateLimit({
        store: new RedisStore({
            sendCommand: async (...args: string[])=>  (await getRedisClient()).sendCommand(args)
        }),
          windowMs: windowInMinutes * 60 * 1000,
          max: max,
          message: {
            status: 429,
            message: "Too many requests - try after some time.",
          },
          
    });
}
