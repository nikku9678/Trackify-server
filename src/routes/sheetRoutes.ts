import express from "express";
import {
  createProblemInSheets,
  createSheet,
  getProblemFromSheets,
  getSheets,
} from "../controllers/sheetController";
import { isAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// GET all sheets
router.get("/", isAuthenticate ,getSheets);
router.get("/sheet-problems/:sheetId", isAuthenticate ,getProblemFromSheets);

// POST create new sheet
router.post("/create", isAuthenticate, createSheet);
router.post("/create-problem/:sheetId", isAuthenticate, createProblemInSheets);

export default router;
