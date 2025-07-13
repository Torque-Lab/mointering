import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createService, deleteService } from "../controllers/add_service.controller";

const router:Router = Router();

router.post("/add-service",authenticate,createService)
router.post("/delete-service",authenticate,deleteService)

export default router;  