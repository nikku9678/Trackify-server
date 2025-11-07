import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../types";
import { createProblemFromLeetcode } from "./problemController";
import { fetchLeetcodeProblem } from "../services/leetcodeService";
import { Difficulty, Platform } from "@prisma/client";

export const createSheet = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId; // ✅ correctly extract userId
    const { title, description, is_public } = req.body;

    const sheet = await prisma.sheet.create({
      data: { user_id, title, description, is_public },
    });

    res.status(201).json(sheet);
  } catch (error) {
    console.error("Error creating sheet:", error);
    res.status(500).json({ message: "Server error creating sheet" });
  }
};


export const getSheets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const sheets = await prisma.sheet.findMany({
      where: { user_id },
      include: { user: true, sheetProblems: true },
    });

    res.json({
      data: sheets,
      count: sheets.length,
    });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    res.status(500).json({ message: "Server error fetching sheets" });
  }
};

export const updateSheets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user_id = req.user.userId;
    const sheets = await prisma.sheet.findMany({
      where: { user_id },
      include: { user: true, sheetProblems: true },
    });

    res.json(sheets);
  } catch (error) {
    console.error("Error fetching sheets:", error);
    res.status(500).json({ message: "Server error fetching sheets" });
  }
};


export const createProblemInSheets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const sheet_id = parseInt(req.params.sheetId);
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Problem URL is required" });
    }

    const user_id = req.user.userId;
    console.log("Sheet ID:", sheet_id);
    console.log("User ID:", user_id);

    // ✅ Fetch LeetCode problem details
    const problemData = await fetchLeetcodeProblem(url);

    // ✅ Convert difficulty string to enum
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

    // ✅ Check if problem already exists by link
    let existingProblem = await prisma.problem.findUnique({
      where: { link: problemData.link },
    });

    // ✅ Create a new problem if not found
    if (!existingProblem) {
      existingProblem = await prisma.problem.create({
        data: {
          title: problemData.title,
          difficulty: difficultyEnum,
          link: problemData.link,
          platform: Platform.LeetCode,
        },
      });
    }

    // ✅ Create SheetProblem entry linking to this problem
    const sheetProblem = await prisma.sheetProblem.create({
      data: {
        sheet_id,
        problem_id: existingProblem.problem_id,
        user_id,
        order_index: 1,
      },
      include: { sheet: true, problem: true, user: true },
    });

    // ✅ Return the complete data
    res.status(201).json({
      message: "Problem added to sheet successfully",
      data: sheetProblem,
    });
  } catch (error) {
    console.error("Error creating problem in sheet:", error);
    res.status(500).json({ message: "Server error creating problem in sheet" });
  }
};

export const getProblemFromSheets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const sheet_id = parseInt(req.params.sheetId);
    console.log("Sheet ID:", sheet_id);

    const user_id = req.user.userId;
    console.log("User ID:", user_id);

    const sheetProblems = await prisma.sheetProblem.findMany({
      where: { sheet_id, user_id },
      include: {
        sheet: {
          select: {
            sheet_id: true,
            title: true,
            description: true,
          },
        },
        problem: true,
      },
    });

    if (!sheetProblems.length) {
      return res.status(404).json({ message: "No problems found for this sheet" });
    }

    // ✅ Extract sheet info once
    const sheetInfo = sheetProblems[0].sheet;

    // ✅ Extract only the problem details
    const problems = sheetProblems.map((sp) => sp.problem);

    // ✅ Respond with a structured object
    return res.json({
      sheet: sheetInfo,
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems from sheet:", error);
    res.status(500).json({ message: "Server error fetching problems" });
  }
};

