import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart.model";
import { Request, Response } from "express";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price image stock",
    });
    if (!cart) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(StatusCodes.OK).json(cart);
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user._id;
  const { productId, quantity, type } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    itemIndex > -1
      ? (cart.items[itemIndex].quantity += quantity)
      : cart.items.push({ productId, quantity, type });

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price image stock",
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Product added to cart", cart: updatedCart });
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user._id;
  const { productId } = req.body;

  console.log(productId);

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price image stock",
    });

    res
      .status(200)
      .json({ message: "Product removed from cart", cart: updatedCart });
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as any).user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Cart not found" });
      return;
    }

    cart.items = [];
    await cart.save();

    res.status(StatusCodes.OK).json({ message: "Cart cleaned", cart });
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};
