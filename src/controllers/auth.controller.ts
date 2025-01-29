import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
      return;
    }

    const { name, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in signup controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    generateToken(user._id.toString(), res);

    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(StatusCodes.OK).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.error("Error in logout controller", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(StatusCodes.OK).json((req as any).user);
  } catch (error) {
    console.error("Error in checkAuth controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: " Internal Server Error" });
  }
};
