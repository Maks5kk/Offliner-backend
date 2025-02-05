import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
