import express from "express";
import authRoutes from "./auth.route";
import productRoute from "./product.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoute);

export default router;
