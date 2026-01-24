# Mailtrap API Setup Guide

## Overview

This project uses [Mailtrap](https://mailtrap.io/) for email testing in development. Mailtrap captures emails without sending them to real recipients, making it perfect for testing authentication flows.

---

## Quick Start

### 1. Get Your Mailtrap API Token

1. Go to [Mailtrap.io](https://mailtrap.io/) and create a free account
2. Navigate to **Email Testing** → **Inboxes**
3. Select your inbox (or create a new one)
4. Go to **SMTP/API Settings**
5. Click on **API** tab
6. Copy your **API Token**

### 2. Configure Environment Variables

Add the token to your `.env` file in the `backend` directory:

```env
MAILTRAP_API_TOKEN=your_token_here
```

### 3. Verify Configuration

Check the sender configuration in [`mailtrap.config.js`](backend/src/mailtrap/mailtrap.config.js):

```javascript
export const mailtrapSender = {
    email: "no-reply@oleg-sazonov.com",
    name: "auth-verification-service",
};
```

---

## How Mailtrap Works in This Project

### Email Flow

1. User signs up/requests password reset
2. Backend generates verification link/token
3. Email is sent via Mailtrap API
4. Mailtrap **captures** the email (doesn't send to real inbox)
5. You view the email in Mailtrap dashboard

### Current Implementation

- **Sender**: `no-reply@oleg-sazonov.com` (can be any email, it's just a label)
- **Recipients**: Real user emails from signup (e.g., `sazonov1994@gmail.com`)
- **Templates**: HTML email templates in [`emailTemplates.js`](backend/src/mailtrap/emailTemplates.js)

---

## Testing Emails

### Method 1: Using Mailtrap Dashboard (Recommended)

1. Start the backend server:

    ```bash
    cd backend
    npm run dev
    ```

2. Sign up with **any email** (e.g., `sazonov1994@gmail.com`, `test@example.com`)
3. Go to [Mailtrap Dashboard](https://mailtrap.io/inboxes)
4. Check your inbox - the verification email will appear there
5. Click the verification link in the email

### Method 2: Manual API Test

Uncomment the test code in [`mailtrap.config.js`](backend/src/mailtrap/mailtrap.config.js):

```javascript
const recipients = [
    {
        email: "sazonov1994@gmail.com",
    },
];

mailtrapClient
    .send({
        from: mailtrapSender,
        to: recipients,
        subject: "You are awesome!",
        text: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);
```

Then run:

```bash
node backend/src/mailtrap/mailtrap.config.js
```

---

## Switching to a Different Mailtrap Account

### Scenario: You want to use a different Mailtrap account

1. **Get the new API token** from the new Mailtrap account (see Step 1 above)

2. **Update `.env` file**:

    ```env
    MAILTRAP_API_TOKEN=new_token_here
    ```

3. **Restart the server**:

    ```bash
    npm run dev
    ```

4. **That's it!** No code changes needed.

### Optional: Update Sender Info

If you want to change the sender email/name:

Edit [`mailtrap.config.js`](backend/src/mailtrap/mailtrap.config.js):

```javascript
export const mailtrapSender = {
    email: "support@yourname.com", // Change this
    name: "Your App Name", // Change this
};
```

---

## Email Types Sent by This App

| Email Type           | File                                          | Trigger                       |
| -------------------- | --------------------------------------------- | ----------------------------- |
| Welcome Email        | [`emails.js`](backend/src/mailtrap/emails.js) | After successful signup       |
| Verification Email   | [`emails.js`](backend/src/mailtrap/emails.js) | User signs up                 |
| Password Reset Email | [`emails.js`](backend/src/mailtrap/emails.js) | User clicks "Forgot Password" |
| Reset Success Email  | [`emails.js`](backend/src/mailtrap/emails.js) | After password is reset       |

---

## Important Notes

### ⚠️ Mailtrap Free Tier Limits

- **500 emails/month**
- **1 inbox**
- **50 emails/second**

This is plenty for development/testing.

### 🔒 Security

- **Never commit** your `.env` file to Git
- The `.env` file is already in `.gitignore`
- API token is sensitive - treat it like a password

### 📧 Real Email Sending (Production)

Mailtrap is for **testing only**. For production, you'll need a real email service:

- **SendGrid**
- **AWS SES**
- **Mailgun**
- **Postmark**

The code structure is similar - just swap the client and configuration.

---

## Troubleshooting

### Error: "MAILTRAP_API_TOKEN is not set"

- Check if `.env` file exists in `backend` directory
- Verify the variable name is exactly `MAILTRAP_API_TOKEN`
- Restart the server after adding the token

### Emails not appearing in Mailtrap

1. Check the [Mailtrap Dashboard](https://mailtrap.io/inboxes)
2. Verify you're in the correct inbox
3. Check server logs for errors
4. Verify the API token is correct

### Error: "Invalid API token"

- Generate a new token from Mailtrap dashboard
- Update `.env` file
- Restart the server

---

## Related Files

- [`mailtrap.config.js`](backend/src/mailtrap/mailtrap.config.js) - Client configuration
- [`emails.js`](backend/src/mailtrap/emails.js) - Email sending functions
- [`emailTemplates.js`](backend/src/mailtrap/emailTemplates.js) - HTML email templates
- [`auth.controller.js`](backend/src/controllers/auth.controller.js) - Triggers email sending

---

## Quick Reference

```bash
# Environment Variable
MAILTRAP_API_TOKEN=your_token_here

# Mailtrap Dashboard
https://mailtrap.io/inboxes

# Test Email Endpoint
POST http://localhost:5000/api/auth/signup
Body: { "email": "test@example.com", "password": "password123", "name": "Test User" }
```

---

## Questions?

- [Mailtrap Documentation](https://api-docs.mailtrap.io/)
- [Mailtrap Node.js SDK](https://github.com/railsware/mailtrap-nodejs)
