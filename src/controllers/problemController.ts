import { Request, Response } from "express";
import { PrismaClient, Difficulty, Platform } from "@prisma/client";
import { fetchLeetcodeProblem } from "../services/leetcodeService";

const prisma = new PrismaClient();

export const createProblemFromLeetcode = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "LeetCode URL is required" });

    const problemData = await fetchLeetcodeProblem(url);

    // Convert string difficulty to enum
    let difficultyEnum: Difficulty;
    switch (problemData.difficulty.toLowerCase()) {
      case "medium":
        difficultyEnum = Difficulty.Medium;
        break;
      case "hard":
        difficultyEnum = Difficulty.Hard;
        break;
      default:
        difficultyEnum = Difficulty.Easy;
    }

    // ✅ Check if problem already exists
    const existingProblem = await prisma.problem.findUnique({
      where: { link: problemData.link },
    });

    if (existingProblem) {
      return res.status(200).json({
        message: "Problem already exists",
        problem: existingProblem,
      });
    }

    // Create new problem if not found
    const newProblem = await prisma.problem.create({
      data: {
        title: problemData.title,
        difficulty: difficultyEnum,
        link: problemData.link,
        platform: Platform.LeetCode,
      },
    });

    res.status(201).json({
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error: any) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


