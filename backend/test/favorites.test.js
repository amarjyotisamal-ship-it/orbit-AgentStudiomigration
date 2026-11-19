import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/db.js';

test('user agent favorites persistence in sqlite', () => {
  // Ensure a test user exists for foreign key constraint
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (9999, 'Test Fav User', 'fav-test@orbit.local', 'hash')").run();
  const userId = 9999;
  const agentKey = 'IRMA-20-03';

  // Ensure clean state
  db.prepare("DELETE FROM user_agent_favorites WHERE user_id = ?").run(userId);

  // 1. Insert favorite
  const insert = db.prepare("INSERT INTO user_agent_favorites (user_id, agent_key) VALUES (?, ?)").run(userId, agentKey);
  assert.equal(insert.changes, 1);

  // 2. Query favorites
  const rows = db.prepare("SELECT agent_key FROM user_agent_favorites WHERE user_id = ?").all(userId);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].agent_key, agentKey);

  // 3. Duplicate insert fails or is ignored
  const dup = db.prepare("INSERT OR IGNORE INTO user_agent_favorites (user_id, agent_key) VALUES (?, ?)").run(userId, agentKey);
  assert.equal(dup.changes, 0);

  // 4. Remove favorite
  const del = db.prepare("DELETE FROM user_agent_favorites WHERE user_id = ? AND agent_key = ?").run(userId, agentKey);
  assert.equal(del.changes, 1);

  // 5. Verify empty
  const empty = db.prepare("SELECT agent_key FROM user_agent_favorites WHERE user_id = ?").all(userId);
  assert.equal(empty.length, 0);

  // Clean up test user
  db.prepare("DELETE FROM users WHERE id = 9999").run();
});
