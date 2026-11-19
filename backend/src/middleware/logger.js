/**
 * Structured HTTP request logger middleware for Orbit backend.
 * Emits clean, machine-parsable logs with method, path, status, and duration.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();
    // Only log API requests to keep logs readable
    if (url.startsWith('/api')) {
      const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
      console.log(`[${timestamp}] [${level}] ${method} ${url} -> ${status} (${duration}ms)`);
    }
  });

  next();
}
