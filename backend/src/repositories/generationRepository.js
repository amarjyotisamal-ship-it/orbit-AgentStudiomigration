import { db } from "../db.js";

export class GenerationRepository {
  static listByUser(userId, limit = 50) {
    return db.prepare("SELECT * FROM generations WHERE user_id = ? ORDER BY id DESC LIMIT ?").all(Number(userId), limit);
  }
  static create({ userId, topic, audience = '', tone = 'Professional', resultJson, provider = 'mock' }) {
    const info = db.prepare("INSERT INTO generations (user_id, topic, audience, tone, result_json, provider) VALUES (?, ?, ?, ?, ?, ?)").run(Number(userId), topic, audience, tone, resultJson, provider);
    return db.prepare("SELECT * FROM generations WHERE id = ?").get(info.lastInsertRowid);
  }
  static deleteById(id, userId) {
    return db.prepare("DELETE FROM generations WHERE id = ? AND user_id = ?").run(Number(id), Number(userId));
  }
}
