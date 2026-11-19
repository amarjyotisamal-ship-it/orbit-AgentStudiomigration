import test from 'node:test';
import assert from 'node:assert/strict';
import { globalErrorHandler } from '../src/middleware/errorHandler.js';

test('globalErrorHandler formats errors with correct status and message', () => {
  const err = new Error('Custom validation error');
  err.statusCode = 422;
  const req = { correlationId: 'req-123' };
  let capturedStatus = 0;
  let capturedBody = null;
  const res = {
    status(s) { capturedStatus = s; return this; },
    json(b) { capturedBody = b; return this; }
  };

  globalErrorHandler(err, req, res, () => {});
  assert.equal(capturedStatus, 422);
  assert.equal(capturedBody.error, 'Custom validation error');
  assert.equal(capturedBody.correlationId, 'req-123');
});
