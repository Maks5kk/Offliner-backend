import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/utils";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { transporter } from "../lib/transporter";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
      return;
    }

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id.toString(), res);

    res.status(StatusCodes.OK).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
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
      return;
    }

    generateToken(user._id.toString(), res);

    res.status(StatusCodes.OK).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
    return;
  } catch (error) {
    console.error("Error in login controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(StatusCodes.OK).json({ message: "Logged out successfully!" });
    return;
  } catch (error) {
    console.error("Error in logout controller", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    return;
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(StatusCodes.OK).json((req as any).user);
    return;
  } catch (error) {
    console.error("Error in checkAuth controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: " Internal Server Error" });
    return;
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user._id;
  const { newFullName, newEmail, currentPassword, newPassword } = req.body;

  const newImage = req.file?.path;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    if (newEmail && newEmail !== user.email) user.email = newEmail;
    if (newFullName && newFullName !== user.fullName)
      user.fullName = newFullName;

    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Current password is incorrect" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (newImage) {
      user.profilePic = `${req.protocol}://${req.get("host")}/uploads/${
        req.file?.filename
      }`;
    }

    await user.save();

    res.status(StatusCodes.OK).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfile controller", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body.data;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
    return;
  }

  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  await transporter.sendMail({
    to: email,
    subject: "Password reset",
    html: `<p>Нажмите <a href="${resetLink}">здесь</a>, чтобы сбросить пароль.</p>`,
  });

  res.status(StatusCodes.OK).json({ message: "Mail has been sended!" });
  return;
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(decoded.userId);
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found!" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ message: "Password has been changed!" });
    return;
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid or expired token!" });
    return;
  }
};
