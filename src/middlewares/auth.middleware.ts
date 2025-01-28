import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - no token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
