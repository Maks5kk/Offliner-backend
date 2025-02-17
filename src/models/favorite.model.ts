import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface FavoriteItem {
  productId: Types.ObjectId;
}

export interface Favorite extends Document {
  userId: Types.ObjectId;
  items: FavoriteItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const favoriteSchema = new Schema<Favorite>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
    ],
  },
  { timestamps: true }
);

const Favorite: Model<Favorite> = mongoose.model<Favorite>(
  "Favorite",
  favoriteSchema
);

export default Favorite;
