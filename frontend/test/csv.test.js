import test from "node:test";
import assert from "node:assert/strict";
import { arrayToCsv } from "../src/utils/csv.js";

test("arrayToCsv converts record lists to CSV formatted text", () => {
  const data = [
    { id: 1, name: "Alpha", category: "Sales" },
    { id: 2, name: "Beta", category: "Content" }
  ];
  const csv = arrayToCsv(data, ["id", "name", "category"]);
  assert.ok(csv.includes("id,name,category"));
  assert.ok(csv.includes('"Alpha"'));
});
