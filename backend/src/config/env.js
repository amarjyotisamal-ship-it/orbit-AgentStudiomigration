import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "..", "..", "..", ".env") });

export const env = {
  port: Number(process.env.PORT || 5101),
  jwtSecret: process.env.JWT_SECRET || "default-dev-secret-change-in-production",
  aiMode: process.env.AI_MODE || "mock",
  agentStudioUrl: process.env.AI_AGENT_STUDIO_URL || "http://127.0.0.1:5000",
  agentStudioProjectId: process.env.AI_AGENT_STUDIO_PROJECT_ID || "orbit-poc",
  agentStudioApiToken: process.env.AI_AGENT_STUDIO_API_TOKEN || "",
  isProduction: process.env.NODE_ENV === "production"
};
