import express from "express";
import {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    authLimiter,
    strictAuthLimiter,
    verificationLimiter,
    emailLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth);

router.post("/signup", authLimiter, signup);
router.post("/login", strictAuthLimiter, login);
router.post("/logout", logout);

router.post("/verify-email", verificationLimiter, verifyEmail);
router.post("/forgot-password", emailLimiter, forgotPassword);
router.post("/reset-password/:token", strictAuthLimiter, resetPassword);

export default router;
