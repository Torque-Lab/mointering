
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { signIn, signUp,refresh,logout } from "../controllers/auth.controller";

const router:Router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh", authenticate,refresh)
router.post("/logout", authenticate,logout)

export default router;