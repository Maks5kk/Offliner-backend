import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model";
import { type SortOrder } from "mongoose";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, price_from, price_to, category, rating, sort, brand } =
      req.query;

    const query = {
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(price_from &&
        price_to && {
          price: { $gte: Number(price_from), $lte: Number(price_to) },
        }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(rating && { rating: { $gte: Number(rating) } }),
    };

    const sortOptions: { price: SortOrder } | undefined = sort
      ? { price: sort === "asc" ? 1 : -1 }
      : undefined;

    const products = await Product.find(query).sort(sortOptions);
    res.status(StatusCodes.OK).json(products);
    return;
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(req.params.id);

  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews.userId",
      select: "fullName",
    });
    if (!product) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "We can`t find this product" });
      return;
    }
    res.status(StatusCodes.OK).json(product);
    return;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error hgfdhfdgh" });
    return;
  }
};

export const addNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(StatusCodes.CREATED).json(newProduct);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error with creating a new product" });
  }
};
