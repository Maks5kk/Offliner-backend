import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes"; 
import Product from "../models/product.model"; 
 
export const getAllProducts = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const products = await Product.find(); 
        res.status(StatusCodes.OK).json(products); 
        return; 
    } catch (error) { 
        console.error("Error fetching products:", error); 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
        return; 
    } 
}; 
 
export const getProductById = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const product = await Product.findById(req.params.id); 
        if (!product) { 
            res.status(StatusCodes.BAD_REQUEST).json({ message: "We can`t find this product" }) 
            return; 
        } 
        res.status(StatusCodes.OK).json(product); 
        return; 
    } catch (error) { 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" }); 
        return; 
    } 
} 
 
export const addNewProduct = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const newProduct = new Product(req.body); 
        await newProduct.save(); 
        res.status(StatusCodes.CREATED).json(newProduct); 
    } catch (error) { 
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Error with creating a new product" }) 
    } 
}