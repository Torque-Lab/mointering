import { Router, type Request, type Response, type NextFunction } from "express";
import { getWebsites } from "../controllers/website.controller";

const router:Router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get("/websites", asyncHandler(getWebsites));

export default router;
