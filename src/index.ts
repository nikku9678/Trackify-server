import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from "./routes/userRoutes";
import profileRoutes from "./routes/profileRoutes";
import sheetRoutes from "./routes/sheetRoutes";
import problemRoutes from "./routes/problemRoutes";
import noteRoutes from "./routes/noteRoutes";
import followerRoutes from "./routes/followerRoutes";
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// 🚀 Allowed frontend domains
const allowedOrigins = [
  "https://trackify-dev-n.vercel.app",   // Vercel front-end
  "http://localhost:3000"                // Local development
];

app.use(express.json());

// ✅ FIXED CORS CONFIG
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ CRITICAL FIX: Handle OPTIONS preflight
app.options("*", cors());

// -------------------- ROUTES ----------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/followers", followerRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Server is running successfully!');
});

// -----------------------------------------------

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
