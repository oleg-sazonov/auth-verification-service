# Frontend API Integration Guide

This document provides a comprehensive guide for integrating the backend authentication API into your frontend application.

## Base URL

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

## API Endpoints

### Authentication Endpoints

#### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```typescript
{
    name: string; // Min: 2 chars, Max: 30 chars
    email: string; // Valid email, Max: 50 chars
    password: string; // Min: 6 chars
}
```

**Success Response (201):**

```typescript
{
    user: {
        _id: string;
        name: string;
        email: string;
        isVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }
    message: string;
}
```

**Error Responses:**

-   `400`: Missing required fields
-   `409`: Email already exists
-   `500`: Internal server error

**Notes:**

-   Sets JWT token in HTTP-only cookie
-   Sends verification email automatically
-   User starts with `isVerified: false`

---

#### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```typescript
{
    email: string;
    password: string;
}
```

**Success Response (200):**

```typescript
{
    success: true;
    message: string;
    user: {
        _id: string;
        name: string;
        email: string;
        isVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }
}
```

**Error Responses:**

-   `401`: Invalid email or password
-   `500`: Internal server error

**Notes:**

-   Sets JWT token in HTTP-only cookie
-   Updates `lastLogin` timestamp

---

#### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Request Body:** None

**Success Response (200):**

```typescript
{
    success: true;
    message: "Logout successful";
}
```

**Error Responses:**

-   `500`: Internal server error

**Notes:**

-   Clears JWT cookie

---

#### 4. Check Authentication

**Endpoint:** `GET /api/auth/check-auth`

**Headers Required:**

```typescript
{
    Cookie: "jwt=<token>"; // Automatically sent by browser
}
```

**Success Response (200):**

```typescript
{
    success: true;
    user: {
        _id: string;
        name: string;
        email: string;
        isVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }
}
```

**Error Responses:**

-   `401`: No token provided
-   `403`: Invalid token
-   `404`: User not found
-   `500`: Internal server error

**Notes:**

-   Protected route - requires valid JWT cookie
-   Use this to check if user is authenticated on app load

---

### Email Verification

#### 5. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

**Request Body:**

```typescript
{
    verificationToken: string; // 6-digit code
}
```

**Success Response (200):**

```typescript
{
    success: true;
    message: "Email verified successfully";
    user: {
        _id: string;
        name: string;
        email: string;
        isVerified: true;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }
}
```

**Error Responses:**

-   `400`: Invalid or expired verification token
-   `500`: Internal server error

**Notes:**

-   Token expires in 24 hours
-   Sends welcome email upon successful verification
-   Sets `isVerified` to `true`

---

### Password Reset

#### 6. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**

```typescript
{
    email: string;
}
```

**Success Response (200):**

```typescript
{
    success: true;
    message: "Password reset email sent";
}
```

**Error Responses:**

-   `404`: User not found
-   `500`: Internal server error

**Notes:**

-   Generates a 32-byte hex reset token
-   Token expires in 1 hour
-   Sends password reset email with link

---

#### 7. Reset Password

**Endpoint:** `POST /api/auth/reset-password/:token`

**URL Parameters:**

```typescript
{
    token: string; // 32-byte hex string from email link
}
```

**Request Body:**

```typescript
{
    password: string; // Min: 6 chars
}
```

**Success Response (200):**

```typescript
{
    success: true;
    message: "Password reset successfully";
}
```

**Error Responses:**

-   `400`: Password too short
-   `404`: Invalid or expired token
-   `500`: Internal server error

**Notes:**

-   Token expires in 1 hour
-   Clears reset token after successful reset
-   Sends confirmation email

---

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

For production, update this to your production API URL.

---

## Important Notes

### 1. Credentials & Cookies

-   **Always** include `credentials: 'include'` in fetch requests
-   The backend sets HTTP-only cookies for JWT tokens
-   Cookies are automatically sent with subsequent requests

### 2. CORS Configuration

Ensure your backend allows credentials from your frontend origin:

```javascript
// backend/src/server.js
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
```

### 3. Error Handling

Always implement proper error handling:

-   Display user-friendly error messages
-   Log errors for debugging
-   Handle network failures gracefully

### 4. Loading States

Use loading states to provide user feedback:

-   Disable form inputs during submission
-   Show loading indicators
-   Prevent double submissions

### 5. Protected Routes

For routes requiring authentication, check auth status:

```typescript
// Example: Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        authAPI
            .checkAuth()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return <>{children}</>;
};
```

---

## Testing Checklist

-   [ ] Sign up with valid credentials
-   [ ] Sign up with duplicate email (should fail)
-   [ ] Sign up with invalid password (< 6 chars)
-   [ ] Verify email with valid code
-   [ ] Verify email with invalid/expired code
-   [ ] Login with valid credentials
-   [ ] Login with invalid credentials
-   [ ] Check auth status on app load
-   [ ] Logout functionality
-   [ ] Request password reset
-   [ ] Reset password with valid token
-   [ ] Reset password with expired token
-   [ ] Cookie persistence across page refreshes
