/**
 * Login Controller
 * ----------------
 * Handles user authentication operations such as login and logout.
 *
 * Functions:
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
 *           - Returns a 401 status code for invalid credentials.
 *           - Returns a 500 status code for server errors.
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
 *           - Returns a 500 status code for server errors.
 *
 * Usage:
 *   - Import the controller functions to use them in authentication routes.
 *       import { login, logout } from "../controllers/login.controller.js";
 */

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user, res);
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
