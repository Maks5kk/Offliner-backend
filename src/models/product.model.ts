import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface Review {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  comment: string;
  rating: number;
}

interface Specification {
  label: string;
  value: string;
}

interface Type {
  label: string;
  value: string;
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
  specifications: Specification[];
  types: Type[];
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
        fullName: { type: String },
        comment: { type: String },
        rating: { type: Number },
      },
    ],
    specifications: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    types: [
      {
        label: { type: String },
        value: { type: String },
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
