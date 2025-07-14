
import { Router } from "express";
import { googleCallbackMiddleware, handleGoogleCallback, startGoogleAuth } from "../controllers/auth.with.google";
import { RequestHandler } from "express";

const router:Router = Router();

router.get("/google", startGoogleAuth());
router.get("/google/callback", googleCallbackMiddleware, handleGoogleCallback );

export default router;  