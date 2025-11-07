import express from "express";
import { getProfiles, createProfile, updateProfile } from "../controllers/profileController";
import { isAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", isAuthenticate , getProfiles);
router.post("/create", isAuthenticate, createProfile);
router.put("/update", isAuthenticate, updateProfile);

export default router;
