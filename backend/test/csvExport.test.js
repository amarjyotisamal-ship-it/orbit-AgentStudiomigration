import test from "node:test";
import assert from "node:assert/strict";
import { formatGenerationsCsv } from "../src/utils/csvExport.js";

test("formatGenerationsCsv creates CSV text from generation records", () => {
  const items = [{ id: 1, topic: 'AI Growth', audience: 'Founders', tone: 'Executive', provider: 'mock', created_at: '2026-11-19' }];
  const csv = formatGenerationsCsv(items);
  assert.ok(csv.includes("ID,Topic,Audience"));
  assert.ok(csv.includes('"AI Growth"'));
});
