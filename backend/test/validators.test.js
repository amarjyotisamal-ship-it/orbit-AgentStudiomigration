import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isValidPassword, sanitizeString } from '../src/utils/validators.js';

test('validators correctly validate email, password, and string sanitization', () => {
  assert.equal(isValidEmail('test@example.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidPassword('12345678'), true);
  assert.equal(isValidPassword('short'), false);
  assert.equal(sanitizeString('  hello world  '), 'hello world');
});
