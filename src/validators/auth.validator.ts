import { body } from "express-validator";

export const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Last Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
