export function sendSuccess(res, data, statusCode = 200, meta = null) {
  const payload = { success: true, ...data };
  if (meta) payload._meta = meta;
  return res.status(statusCode).json(payload);
}
export function sendError(res, message, statusCode = 500, details = null) {
  const payload = { success: false, error: message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
}
