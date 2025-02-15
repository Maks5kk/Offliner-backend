import { Request, Response } from "express";
import Favorite from "../models/favorite.model";
import { StatusCodes } from "http-status-codes";

export const getFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user._id;

  try {
    const favorite = await Favorite.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price image stock",
    });
    if (!favorite) {
      res.status(404).json({ message: "Favorite not found" });
      return;
    }

    res.status(StatusCodes.OK).json(favorite);
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const addToFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user._id;
  const { productId } = req.body;

  try {
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({ userId, items: [] });
    }

    const itemIndex = favorite.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    itemIndex > -1
      ? favorite.items.splice(itemIndex, 1)
      : favorite.items.push({ productId });

    await favorite.save();

    const updatedFavorite = await Favorite.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price image",
    });

    res.status(StatusCodes.OK).json({
      message: "Favorite list updated successfully",
      favorite: updatedFavorite,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};
