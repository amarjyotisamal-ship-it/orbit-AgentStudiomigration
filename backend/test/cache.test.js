import test from "node:test";
import assert from "node:assert/strict";
import { MemoryCache } from "../src/utils/cache.js";

test("MemoryCache stores and expires entries according to TTL", async () => {
  const cache = new MemoryCache(20);
  cache.set("key1", "value1");
  assert.equal(cache.get("key1"), "value1");

  await new Promise(r => setTimeout(r, 30));
  assert.equal(cache.get("key1"), null);
});
