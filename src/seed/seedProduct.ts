import mongoose from "mongoose";
import Product from "../models/product.model";
import { faker } from "@faker-js/faker";
import { connectDB } from "../lib/db";
import dotenv from "dotenv";

dotenv.config();

const COLORS = [
  "red",
  "blue",
  "black",
  "white",
  "green",
  "yellow",
  "pink",
  "gray",
  "gold",
  "silver",
];

const getRandomColors = (): string[] => {
  const colorCount = faker.number.int({ min: 1, max: 5 });
  return faker.helpers.arrayElements(COLORS, colorCount);
};

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Existing products removed");

    const products = Array.from({ length: 100 }).map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      stock: faker.number.int({ min: 1, max: 100 }),
      image: `${faker.image.url({
        width: 640,
        height: 480,
      })}?random=${faker.string.uuid()}`,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      colors: getRandomColors(),
      reviews: Array.from({
        length: faker.number.int({ min: 0, max: 4 }),
      }).map(() => ({
        userId: new mongoose.Types.ObjectId(),
        comment: faker.lorem.sentence(),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      })),
    }));

    await Product.insertMany(products);
    console.log("100 products created successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(seedProducts);
