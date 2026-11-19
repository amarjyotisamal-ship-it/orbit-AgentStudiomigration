import { db } from "../db.js";

export class AuditRepository {
  static record({ userId, agentId, action, latencyMs, statusCode }) {
    db.prepare(`
      INSERT INTO agent_audit_logs (user_id, agent_id, action, latency_ms, status_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(Number(userId), String(agentId), String(action), Math.round(Number(latencyMs) || 0), Number(statusCode) || 200);
  }
  static listByUser(userId, limit = 20) {
    return db.prepare("SELECT * FROM agent_audit_logs WHERE user_id = ? ORDER BY id DESC LIMIT ?").all(Number(userId), limit);
  }
}
