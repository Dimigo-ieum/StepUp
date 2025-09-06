import { Router } from "express";
import authRouter from "./auth.js";

const router = Router();

// Mount /api/auth router
router.use("/auth", authRouter);

router.use(function (req, res, next) {
  next(createError(404));
});

export default router;
