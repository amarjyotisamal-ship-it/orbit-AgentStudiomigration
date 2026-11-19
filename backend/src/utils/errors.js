export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class NotFoundError extends AppError { constructor(msg = "Resource not found") { super(msg, 404); } }
export class UnauthorizedError extends AppError { constructor(msg = "Authentication required") { super(msg, 401); } }
export class ValidationError extends AppError { constructor(msg = "Validation failed", details = null) { super(msg, 422, details); } }
