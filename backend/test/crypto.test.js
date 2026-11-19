import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRandomToken, safeCompare } from '../src/utils/crypto.js';

test('crypto utilities generate tokens and safely compare strings', () => {
  const t1 = generateRandomToken(16);
  assert.equal(t1.length, 32);
  assert.equal(safeCompare('secret123', 'secret123'), true);
  assert.equal(safeCompare('secret123', 'wrong'), false);
});
