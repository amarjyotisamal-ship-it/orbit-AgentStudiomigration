import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/services/authService.js';

test('AuthService correctly hashes and verifies passwords', async () => {
  const password = 'SuperSecretPassword123!';
  const hash = await AuthService.hashPassword(password);
  assert.ok(hash.startsWith('$2'));
  const valid = await AuthService.comparePassword(password, hash);
  assert.equal(valid, true);
  const invalid = await AuthService.comparePassword('wrong-password', hash);
  assert.equal(invalid, false);
});
