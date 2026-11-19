import test from 'node:test';
import assert from 'node:assert/strict';
import { correlationIdMiddleware } from '../src/middleware/correlationId.js';

test('correlationIdMiddleware assigns and propagates request IDs', () => {
  const req = { headers: {} };
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; } };
  let called = false;
  correlationIdMiddleware(req, res, () => { called = true; });

  assert.equal(called, true);
  assert.ok(req.correlationId);
  assert.equal(res.headers['X-Request-ID'], req.correlationId);
});
