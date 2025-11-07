import express from "express";
import {
  createProblemNote,
  getProblemNotes,
  updateProblemNote,
} from "../controllers/noteController";
import { isAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// GET all notes
router.get("/:sheetId/problem/:problemId", isAuthenticate,getProblemNotes);
router.put("/update/:noteId", isAuthenticate,updateProblemNote);

// POST create a new note
router.post("/:sheetId/create/:problemId", isAuthenticate ,createProblemNote);

export default router;
