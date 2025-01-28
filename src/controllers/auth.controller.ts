import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";

export const signup = async (req: Request, res: Response): Promise<void> => {
  //хз, правильные ли типы, но вроде как да
  const { name, lastName, email, password } = req.body;

  try {
    if (!name || !lastName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    //проверка на существующего юзера
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
    }

    //хэширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      lastname: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logget out successfully!" });
  } catch (error) {
    console.error("Error in logout controller", error);
    res.status(500).json("Internal Server Error");
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json((req as any).user);
  } catch (error) {
    console.error("Error in checkAuth controller", error);
    res.status(500).json({ message: " Internal Server Error" });
  }
};
