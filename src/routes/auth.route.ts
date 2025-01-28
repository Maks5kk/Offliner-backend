import express, { Request, Response } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

export default router;
