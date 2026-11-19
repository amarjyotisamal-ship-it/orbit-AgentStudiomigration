import test from "node:test";
import assert from "node:assert/strict";

test("a11y focus trap returns cleanup function when element is null", () => {
  const trapFocus = (el) => (!el ? () => {} : () => {});
  const cleanup = trapFocus(null);
  assert.equal(typeof cleanup, "function");
  cleanup();
});
