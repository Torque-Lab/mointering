import { Router, Request, Response, NextFunction, IRouter } from "express";
import { getMetrics, getUptimeSummary } from "../controllers/metric.controller";
import { genricRateLimiter } from "../middleware/rateLimit.genric";
const router: IRouter = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get("/metrics/:id", genricRateLimiter(15,100),asyncHandler(getMetrics));
router.get("/metrics/:id/uptime-summary", genricRateLimiter(15,100),asyncHandler(getUptimeSummary));

export default router;
  