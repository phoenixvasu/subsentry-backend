export class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ApplicationError";
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message = "Authentication required") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message = "Access denied") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
