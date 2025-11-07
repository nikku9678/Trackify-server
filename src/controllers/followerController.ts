import { Request, Response } from "express";
import prisma from "../config/db";

export const followUser = async (req: Request, res: Response) => {
  const { follower_id, following_id } = req.body;
  const follow = await prisma.follower.create({
    data: { follower_id, following_id },
  });
  res.status(201).json(follow);
};

export const getFollowers = async (_: Request, res: Response) => {
  const followers = await prisma.follower.findMany({
    include: { follower: true, following: true },
  });
  res.json(followers);
};

export const removeFollow = async (_: Request, res: Response) => {
  const followers = await prisma.follower.findMany({
    include: { follower: true, following: true },
  });
  res.json(followers);
};
