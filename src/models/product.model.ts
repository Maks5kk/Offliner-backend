import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface Review {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  comment: string;
  rating: number;
}

export interface Product extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  colors: [string];
  stock: number;
  image: string;
  rating: number;
  price: number;
  reviews: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    colors: {
      type: [String],
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Product: Model<Product> = mongoose.model<Product>(
  "Product",
  productSchema
);

export default Product;
