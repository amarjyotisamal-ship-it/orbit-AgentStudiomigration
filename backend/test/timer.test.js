import test from "node:test";
import assert from "node:assert/strict";
import { Timer } from "../src/utils/timer.js";

test("Timer tracks elapsed milliseconds correctly", async () => {
  const t = new Timer();
  await new Promise(r => setTimeout(r, 10));
  assert.ok(t.elapsedMs() >= 8);
});
