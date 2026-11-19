import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

test("JWT signing and expiration behaves as expected", () => {
  const secret = "test-secret-key-1234567890";
  const token = jwt.sign({ sub: "1", email: "test@orbit.local" }, secret, { expiresIn: "1h" });
  const decoded = jwt.verify(token, secret);
  assert.equal(decoded.sub, "1");
  assert.equal(decoded.email, "test@orbit.local");
});
