import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateSignup } from "../validators/auth.validator";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authMiddleware, checkAuth);
router.put("/update", authMiddleware, updateProfile);

export default router;
