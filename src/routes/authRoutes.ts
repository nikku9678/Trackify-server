import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController";
import { isAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuthenticate, getMe);

export default router;
