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
 *   - sendWelcomeEmail:
 *       - Description: Sends a welcome email to the user after successful email verification.
 *       - Parameters:
 *           - user:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The user object containing the recipient's email and name.
 *               - Fields:
 *                   - email: The recipient's email address.
 *                   - name: The recipient's name.
 *       - Workflow:
 *           1. Constructs the email content using the `WELCOME_EMAIL_TEMPLATE`.
 *           2. Replaces placeholders in the template with the user's name.
 *           3. Sends the email using the Mailtrap client.
 *       - Error Handling:
 *           - Logs errors to the console if the email fails to send.
 *           - Throws an error with a descriptive message if the email fails.
 *
 *   - sendPasswordResetEmail:
 *       - Description: Sends a password reset email to the user with a reset link.
 *       - Parameters:
 *           - user:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The user object containing the recipient's email and name.
 *               - Fields:
 *                   - email: The recipient's email address.
 *                   - name: The recipient's name.
 *           - resetLink:
 *               - Type: String.
 *               - Required: Yes.
 *               - Description: The password reset link to include in the email.
 *       - Workflow:
 *           1. Constructs the email content using the `PASSWORD_RESET_REQUEST_TEMPLATE`.
 *           2. Replaces placeholders in the template with the user's name and reset link.
 *           3. Sends the email using the Mailtrap client.
 *       - Error Handling:
 *           - Logs errors to the console if the email fails to send.
 *           - Throws an error with a descriptive message if the email fails.
 *
 * Usage:
 *   - Import the functions to send emails.
 *       import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../mailtrap/emails.js";
 *   - Example:
 *       await sendVerificationEmail(
 *           { email: "user@example.com", name: "John Doe" },
 *           "123456"
 *       );
 *       await sendWelcomeEmail(
 *           { email: "user@example.com", name: "John Doe" }
 *       );
 *       await sendPasswordResetEmail(
 *           { email: "user@example.com", name: "John Doe" },
 *           "https://example.com/reset-password?token=abc123"
 *       );
 */

import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, mailtrapSender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (
    { email, name },
    verificationToken
) => {
    const recipients = [{ email }];
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
    ).replace("{username}", name);

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipients,
            subject: "Verify your email address",
            html: htmlContent,
            category: "Email Verification",
        });

        console.log("Verification email sent:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email: " + error.message);
    }
};

export const sendWelcomeEmail = async ({ email, name }) => {
    const recipients = [{ email }];
    const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{username}", name);

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipients,
            subject: "Welcome to Our Service",
            html: htmlContent,
            category: "Welcome Email",
        });

        console.log("Welcome email sent:", response);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email: " + error.message);
    }
};

export const sendPasswordResetEmail = async ({ email, name }, resetLink) => {
    const recipients = [{ email }];
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{username}",
        name
    ).replace("{resetURL}", resetLink);

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipients,
            subject: "Reset Your Password",
            html: htmlContent,
            category: "Password Reset",
        });

        console.log("Password reset email sent:", response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(
            "Failed to send password reset email: " + error.message
        );
    }
};
