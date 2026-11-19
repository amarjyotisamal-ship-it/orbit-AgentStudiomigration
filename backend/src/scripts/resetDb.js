import { db } from "../db.js";
import { runMigrations } from "../db/migrator.js";
import { seedDatabase } from "./seedDb.js";

export async function resetDatabase() {
  db.exec(`
    DROP TABLE IF EXISTS agent_audit_logs;
    DROP TABLE IF EXISTS user_agent_favorites;
    DROP TABLE IF EXISTS generations;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS _migrations;
  `);
  runMigrations();
  await seedDatabase();
  return true;
}
