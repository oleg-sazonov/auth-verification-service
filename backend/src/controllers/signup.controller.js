/**
 * Signup Controller
 * -----------------
 * Handles user registration by creating a new user, generating a verification token, and sending a verification email.
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
 *           1. Extracts `email`, `password`, and `name` from the request body.
 *           2. Validates that all required fields are provided.
 *           3. Checks if a user with the given email already exists in the database.
 *           4. Hashes the user's password using bcrypt.
 *           5. Generates a verification token for email verification.
 *           6. Creates a new user record in the database with the hashed password and verification token.
 *           7. Generates a JWT token and sets it as an HTTP-only cookie.
 *           8. Sends a verification email to the user.
 *           9. Sends a success response with the user details (excluding sensitive fields like the password and tokens).
 *       - Error Handling:
 *           - Returns a 400 status code if required fields are missing.
 *           - Returns a 409 status code if the email already exists.
 *           - Logs errors to the console and returns a 500 status code for server errors.
 *
 * Usage:
 *   - Import the `signup` function to use it in authentication routes.
 *       import { signup } from "../controllers/signup.controller.js";
 *   - Example:
 *       router.post("/signup", signup);
 */

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
    generateVerificationToken,
    generateTokenAndSetCookie,
} from "../utils/generateToken.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = generateVerificationToken();

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        });

        if (newUser) {
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
        res.status(500).json({ message: "Internal server error" });
    }
};
