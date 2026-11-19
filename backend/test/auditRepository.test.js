import test from "node:test";
import assert from "node:assert/strict";
import { AuditRepository } from "../src/repositories/auditRepository.js";
import { db } from "../src/db.js";

test("AuditRepository records and retrieves execution logs", () => {
  const userId = 6666;
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (6666, 'Audit Test', 'audit@orbit.local', 'h')").run();

  AuditRepository.record({ userId, agentId: 'IRMA-20-03', action: 'analyze', latencyMs: 45, statusCode: 200 });
  const logs = AuditRepository.listByUser(userId);
  assert.ok(logs.length >= 1);
  assert.equal(logs[0].agent_id, 'IRMA-20-03');

  db.prepare("DELETE FROM users WHERE id = 6666").run();
});
