import test from "node:test";
import assert from "node:assert/strict";
import { withRetry } from "../src/utils/retry.js";

test("withRetry retries failed operations before succeeding", async () => {
  let attempts = 0;
  const result = await withRetry(async () => {
    attempts++;
    if (attempts < 2) throw new Error("Temporary failure");
    return "success";
  }, { maxRetries: 3, delayMs: 10 });

  assert.equal(result, "success");
  assert.equal(attempts, 2);
});
