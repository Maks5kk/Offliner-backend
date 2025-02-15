import express from "express";
import { addToFavorite, getFavorite } from "../controllers/favorite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getFavorite);
router.post("/add", authMiddleware, addToFavorite);

export default router;
