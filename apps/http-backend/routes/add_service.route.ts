import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createService } from "../controllers/add_service.controller";

const router:Router = Router();

router.post("/add-service",authenticate,createService)

export default router;  