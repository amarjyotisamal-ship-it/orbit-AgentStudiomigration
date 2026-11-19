import test from "node:test";
import assert from "node:assert/strict";

test("Status pill logic resolves status classes correctly", () => {
  const getPillClass = (ready) => "status-pill " + (ready ? "ready" : "blocked");
  assert.equal(getPillClass(true), "status-pill ready");
  assert.equal(getPillClass(false), "status-pill blocked");
});
