import crypto from "node:crypto";

export function correlationIdMiddleware(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const correlationId = typeof incoming === 'string' && incoming.length > 0 && incoming.length <= 128
    ? incoming
    : crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader('X-Request-ID', correlationId);
  next();
}
