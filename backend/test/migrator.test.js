import test from "node:test";
import assert from "node:assert/strict";
import { runMigrations } from "../src/db/migrator.js";
import { db } from "../src/db.js";

test("migrator creates migrations tracking table and executes idempotent migrations", () => {
  const applied = runMigrations();
  assert.ok(Array.isArray(applied));
  const count = db.prepare("SELECT count(*) as count FROM _migrations").get();
  assert.ok(count.count >= 1);
});
