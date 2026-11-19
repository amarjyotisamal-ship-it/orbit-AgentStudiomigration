import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "../src/utils/sanitize.js";

test("escapeHtml safely escapes dangerous characters", () => {
  const unsafe = '<script>alert("xss")</script>';
  const safe = escapeHtml(unsafe);
  assert.equal(safe.includes("<script>"), false);
  assert.equal(safe.includes("&lt;script&gt;"), true);
});
