import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Unauthorized - no token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Unauthorized - invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Internal Server Error" });
  }
};
