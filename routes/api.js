import { Router } from "express";
import authRouter from "./auth.js";

const router = Router();

// Mount /api/auth router
router.use("/auth", authRouter);

export default router;
