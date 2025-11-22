/**
 * Auth Controller
 * ---------------
 * Handles authentication-related operations such as user signup, login, and logout.
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
 *           7. Sends a success response with the user details (excluding sensitive fields).
 *       - Error Handling:
 *           - Returns appropriate error messages for validation errors, duplicate email, or server issues.
 *
 *   - login:
 *       - Description: Placeholder for user login functionality.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing login credentials.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *
 *   - logout:
 *       - Description: Placeholder for user logout functionality.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *
 * Usage:
 *   - Import the controller functions to use them in authentication routes.
 *       import { signup, login, logout } from "../controllers/auth.controller.js";
 */

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
    generateVerificationToken,
    generateTokenAndSetCookie,
} from "../utils/generateToken.js";

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

export const login = async (req, res) => {
    res.send("Login route");
};

export const logout = async (req, res) => {
    res.send("Logout route");
};
