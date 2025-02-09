import express from "express";
import authRoutes from "./auth.route";
import productRoutes from "./product.route";
import cartRoutes from "./cart.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

export default router;
