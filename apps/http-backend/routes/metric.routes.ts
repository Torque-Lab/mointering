import { Router, Request, Response, NextFunction, IRouter } from "express";
import { getMetrics, getUptimeSummary } from "../controllers/metric.controller";

const router: IRouter = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get("/metrics/:id", asyncHandler(getMetrics));
router.get("/metrics/:id/uptime-summary", asyncHandler(getUptimeSummary));

export default router;
