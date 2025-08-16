export class ApplicationError extends Error {
    constructor(message, statusCode = 500, originalError = null) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor);
    }
}
