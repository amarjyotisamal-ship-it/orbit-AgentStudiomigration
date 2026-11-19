export function globalErrorHandler(err, req, res, _next) {
  const statusCode = Number(err.statusCode || err.status || 500);
  const message = err.message || "An unexpected internal error occurred.";

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Internal Error:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    correlationId: req.correlationId || undefined
  });
}
