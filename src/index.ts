import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import upload from "./middlewares/upload.middleware";
import path from "path";
import fs from "fs";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(upload.single("profilePicFile"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

connectDB();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server is live on port: ", PORT);
});
