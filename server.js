// ─────────────────────────────────────────────────────────────────
//  Sanctuary AI  –  Express Backend
//  Handles ALL Gemini API calls so the API key stays server-side.
//
//  Endpoints:
//    POST /api/chat     →  Gemini AI Assistant (DashboardHome)
//    POST /api/analyse  →  Wellbeing analysis  (CheckIn)
//    GET  /api/health   →  Quick liveness check
// ─────────────────────────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";

// Load .env manually (works with "type":"module")
const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}
loadEnv();

// ── Setup ────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"] }));
app.use(express.json());

// ── Gemini client ────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌  GEMINI_API_KEY is not set in your .env file!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Model for the chat assistant (DashboardHome)
const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a compassionate mental health assistant called Sanctuary AI. " +
    "Be warm, supportive, empathetic, and non-judgmental. " +
    "Help users reflect on their emotions and suggest healthy coping strategies. " +
    "Keep responses concise (2-4 paragraphs max). " +
    "Always encourage professional help when the situation seems serious.",
});

// Model for wellbeing analysis (CheckIn page)
const analyseModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a mental health screening assistant. " +
    "Always respond with ONLY valid JSON, no markdown, no preamble.",
});

// ── POST /api/chat ────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "A non-empty 'message' string is required." });
  }

  try {
    const result = await chatModel.generateContent(message.trim());
    const reply  = result.response.text();
    return res.json({ reply });
  } catch (err) {
    console.error("[/api/chat] Gemini error:", err);
    return res.status(502).json({ error: "Failed to reach Gemini. Please try again." });
  }
});

// ── POST /api/analyse ─────────────────────────────────────────────
// Used by CheckIn.tsx via store.ts → analyseWellbeing()
app.post("/api/analyse", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A 'prompt' string is required." });
  }

  try {
    const result = await analyseModel.generateContent(prompt.trim());
    const raw    = result.response.text().replace(/```json|```/g, "").trim();
    // Validate it's JSON before sending
    JSON.parse(raw);
    return res.send(raw);          // store.ts parses this directly
  } catch (err) {
    console.error("[/api/analyse] Gemini error:", err);
    // Return a safe fallback so the Check-In page never crashes
    return res.json({
      riskLevel: "moderate",
      score: 45,
      emotions: ["uncertain", "mixed"],
      summary: "Unable to fully analyse right now.",
      recommendations: [
        "Take a short breathing break",
        "Reach out to someone you trust",
        "Step outside for fresh air",
      ],
      aiInsight: "Your feelings are valid. Take it one moment at a time.",
    });
  }
});

// ── GET /api/health ───────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("");
  console.log("  ✅  Sanctuary AI backend is running!");
  console.log(`  🌐  http://localhost:${PORT}`);
  console.log("");
});
