const { StatusCodes } = require('http-status-codes');
const isProduction = process.env.NODE_ENV === 'production';


/**
 * Represents a validation error with a BAD REQUEST status code.
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.status = StatusCodes.BAD_REQUEST;
    }
}

/**
 * Represents an authorization error with an UNAUTHORIZED status code.
 */
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

/**
 * Represents a permission error with a FORBIDDEN status code.
 */
class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
        this.status = StatusCodes.FORBIDDEN;
    }
}
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

/**
 * Initializes error handling middleware for an Express application.
 * 
 * @param {Express.Application} app - The Express application instance.
 * @example
 * const express = require('express');
 * const app = express();
 * require('path/to/this/file').initializeErrorHandling(app);
 */
exports.initializeErrorHandling = (app) => {
    app.use((err, req, res, next) => {
        if (err instanceof ValidationError) {
            res.status(err.status).send(err.message);
        } else if (err instanceof AuthorizationError) {
            res.status(err.status).send(err.message);
        } else if (err instanceof PermissionError) {
            res.status(err.status).send(err.message);
        } else {
            res.status(err.status || 500).json({
                message: err.message,
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
        }
    });
}

exports.AuthorizationError = AuthorizationError;
exports.ValidationError = ValidationError;
exports.PermissionError = PermissionError;
exports.NotFoundError = NotFoundError;

