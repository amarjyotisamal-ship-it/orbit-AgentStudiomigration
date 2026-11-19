import test from "node:test";
import assert from "node:assert/strict";

function titleCase(str) {
  if (!str) return "";
  return String(str).replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

test("titleCase formats snake_case and kebab-case strings", () => {
  assert.equal(titleCase("b2b_saas_roi_analyst"), "B2b Saas Roi Analyst");
  assert.equal(titleCase("content-studio"), "Content Studio");
});
