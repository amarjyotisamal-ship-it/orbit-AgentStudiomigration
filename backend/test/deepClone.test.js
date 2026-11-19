import test from "node:test";
import assert from "node:assert/strict";
import { deepClone } from "../src/utils/deepClone.js";

test("deepClone creates independent copies of nested structures", () => {
  const original = { a: 1, nested: { b: 2, arr: [3, 4] } };
  const clone = deepClone(original);
  assert.deepEqual(clone, original);
  clone.nested.b = 99;
  assert.equal(original.nested.b, 2);
});
