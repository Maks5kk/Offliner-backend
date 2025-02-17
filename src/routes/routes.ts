import express from "express";
import authRoutes from "./auth.route";
import productRoutes from "./product.route";
import cartRoutes from "./cart.route";
import favoriteRoutes from "./favorite.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/favorite", favoriteRoutes);

export default router;
