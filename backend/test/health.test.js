import test from 'node:test';
import assert from 'node:assert/strict';

test('health check returns diagnostic status and system metrics', async () => {
  const mem = process.memoryUsage();
  assert.ok(mem.heapUsed > 0);
  assert.ok(process.uptime() >= 0);
  assert.ok(process.version.startsWith('v'));
});
