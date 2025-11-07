import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../types";

// ✅ CREATE Note (inside specific Sheet + Problem)
export const createProblemNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const sheet_id = parseInt(req.params.sheetId);
    const problem_id = parseInt(req.params.problemId);
    const { title, description } = req.body;

    const note = await prisma.note.create({
      data: { user_id, sheet_id, problem_id, title, description },
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error: any) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ GET all notes for a specific Problem in a Sheet
export const getProblemNotes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const sheet_id = parseInt(req.params.sheetId);
    const problem_id = parseInt(req.params.problemId);

    const notes = await prisma.note.findMany({
      where: { user_id, sheet_id, problem_id },
      include: { sheet: true, problem: true },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(notes);
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ GET single note by ID
export const getSingleNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const note_id = parseInt(req.params.noteId);

    const note = await prisma.note.findFirst({
      where: { note_id: note_id, user_id },
      include: { sheet: true, problem: true },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error: any) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ UPDATE a note
export const updateProblemNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const note_id = parseInt(req.params.noteId);
    const { title, description } = req.body;

    const existingNote = await prisma.note.findFirst({
      where: { note_id: note_id, user_id },
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const updatedNote = await prisma.note.update({
      where: { note_id: note_id },
      data: { title, description },
    });

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error: any) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✅ DELETE a note
export const deleteProblemNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.userId;
    const note_id = parseInt(req.params.noteId);

    const existingNote = await prisma.note.findFirst({
      where: { note_id: note_id, user_id },
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    await prisma.note.delete({ where: { note_id: note_id } });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
