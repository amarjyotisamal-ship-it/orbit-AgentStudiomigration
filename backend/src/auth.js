import jwt from "jsonwebtoken";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
}

export function issueToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, secret(), { expiresIn: "8h" });
}

export function requireAuth(req, res, next) {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.identity = jwt.verify(token, secret());
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}
