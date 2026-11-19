import test from "node:test";
import assert from "node:assert/strict";
import { checkEnvironment } from "../src/scripts/checkEnv.js";

test("checkEnvironment identifies missing required variables", () => {
  const bad = checkEnvironment({});
  assert.equal(bad.valid, false);
  assert.ok(bad.missing.includes("JWT_SECRET"));

  const good = checkEnvironment({
    JWT_SECRET: "secret123",
    AI_AGENT_STUDIO_PROJECT_ID: "proj",
    AI_AGENT_STUDIO_API_TOKEN: "token123"
  });
  assert.equal(good.valid, true);
  assert.equal(good.missing.length, 0);
});
