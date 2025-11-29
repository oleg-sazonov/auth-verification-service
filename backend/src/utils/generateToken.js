/**
 * Token Utilities
 * ---------------
 * Provides utility functions for generating tokens used in the authentication verification service.
 *
 * Functions:
 *   - generateTokenAndSetCookie:
 *       - Description: Generates a JWT token for a user and sets it as an HTTP-only cookie.
 *       - Parameters:
 *           - user:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The user object containing user details (e.g., `_id`, `name`).
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to set the cookie.
 *       - Returns:
 *           - Type: String.
 *           - Description: The generated JWT token.
 *       - Cookie Options:
 *           - httpOnly: Prevents client-side JavaScript from accessing the cookie (mitigates XSS attacks).
 *           - sameSite: Ensures the cookie is sent only with requests originating from the same site (mitigates CSRF attacks).
 *           - maxAge: 14 days in milliseconds (14 * 24 * 60 * 60 * 1000).
 *           - secure: Uses the `Secure` flag for HTTPS connections based on `COOKIE_SECURE` or `NODE_ENV`.
 *
 *   - generateVerificationToken:
 *       - Description: Generates a cryptographically secure random 6-digit token for email verification.
 *       - Parameters: None.
 *       - Returns:
 *           - Type: String.
 *           - Description: A zero-padded 6-digit verification code.
 *
 *   - generatePasswordResetToken:
 *       - Description: Generates a cryptographically secure random token for password reset.
 *       - Parameters: None.
 *       - Returns:
 *           - Type: String.
 *           - Description: A 32-byte hexadecimal string used as a password reset token.
 *
 * Usage:
 *   - Import the utility functions to use them in authentication workflows.
 *       import {
 *           generateTokenAndSetCookie,
 *           generateVerificationToken,
 *           generatePasswordResetToken,
 *       } from "../utils/generateToken.js";
 */

import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateTokenAndSetCookie = (user, res) => {
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
    );

    const secureFlag = process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === "true"
        : process.env.NODE_ENV === "production";

    // Set cookie with token
    res.cookie("jwt", token, {
        httpOnly: true, // Prevent XSS attacks (Cross-Site Scripting)
        sameSite: "strict", // Prevent CSRF attacks (Cross-Site Request Forgery)
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
        secure: secureFlag,
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    return token;
};

export const generateVerificationToken = () =>
    crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

export const generatePasswordResetToken = () =>
    crypto.randomBytes(32).toString("hex");
