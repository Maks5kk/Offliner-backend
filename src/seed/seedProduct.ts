import mongoose from "mongoose";
import Product from "../models/product.model";
import { faker } from "@faker-js/faker";
import { connectDB } from "../lib/db";
import dotenv from "dotenv";

dotenv.config();

const CATEGORIES = ["Laptop", "Smartphone", "Computer"];

const BRAND = ['Apple', 'Xiaomi', 'Huawei', "Samsung", 'Bosch', 'Honor',]

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

const getRandomImage = (category: string): string => {
  switch (category) {
    case "Laptop":
      return `https://prod-api.mediaexpert.pl/api/images/gallery/thumbnails/images/64/6432426/Laptop-APPLE-MacBook-Air-2024-01.jpg`;
    case "Smartphone":
      return `https://www.apple.com/pl/iphone/home/images/meta/iphone__kqge21l9n26q_og.png`;
    case "Computer":
      return `https://www.discount-computer.com/product_images/uploaded_images/computer-screen.jpg`;
    default:
      return `https://source.unsplash.com/640x480/?electronics`;
  }
};

const getUniqueRandomElement = <T>(array: T[]): T => {
  const randomIndex = faker.number.int({ min: 0, max: array.length - 1 });
  return array.splice(randomIndex, 1)[0];
};

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Existing products removed");

    const products = Array.from({ length: 100 }).map(() => {
      const category = faker.helpers.arrayElement(CATEGORIES);
      const brand = faker.helpers.arrayElement(BRAND);

      const specificationsLabels = [
        "Processor",
        "RAM",
        "Storage",
        "Display",
        "Graphics",
        "Battery Life",
        "Operating System",
      ];
      const specificationsValues = [
        "M1 Max 10-core CPU",
        "Intel i9 12-core CPU",
        "32GB Unified Memory",
        "16GB DDR4",
        "1TB SSD",
        "2TB NVMe",
        "16-inch Retina Display",
        "14-inch Full HD Display",
        "8GB GDDR6 Graphics",
        "12 hours",
        "macOS Ventura",
        "Windows 11",
      ];

      const typesLabels = ["purple", "silver", "midnight", "gold", "blue"];
      const typesValues = ["Purple", "Silver", "Midnight", "Gold", "Blue"];

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category,
        brand,
        stock: faker.number.int({ min: 1, max: 100 }),
        discount: faker.number.int({ min: 0.1, max: 1 }),
        image: getRandomImage(category),
        price: faker.number.int({ min: 100, max: 700 }),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        colors: getRandomColors(),
        reviews: Array.from({
          length: faker.number.int({ min: 1, max: 4 }),
        }).map(() => ({
          fullName: faker.person.fullName(),
          comment: faker.lorem.sentence(),
          rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        })),
        specifications: Array.from({
          length: faker.number.int({ min: 4, max: 6 }),
        }).map(() => ({
          label: getUniqueRandomElement(specificationsLabels),
          value: getUniqueRandomElement(specificationsValues),
        })),
        types: Array.from({ length: faker.number.int({ min: 2, max: 3 }) }).map(
          () => ({
            label: getUniqueRandomElement(typesLabels),
            value: faker.helpers.slugify(
              getUniqueRandomElement(typesValues).toLowerCase()
            ),
          })
        ),
      };
    });

    await Product.insertMany(products);
    console.log("100 products created successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(seedProducts);
