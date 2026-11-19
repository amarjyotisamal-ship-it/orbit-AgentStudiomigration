import test from 'node:test';
import assert from 'node:assert/strict';
import { UserRepository } from '../src/repositories/userRepository.js';
import { db } from '../src/db.js';

test('UserRepository creates, finds, and retrieves user records', () => {
  const email = `test.repo.${Date.now()}@example.com`;
  const user = UserRepository.create({ name: 'Repo Test', email, passwordHash: 'hash123' });
  assert.ok(user.id > 0);
  assert.equal(user.email, email);

  const found = UserRepository.findByEmail(email);
  assert.equal(found.id, user.id);

  // Clean up
  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
});
