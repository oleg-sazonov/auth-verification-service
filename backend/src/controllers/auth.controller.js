/**
 * Auth Controller
 * ---------------
 * Handles authentication-related operations such as user signup, email verification, login, logout, and password reset.
 *
 * Functions:
 *   - signup:
 *       - Description: Registers a new user, hashes their password, generates a verification token, and saves the user to the database.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing user input (e.g., `email`, `password`, `name`).
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Validates the request body to ensure all required fields are provided.
 *           2. Checks if a user with the given email already exists.
 *           3. Hashes the user's password using bcrypt.
 *           4. Generates a verification token for email verification.
 *           5. Saves the new user to the database.
 *           6. Generates a JWT token and sets it as an HTTP-only cookie.
 *           7. Sends a verification email to the user.
 *           8. Sends a success response with the user details (excluding sensitive fields).
 *       - Error Handling:
 *           - Returns appropriate error messages for validation errors, duplicate email, or server issues.
 *
 *   - verifyEmail:
 *       - Description: Verifies the user's email using the provided verification token.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing the verification token.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Validates the verification token.
 *           2. Checks if the token is valid and not expired.
 *           3. Marks the user's email as verified.
 *           4. Sends a welcome email to the user.
 *           5. Sends a success response with the user details (excluding sensitive fields).
 *       - Error Handling:
 *           - Returns appropriate error messages for invalid or expired tokens.
 *           - Handles server errors gracefully.
 *
 *   - login:
 *       - Description: Authenticates a user by verifying their email and password.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing login credentials (`email` and `password`).
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Finds the user by email in the database.
 *           2. Compares the provided password with the hashed password in the database.
 *           3. If valid, generates a JWT token and sets it as an HTTP-only cookie.
 *           4. Updates the user's `lastLogin` field.
 *           5. Sends a success response with the user details (excluding sensitive fields).
 *       - Error Handling:
 *           - Returns appropriate error messages for invalid credentials or server issues.
 *
 *   - logout:
 *       - Description: Logs out the user by clearing the JWT cookie.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Clears the `jwt` cookie by setting it to an empty value and a past expiration date.
 *           2. Sends a success response indicating the user has been logged out.
 *       - Error Handling:
 *           - Returns appropriate error messages for server issues.
 *
 *   - forgotPassword:
 *       - Description: Sends a password reset email to the user with a reset link.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing the user's email.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Finds the user by email in the database.
 *           2. Generates a password reset token and sets its expiration time.
 *           3. Saves the token and expiration time to the user's record.
 *           4. Sends a password reset email to the user with the reset link.
 *           5. Sends a success response indicating the email was sent.
 *       - Error Handling:
 *           - Returns appropriate error messages for user not found or server issues.
 *
 * Usage:
 *   - Import the controller functions to use them in authentication routes.
 *       import { signup, verifyEmail, login, logout, forgotPassword } from "../controllers/auth.controller.js";
 */

import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import {
    generateVerificationToken,
    generateTokenAndSetCookie,
    generatePasswordResetToken,
} from "../utils/generateToken.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate request body
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        //Salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = generateVerificationToken();

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        });

        if (newUser) {
            // Generate JWT token and set it in HTTP-only cookie
            const jwtToken = generateTokenAndSetCookie(newUser, res);

            await newUser.save();

            await sendVerificationEmail(newUser, verificationToken);

            res.status(201).json({
                user: {
                    ...newUser._doc,
                    password: undefined,
                    verificationToken: undefined,
                    verificationTokenExpires: undefined,
                },
                message: "User registered successfully",
            });
        } else {
            res.status(500).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    // - - - - - - => 1 1 4 5 6 7. Verification token from email
    const { verificationToken } = req.body;

    try {
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        await sendWelcomeEmail(user);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined,
                verificationTokenExpires: undefined,
            },
        });
    } catch (error) {
        console.error("Error in verifyEmail controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }

        // Use optional chaining to handle case where user is null and avoid errors
        const isPasswordValid = await bcrypt.compare(
            password,
            user?.password || ""
        );

        if (!user || !isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate JWT token and set cookie
        const token = generateTokenAndSetCookie(user, res);

        user.lastLogin = Date.now();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the cookie by setting it to an empty value and a past expiration date
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const clientUrl = process.env.CLIENT_URL;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Generate a password reset token
        const resetToken = generatePasswordResetToken();
        const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour from now

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;

        await user.save();

        //Send password reset email
        await sendPasswordResetEmail(
            user,
            `${clientUrl}/reset-password?token=${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (error) {
        console.error("Error in forgotPassword controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
