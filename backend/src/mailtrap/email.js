/**
 * Email Utilities
 * ---------------
 * Provides utility functions for sending emails using Mailtrap.
 *
 * Functions:
 *   - sendVerificationEmail:
 *       - Description: Sends a verification email to the user with a unique verification code.
 *       - Parameters:
 *           - user:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The user object containing the recipient's email and name.
 *               - Fields:
 *                   - email: The recipient's email address.
 *                   - name: The recipient's name.
 *           - verificationToken:
 *               - Type: String.
 *               - Required: Yes.
 *               - Description: The unique verification code to include in the email.
 *       - Workflow:
 *           1. Constructs the email content using the `VERIFICATION_EMAIL_TEMPLATE`.
 *           2. Replaces placeholders in the template with the user's name and verification code.
 *           3. Sends the email using the Mailtrap client.
 *       - Error Handling:
 *           - Logs errors to the console if the email fails to send.
 *           - Throws an error with a descriptive message if the email fails.
 *
 * Usage:
 *   - Import the function to send verification emails.
 *       import { sendVerificationEmail } from "../mailtrap/email.js";
 *   - Example:
 *       await sendVerificationEmail(
 *           { email: "user@example.com", name: "John Doe" },
 *           "123456"
 *       );
 */

import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, mailtrapSender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (
    { email, name },
    verificationToken
) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipients,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ).replace("{username}", name),
            category: "Email Verification",
        });

        console.log("Verification email sent:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email: " + error.message);
    }
};
