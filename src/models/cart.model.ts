import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface Cart extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const cartSchema = new Schema<Cart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const Cart: Model<Cart> = mongoose.model<Cart>("Cart", cartSchema);

export default Cart;
