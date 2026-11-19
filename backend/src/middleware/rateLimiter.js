/**
 * In-memory sliding window rate limiter middleware.
 * Prevents brute force and abuse on public / sensitive API routes.
 */
export function createRateLimiter({ windowMs = 60000, maxRequests = 100, message = 'Too many requests, please try again later.' } = {}) {
  const ipBuckets = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipBuckets.entries()) {
      if (now - data.resetTime > windowMs) {
        ipBuckets.delete(ip);
      }
    }
  }, 300000).unref();

  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let bucket = ipBuckets.get(ip);
    if (!bucket || now - bucket.resetTime > windowMs) {
      bucket = { count: 1, resetTime: now };
      ipBuckets.set(ip, bucket);
    } else {
      bucket.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - bucket.count));

    if (bucket.count > maxRequests) {
      return res.status(429).json({ error: message });
    }

    next();
  };
}
