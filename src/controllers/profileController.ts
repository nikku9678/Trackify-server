import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../types";

export const createProfile = async (req: AuthRequest, res: Response) => {
   if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
  const { linkedin_url, github_url, leetcode_url, bio, is_public } = req.body;
  const profile = await prisma.profile.create({
    data: { user_id, linkedin_url, github_url, leetcode_url, bio, is_public },
  });
  res.status(201).json(profile);
};

export const getProfiles = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
  }

  const user_id = req.user.userId;

  console.log(req.user);
  const profiles = await prisma.profile.findUnique({
    where:{user_id},
  });
  res.json(profiles);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
  }

  const{ linkedin_url, github_url, leetcode_url, bio, is_public } = req.body;
  const user_id = req.user.userId;

  console.log(req.user);
  const profiles = await prisma.profile.update({
    where:{user_id},
    data:{linkedin_url, github_url, leetcode_url, bio, is_public}
  });
  res.json(profiles);
};

