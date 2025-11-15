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
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000"
].filter(Boolean) as string[];   // remove undefined, ensure string[]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", origin ?? "");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});



app.use("/api/auth", authRoutes);
// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/followers", followerRoutes);

// 🧪 Root test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running successfully!');
});

// 👤 Get all users with their profiles
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// 📄 Get all sheets with problems
app.get('/sheets', async (req, res) => {
  try {
    const sheets = await prisma.sheet.findMany({
      include: {
        user: { select: { username: true } },
        sheetProblems: {
          include: {
            problem: true,
          },
        },
      },
    });
    res.json(sheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching sheets' });
  }
});

// 🧠 Get all problems
app.get('/problems', async (req, res) => {
  try {
    const problems = await prisma.problem.findMany();
    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching problems' });
  }
});

// 🗒️ Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: { select: { username: true } },
        sheet: { select: { title: true } },
      },
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// 👥 Get followers
app.get('/followers', async (req, res) => {
  try {
    const followers = await prisma.follower.findMany({
      include: {
        follower: { select: { username: true } },
        following: { select: { username: true } },
      },
    });
    res.json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching followers' });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
