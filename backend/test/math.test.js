import test from "node:test";
import assert from "node:assert/strict";
import { average, percentile95 } from "../src/utils/math.js";

test("math utilities calculate average and 95th percentile accurately", () => {
  assert.equal(average([10, 20, 30]), 20);
  assert.equal(percentile95([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]), 100);
});
