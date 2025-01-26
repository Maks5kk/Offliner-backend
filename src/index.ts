import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log("Server is live on port: ", PORT);
});
