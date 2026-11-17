import test from "node:test";
import assert from "node:assert/strict";
import { generateContent } from "../src/aiAdapter.js";

test("mock AI adapter returns portable structured content", async () => {
  process.env.AI_MODE = "mock";
  const out = await generateContent({ topic:"AI agents for B2B sales", audience:"sales leaders", tone:"Executive" }, { userRef:"poc-user-test" });
  assert.equal(out.provider, "local-poc-adapter");
  assert.equal(out.data.ideas.length, 3);
  assert.ok(out.data.outline.length >= 4);
  assert.match(out.data.summary, /sales leaders/i);
});

test("unsupported AI mode fails closed", async () => {
  process.env.AI_MODE = "unknown";
  await assert.rejects(() => generateContent({topic:"valid topic",audience:"",tone:"Professional"},{userRef:"test"}), /AI_MODE/);
  process.env.AI_MODE = "mock";
});
