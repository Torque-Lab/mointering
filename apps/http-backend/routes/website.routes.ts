import { Router, type Request, type Response, type NextFunction } from "express";
import { getWebsites } from "../controllers/website.controller";
import { authenticate } from "../middleware/auth.middleware";
import { genricRateLimiter } from "../middleware/rateLimit.genric";
const router:Router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get("/websites", authenticate,genricRateLimiter(15,100),asyncHandler(getWebsites));

export default router;
