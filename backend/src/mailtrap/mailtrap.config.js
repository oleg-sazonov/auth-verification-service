/**
 * Mailtrap Configuration
 * -----------------------
 * Provides configuration for the Mailtrap email service, including the client and sender details.
 *
 * Constants:
 *   - TOKEN:
 *       - Type: String.
 *       - Required: Yes.
 *       - Description: The Mailtrap API token retrieved from the environment variables.
 *       - Error Handling:
 *           - Throws an error if the `MAILTRAP_API_TOKEN` is not set in the environment variables.
 *
 * Exports:
 *   - mailtrapClient:
 *       - Type: Object.
 *       - Description: An instance of the MailtrapClient initialized with the API token.
 *
 *   - mailtrapSender:
 *       - Type: Object.
 *       - Description: The default sender details for emails sent using Mailtrap.
 *       - Fields:
 *           - email: The sender's email address.
 *           - name: The sender's name.
 *
 * Usage:
 *   - Import the `mailtrapClient` and `mailtrapSender` to send emails using Mailtrap.
 *       import { mailtrapClient, mailtrapSender } from "./mailtrap.config.js";
 *   - Example:
 *       const recipients = [{ email: "user@example.com" }];
 *       await mailtrapClient.send({
 *           from: mailtrapSender,
 *           to: recipients,
 *           subject: "Welcome!",
 *           text: "Thank you for signing up!",
 *       });
 */

import "../config/envs/env.config.js";
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_API_TOKEN;

if (!TOKEN) {
    throw new Error("MAILTRAP_API_TOKEN is not set");
}

export const mailtrapClient = new MailtrapClient({
    token: TOKEN,
});

export const mailtrapSender = {
    email: "no-reply@oleg-sazonov.com",
    name: "auth-verification-service",
};

// const recipients = [
//     {
//         email: "sazonov1994@gmail.com",
//     },
// ];

// mailtrapClient
//     .send({
//         from: mailtrapSender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);
