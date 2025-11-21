/**
 * User Model
 * ----------
 * Represents a user in the authentication verification service.
 *
 * Schema Fields:
 *   - email:
 *       - Type: String.
 *       - Required: Yes.
 *       - Trimmed: Yes.
 *       - Maximum Length: 50 characters.
 *       - Description: The email address of the user.
 *
 *   - password:
 *       - Type: String.
 *       - Required: Yes.
 *       - Minimum Length: 6 characters.
 *       - Description: The hashed password of the user.
 *
 *   - name:
 *       - Type: String.
 *       - Required: Yes.
 *       - Trimmed: Yes.
 *       - Minimum Length: 2 characters.
 *       - Maximum Length: 30 characters.
 *       - Description: The full name of the user.
 *
 *   - lastLogin:
 *       - Type: Date.
 *       - Default: Current date and time.
 *       - Description: The timestamp of the user's last login.
 *
 *   - isVerified:
 *       - Type: Boolean.
 *       - Default: false.
 *       - Description: Indicates whether the user's email is verified.
 *
 *   - resetPasswordToken:
 *       - Type: String.
 *       - Required: No.
 *       - Description: Token used for password reset.
 *
 *   - resetPasswordExpires:
 *       - Type: Date.
 *       - Required: No.
 *       - Description: Expiration date for the password reset token.
 *
 *   - verificationToken:
 *       - Type: String.
 *       - Required: No.
 *       - Description: Token used for email verification.
 *
 *   - verificationTokenExpires:
 *       - Type: Date.
 *       - Required: No.
 *       - Description: Expiration date for the email verification token.
 *
 * Schema Options:
 *   - timestamps:
 *       - Automatically manages `createdAt` and `updatedAt` fields.
 *
 * Model:
 *   - Name: `User`.
 *   - Description: Represents a user in the authentication verification service, including personal details and authentication information.
 *
 * Usage:
 *   - Import the model to interact with the `users` collection in MongoDB.
 *       import User from "../models/user.model.js";
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 30,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        verificationToken: {
            type: String,
        },
        verificationTokenExpires: {
            type: Date,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const User = mongoose.model("User", userSchema);

export default User;
