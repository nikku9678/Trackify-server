import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import profileRoutes from "./routes/profileRoutes";
import sheetRoutes from "./routes/sheetRoutes";
import problemRoutes from "./routes/problemRoutes";
import noteRoutes from "./routes/noteRoutes";
import followerRoutes from "./routes/followerRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/followers", followerRoutes);

export default app;
