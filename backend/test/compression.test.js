import test from "node:test";
import assert from "node:assert/strict";
import { simpleCompression } from "../src/middleware/compression.js";

test("simpleCompression passes through uncompressed requests without gzip header", () => {
  const req = { headers: {} };
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, send(b) { return b; } };
  let called = false;
  simpleCompression(req, res, () => { called = true; });
  assert.equal(called, true);
});
