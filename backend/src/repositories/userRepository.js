import { db } from "../db.js";

export class UserRepository {
  static findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  }
  static findById(id) {
    return db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(Number(id));
  }
  static create({ name, email, passwordHash }) {
    const info = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(name.trim(), email.toLowerCase().trim(), passwordHash);
    return this.findById(info.lastInsertRowid);
  }
}
