/**
 * Rate Limiting Middleware
 * ------------------------
 * Provides configurable rate limiting for different authentication endpoints.
 * Uses in-memory store (suitable for single-server deployments).
 * For production with multiple servers, consider using Redis store.
 *
 * Middleware:
 *   - authLimiter: General rate limit for authentication endpoints (15 requests per 15 minutes)
 *   - strictAuthLimiter: Stricter limit for sensitive operations (5 requests per 15 minutes)
 *   - verificationLimiter: Rate limit for email verification (10 requests per hour)
 *
 * Related Files:
 * - [auth.routes.js](backend/src/routes/auth.routes.js) - Apply these middleware to routes
 */

import rateLimit from "express-rate-limit";

// General authentication rate limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count all requests
    handler: (req, res) => {
        const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: `Too many signup attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter, // Seconds until reset
        });
    },
});

// Stricter rate limiter for login and password reset
export const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message:
            "Too many failed attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Only count failed requests
    skipFailedRequests: false,
    handler: (req, res) => {
        const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: `Too many failed attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter, // Seconds until reset
        });
    },
});

// Rate limiter for verification codes
export const verificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 verification attempts per hour
    message: {
        success: false,
        message:
            "Too many verification attempts from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: `Too many verification attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter, // Seconds until reset
        });
    },
});

// Rate limiter for forgot password (prevent email spam)
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 email requests per hour
    message: {
        success: false,
        message:
            "Too many password reset requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: `Too many password reset requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter, // Seconds until reset
        });
    },
});
