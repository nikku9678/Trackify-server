import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";

export const getUsers = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { profile: true, sheets: true, notes: true },
  });
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { user_id: Number(id) },
    include: { profile: true, sheets: true, notes: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password_hash: hash, phone },
  });
  res.status(201).json(user);
};
