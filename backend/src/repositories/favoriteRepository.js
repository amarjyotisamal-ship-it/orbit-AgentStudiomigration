import { db } from "../db.js";

export class FavoriteRepository {
  static listByUser(userId) {
    const rows = db.prepare("SELECT agent_key, created_at FROM user_agent_favorites WHERE user_id = ? ORDER BY id DESC").all(Number(userId));
    return rows.map(r => r.agent_key);
  }
  static add(userId, agentKey) {
    return db.prepare("INSERT OR IGNORE INTO user_agent_favorites (user_id, agent_key) VALUES (?, ?)").run(Number(userId), agentKey.trim());
  }
  static remove(userId, agentKey) {
    return db.prepare("DELETE FROM user_agent_favorites WHERE user_id = ? AND agent_key = ?").run(Number(userId), agentKey.trim());
  }
}
