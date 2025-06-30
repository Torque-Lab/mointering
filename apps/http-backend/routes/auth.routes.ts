
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { signIn, signUp,refresh,logout,getProfile } from "../controllers/auth.controller";

const router:Router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh", refresh)
router.post("/logout", logout)
router.get("/session", getProfile);


export default router;