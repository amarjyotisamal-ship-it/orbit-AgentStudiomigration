import test from "node:test";
import assert from "node:assert/strict";

test("storage serialization and parsing handles null safely", () => {
  const serialize = (val) => JSON.stringify(val);
  const deserialize = (raw, fallback) => {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };

  assert.equal(deserialize(serialize({ a: 1 }), null).a, 1);
  assert.equal(deserialize("invalid json", "default"), "default");
  assert.equal(deserialize(null, "default"), "default");
});
