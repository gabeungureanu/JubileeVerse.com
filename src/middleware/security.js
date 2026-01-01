/**
 * Security middleware configuration
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Configure Helmet security headers
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com"]
    }
  },
  crossOriginEmbedderPolicy: false
});

/**
 * Configure rate limiting
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * API-specific rate limiter (stricter)
 */
const apiRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 30,
  message: {
    error: 'API rate limit exceeded. Please slow down.',
    retryAfter: 60
  }
});

module.exports = {
  helmetConfig,
  rateLimiter,
  apiRateLimiter
};
