import { db } from "../db.js";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  const hash = await bcrypt.hash("12345678", 10);
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (1, 'Admin', 'admin@orbit.local', ?)").run(hash);
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (2, 'AmarPOC', 'amarjyoti.samal@ishvara-collab.com', ?)").run(hash);
  return true;
}
