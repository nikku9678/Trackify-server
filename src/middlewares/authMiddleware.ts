import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/index";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const isAuthenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access denied, no token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
