
import { Router } from "express";
import { startGithubAuth } from "../controllers/auth.with.github";
import { githubCallbackMiddleware } from "../controllers/auth.with.github";
import { handleGithubCallback } from "../controllers/auth.with.github";
const router:Router = Router();
router.get('/github', startGithubAuth());
router.get('/github/callback', githubCallbackMiddleware, handleGithubCallback);
export default router;
