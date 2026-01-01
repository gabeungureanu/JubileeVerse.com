/**
 * Error Handling Middleware
 */

const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * 404 Not Found Handler
 */
function notFoundHandler(req, res, next) {
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, '../../views/pages/404.html'));
  }
}

/**
 * Global Error Handler
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send response
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.status(statusCode).json({
      error: config.server.isDev ? err.message : 'Internal server error',
      ...(config.server.isDev && { stack: err.stack })
    });
  } else {
    res.status(statusCode).sendFile(path.join(__dirname, '../../views/pages/500.html'));
  }
}

/**
 * Async handler wrapper to catch async errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create custom application error
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler,
  AppError
};
