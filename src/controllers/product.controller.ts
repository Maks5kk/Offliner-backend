import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, price_from, price_to, category, rating, sort } = req.query;

    let query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (price_from && price_to) {
      query.price = { $gte: Number(price_from), $lte: Number(price_to) };
    }
    if (category) {
      query.category = category;
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const sortOptions: { [key: string]: "asc" | "desc" } = {};

    if (sort === "asc") {
      sortOptions.price = "asc";
    } else if (sort === "desc") {
      sortOptions.price = "desc";
    }

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
  try {
    const product = await Product.findById(req.params.id);
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
      .json({ message: "Internal Server Error" });
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
