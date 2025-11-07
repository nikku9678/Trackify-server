import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import prisma from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        phone,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.user_id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "7d" }
    );


    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.user_id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};
