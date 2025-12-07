/**
 * Email Verification Controller
 * -----------------------------
 * Handles operations related to verifying a user's email address.
 *
 * Functions:
 *   - verifyEmail:
 *       - Description: Verifies the user's email using the provided verification token.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing the verification token in the request body.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Extracts the `verificationToken` from the request body.
 *           2. Finds the user in the database with the matching `verificationToken` and ensures the token is not expired.
 *           3. If the user is found:
 *               - Marks the user's email as verified.
 *               - Clears the `verificationToken` and its expiration time from the user's record.
 *               - Saves the updated user to the database.
 *               - Sends a welcome email to the user.
 *               - Sends a success response with the user details (excluding sensitive fields like the password).
 *           4. If the user is not found or the token is invalid/expired:
 *               - Returns a 400 status code with an appropriate error message.
 *       - Error Handling:
 *           - Logs errors to the console if an exception occurs.
 *           - Returns a 500 status code with a generic error message for server errors.
 *
 * Usage:
 *   - Import the `verifyEmail` function to use it in authentication routes.
 *       import { verifyEmail } from "../controllers/emailVerification.controller.js";
 *   - Example:
 *       router.post("/verify-email", verifyEmail);
 */

import User from "../models/user.model.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";

export const verifyEmail = async (req, res) => {
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
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Error in verifyEmail controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
