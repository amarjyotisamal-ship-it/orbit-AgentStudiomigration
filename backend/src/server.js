import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "..", "..", ".env") });
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db.js";
import { issueToken, requireAuth } from "./auth.js";
import { generateContent } from "./aiAdapter.js";
import { getStudioCatalog, getAgentContract, executeStudioAgent, AgentStudioUpstreamError } from "./agentStudioClient.js";
import { requestLogger } from "./middleware/logger.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const port = Number(process.env.PORT || 5101);
const authLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 30, message: "Too many login attempts. Please try again in a minute." });
const agentLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 60, message: "Agent execution rate limit reached. Please pace your requests." });
app.use(requestLogger);
app.use(helmet());
app.use(cors({ origin: ["http://localhost:3002", "http://127.0.0.1:3002"] }));
app.use(express.json({ limit: "1mb" }));

const credentials = z.object({
  email: z.string().email().max(200).transform(v => v.trim().toLowerCase()),
  password: z.string().min(8).max(128)
});
const registerSchema = credentials.extend({ name: z.string().trim().min(2).max(80) });
const generateSchema = z.object({
  topic: z.string().trim().min(5).max(500),
  audience: z.string().trim().max(300).default(""),
  tone: z.enum(["Professional", "Executive", "Conversational", "Technical"]).default("Professional")
});

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.created_at });

app.get("/api/health", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "ok",
    database: "sqlite",
    aiMode: process.env.AI_MODE || "mock",
    agentStudioConfigured: Boolean(
      process.env.AI_AGENT_STUDIO_PROJECT_ID &&
      Buffer.byteLength(String(process.env.AI_AGENT_STUDIO_API_TOKEN || ""), "utf8") >= 32
    ),
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      timestamp: new Date().toISOString()
    }
  });
});

app.post("/api/auth/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(parsed.data.email);
  if (exists) return res.status(409).json({ error: "An account with this email already exists" });
  const hash = await bcrypt.hash(parsed.data.password, 12);
  const info = db.prepare("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)").run(parsed.data.name, parsed.data.email, hash);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid email and password" });
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(parsed.data.email);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  res.json({ token: issueToken(user), user: publicUser(user) });
});

app.get("/api/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.identity.sub));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: publicUser(user) });
});

app.get("/api/generations", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM generations WHERE user_id = ? ORDER BY id DESC LIMIT 50").all(Number(req.identity.sub));
  res.json({ items: rows.map(r => ({ id:r.id, topic:r.topic, audience:r.audience, tone:r.tone, provider:r.provider, createdAt:r.created_at, result:JSON.parse(r.result_json) })) });
});

app.post("/api/generations", requireAuth, async (req, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const userId = Number(req.identity.sub);
  try {
    const output = await generateContent(parsed.data, { userRef: `poc-user-${userId}` });
    const info = db.prepare("INSERT INTO generations(user_id,topic,audience,tone,result_json,provider) VALUES(?,?,?,?,?,?)")
      .run(userId, parsed.data.topic, parsed.data.audience, parsed.data.tone, JSON.stringify(output.data), output.provider);
    res.status(201).json({ id: Number(info.lastInsertRowid), provider: output.provider, result: output.data });
  } catch (error) {
    console.error("AI generation failed:", error.message);
    res.status(502).json({ error: "AI service is currently unavailable. Your account and saved work are unchanged." });
  }
});

// The browser can only access Orbit JWT routes; the studio API key never leaves Node.
const orbitUser = (req) => {
  const id = Number(req.identity?.sub);
  return Number.isSafeInteger(id) && id > 0 && db.prepare("SELECT id FROM users WHERE id = ?").get(id) ? id : null;
};
const studioError = (res, error) => res.status(error instanceof AgentStudioUpstreamError ? error.status : 502)
  .json({ error: error instanceof AgentStudioUpstreamError ? error.message : "AI Agent Studio is temporarily unavailable." });

app.get("/api/agents/catalog", requireAuth, async (req, res) => {
  if (!orbitUser(req)) return res.status(401).json({ error: "Account no longer available." });
  try { res.json(await getStudioCatalog()); }
  catch (error) { studioError(res, error); }
});

app.get("/api/agents/:agentId/contract", requireAuth, async (req, res) => {
  if (!orbitUser(req)) return res.status(401).json({ error: "Account no longer available." });
  try { res.json(await getAgentContract(req.params.agentId)); }
  catch (error) { studioError(res, error); }
});

const agentExecutionSchema = z.object({
  input: z.record(z.any()).refine(val => typeof val === 'object' && val !== null && !Array.isArray(val), {
    message: "Input must be a valid key-value object."
  })
});

app.post("/api/agents/:agentId/:action", requireAuth, agentLimiter, async (req, res) => {
  const userId = orbitUser(req);
  if (!userId) return res.status(401).json({ error: "Account no longer available." });
  const parsed = agentExecutionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: parsed.error.issues[0]?.message || "Invalid input object. Orbit provides verified context." });
  }
  if (req.body && Object.keys(req.body).some(k => k !== 'input')) {
    return res.status(422).json({ error: "Supply an input object only. Orbit provides verified context." });
  }
  try {
    res.json(await executeStudioAgent({
      agentId: req.params.agentId,
      action: req.params.action,
      input: parsed.data.input,
      userId,
    }));
  } catch (error) { studioError(res, error); }
});

app.get("/api/agents/favorites", requireAuth, (req, res) => {
  const userId = orbitUser(req);
  if (!userId) return res.status(401).json({ error: "Account no longer available." });
  const rows = db.prepare("SELECT agent_key, created_at FROM user_agent_favorites WHERE user_id = ? ORDER BY id DESC").all(userId);
  res.json({ favorites: rows.map(r => r.agent_key) });
});

app.post("/api/agents/favorites/:key", requireAuth, (req, res) => {
  const userId = orbitUser(req);
  if (!userId) return res.status(401).json({ error: "Account no longer available." });
  const key = String(req.params.key || '').trim();
  if (!key || key.length > 120) return res.status(400).json({ error: "Invalid agent key." });
  try {
    db.prepare("INSERT OR IGNORE INTO user_agent_favorites (user_id, agent_key) VALUES (?, ?)").run(userId, key);
    res.status(201).json({ success: true, agentKey: key, favorited: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to bookmark agent." });
  }
});

app.delete("/api/agents/favorites/:key", requireAuth, (req, res) => {
  const userId = orbitUser(req);
  if (!userId) return res.status(401).json({ error: "Account no longer available." });
  const key = String(req.params.key || '').trim();
  db.prepare("DELETE FROM user_agent_favorites WHERE user_id = ? AND agent_key = ?").run(userId, key);
  res.status(200).json({ success: true, agentKey: key, favorited: false });
});

app.delete("/api/generations/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM generations WHERE id = ? AND user_id = ?").run(Number(req.params.id), Number(req.identity.sub));
  if (!info.changes) return res.status(404).json({ error: "Saved generation not found" });
  res.status(204).end();
});

app.listen(port, () => console.log(`POC backend running on http://127.0.0.1:${port}`));
