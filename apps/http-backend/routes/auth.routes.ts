
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { signIn, signUp,refresh,logout,getProfile } from "../controllers/auth.controller";
import { genricRateLimiter } from "../middleware/rateLimit.genric";


const router:Router = Router();

router.post("/sign-up",genricRateLimiter(15,100),signUp);
router.post("/sign-in",genricRateLimiter(15,100),signIn);
router.post("/refresh",genricRateLimiter(15,100), refresh)
router.post("/logout",genricRateLimiter(15,100), logout)
router.get("/session",genricRateLimiter(15,100),getProfile);


export default router;