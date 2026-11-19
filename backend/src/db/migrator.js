import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(here, "migrations");

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (!fs.existsSync(migrationsDir)) return [];
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();
  const applied = [];

  for (const file of files) {
    const existing = db.prepare("SELECT id FROM _migrations WHERE filename = ?").get(file);
    if (!existing) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      db.exec(sql);
      db.prepare("INSERT INTO _migrations (filename) VALUES (?)").run(file);
      applied.push(file);
    }
  }
  return applied;
}
