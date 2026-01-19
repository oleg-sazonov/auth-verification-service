/**
 * Password Controller
 * -------------------
 * Handles operations related to password management, such as password reset requests and resetting passwords.
 *
 * Functions:
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
 *           1. Extracts the `email` from the request body.
 *           2. Finds the user in the database by email.
 *           3. If the user exists:
 *               - Generates a password reset token and sets its expiration time.
 *               - Saves the token and expiration time to the user's record.
 *               - Sends a password reset email to the user with the reset link.
 *               - Sends a success response indicating the email was sent.
 *           4. If the user is not found:
 *               - Returns a 404 status code with an appropriate error message.
 *       - Error Handling:
 *           - Logs errors to the console if an exception occurs.
 *           - Returns a 500 status code with a generic error message for server errors.
 *
 *   - resetPassword:
 *       - Description: Resets the user's password using the provided reset token.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing the reset token in the URL parameters and the new password in the request body.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Extracts the `token` from the URL parameters and the `password` from the request body.
 *           2. Validates the new password to ensure it meets the minimum length requirement.
 *           3. Finds the user in the database by the reset token and ensures the token is not expired.
 *           4. If the user is found:
 *               - Hashes the new password and updates the user's record.
 *               - Clears the reset token and expiration time from the user's record.
 *               - Sends a password reset success email to the user.
 *               - Sends a success response indicating the password has been reset.
 *           5. If the user is not found or the token is invalid/expired:
 *               - Returns a 404 status code with an appropriate error message.
 *       - Error Handling:
 *           - Logs errors to the console if an exception occurs.
 *           - Returns a 500 status code with a generic error message for server errors.
 *
 * Usage:
 *   - Import the controller functions to use them in authentication routes.
 *       import { forgotPassword, resetPassword } from "../controllers/password.controller.js";
 *   - Example:
 *       router.post("/forgot-password", forgotPassword);
 *       router.post("/reset-password/:token", resetPassword);
 */

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generatePasswordResetToken } from "../utils/generateToken.js";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";

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

        const resetToken = generatePasswordResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(
            user,
            `${clientUrl}/reset-password?token=${resetToken}`
        );
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email address",
        });
    } catch (error) {
        console.error("Error in forgotPassword controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters",
        });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendResetSuccessEmail(user);
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Error in resetPassword controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
