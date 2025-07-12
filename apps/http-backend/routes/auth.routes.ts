
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { signIn, signUp,refresh,logout,getSession, forgotPassword, resetPassword,csurf } from "../controllers/auth.controller";
import { genricRateLimiter } from "../middleware/rateLimit.genric";


const router:Router = Router();

router.post("/sign-up",genricRateLimiter(15,100),signUp);
router.post("/sign-in",genricRateLimiter(15,100),signIn);
router.post("/forgot-password",genricRateLimiter(15,100),forgotPassword);
router.post("/reset-password",genricRateLimiter(15,100),resetPassword);
router.post("/refresh",genricRateLimiter(15,100), refresh)
router.post("/logout",genricRateLimiter(15,100), logout)
router.get("/session",genricRateLimiter(15,100),authenticate,getSession);
router.get("/csurf",genricRateLimiter(15,100),csurf);


export default router;