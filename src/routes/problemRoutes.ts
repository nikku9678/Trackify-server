import express from "express";
import {
  
  createProblemFromLeetcode,
} from "../controllers/problemController";
import { isAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// GET all problems
// router.get("/", getProblems);

// // POST create a problem
// router.post("/", createProblem);
router.post("/from-leetcode" ,createProblemFromLeetcode);

export default router;
