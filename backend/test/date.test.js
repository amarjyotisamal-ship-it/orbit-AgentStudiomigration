import test from 'node:test';
import assert from 'node:assert/strict';
import { formatIso, formatDisplayDate } from '../src/utils/date.js';

test('date utilities format dates reliably', () => {
  const iso = formatIso(new Date('2026-11-19T12:00:00Z'));
  assert.equal(iso, '2026-11-19T12:00:00.000Z');
  const display = formatDisplayDate('2026-11-19T12:00:00Z');
  assert.ok(display.includes('2026'));
});
