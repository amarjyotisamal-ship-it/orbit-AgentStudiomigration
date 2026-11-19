import test from 'node:test';
import assert from 'node:assert/strict';
import { GenerationRepository } from '../src/repositories/generationRepository.js';
import { db } from '../src/db.js';

test('GenerationRepository manages user generations lifecycle', () => {
  const userId = 8888;
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (8888, 'Gen Test', 'gen@orbit.local', 'h')").run();

  const gen = GenerationRepository.create({
    userId, topic: 'AI Agent Architecture', audience: 'Engineers', tone: 'Technical',
    resultJson: JSON.stringify({ title: 'AI POC' }), provider: 'mock'
  });
  assert.ok(gen.id > 0);

  const list = GenerationRepository.listByUser(userId);
  assert.ok(list.length >= 1);

  const del = GenerationRepository.deleteById(gen.id, userId);
  assert.equal(del.changes, 1);

  db.prepare("DELETE FROM users WHERE id = 8888").run();
});
