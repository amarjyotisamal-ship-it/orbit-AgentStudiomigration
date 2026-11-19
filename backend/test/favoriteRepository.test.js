import test from 'node:test';
import assert from 'node:assert/strict';
import { FavoriteRepository } from '../src/repositories/favoriteRepository.js';
import { db } from '../src/db.js';

test('FavoriteRepository adds, lists, and removes user agent favorites', () => {
  const userId = 7777;
  db.prepare("INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (7777, 'Fav Repo', 'favrepo@orbit.local', 'h')").run();

  FavoriteRepository.add(userId, 'IRMA-20-03');
  const favs = FavoriteRepository.listByUser(userId);
  assert.ok(favs.includes('IRMA-20-03'));

  FavoriteRepository.remove(userId, 'IRMA-20-03');
  const empty = FavoriteRepository.listByUser(userId);
  assert.equal(empty.includes('IRMA-20-03'), false);

  db.prepare("DELETE FROM users WHERE id = 7777").run();
});
