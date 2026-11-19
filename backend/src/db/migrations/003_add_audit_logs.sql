CREATE TABLE IF NOT EXISTS agent_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent_id TEXT NOT NULL,
  action TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_audit_user ON agent_audit_logs(user_id, id DESC);
