import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server is live on port: ", PORT);
});
