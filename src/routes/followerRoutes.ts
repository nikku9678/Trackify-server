import express from "express";
import {
  followUser,
  getFollowers,
} from "../controllers/followerController";

const router = express.Router();

// GET all followers
router.get("/", getFollowers);

// POST follow a user
router.post("/", followUser);

export default router;
