/**
 * Authentication Store (Zustand)
 * ------------------------------
 * Global state management for authentication using Zustand and Axios.
 * Handles user authentication, email verification, and password management with cookie-based sessions.
 *
 * ## State
 * - `user`: User | null - Current authenticated user
 * - `isAuthenticated`: boolean - Authentication status
 * - `isLoading`: boolean - Loading state for actions
 * - `isCheckingAuth`: boolean - Initial auth check loading
 * - `error`: string | null - Error message from failed operations
 * - `message`: string | null - Success message from operations
 *
 * ## Actions
 * - `signup(name, email, password)` - Register new user
 * - `login(email, password)` - Authenticate user
 * - `logout()` - Clear user session
 * - `verifyEmail(code)` - Verify email with 6-digit code
 * - `checkAuth()` - Verify authentication status (called on app load)
 * - `forgotPassword(email)` - Send password reset email
 * - `resetPassword(token, password)` - Reset password with token
 *
 * ## Rate Limiting
 * - All actions handle 429 (Too Many Requests) status codes
 * - Rate limit errors display user-friendly messages
 * - Backend rate limits:
 *   - signup: 15 requests per 15 minutes
 *   - login: 5 requests per 15 minutes
 *   - verifyEmail: 10 requests per hour
 *   - forgotPassword: 3 requests per hour
 *   - resetPassword: 5 requests per 15 minutes
 *
 * ## Usage
 * ```typescript
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 *
 * // Login example
 * try {
 *   await login("email@example.com", "password");
 *   toast.success("Login successful!");
 * } catch (error) {
 *   // Error already set in store.error
 * }
 * ```
 *
 * ## Configuration
 * - API Base URL: `VITE_API_URL` env variable or `http://localhost:5000`
 * - Uses HTTP-only cookies for JWT tokens
 * - All actions clear previous errors on start
 *
 * ## Related Files
 * - Frontend: [App.tsx](frontend/src/App.tsx), [Login.tsx](frontend/src/pages/Login.tsx), [SignUp.tsx](frontend/src/pages/SignUp.tsx)
 * - Backend: [auth.routes.js](backend/src/routes/auth.routes.js), [auth.controller.js](backend/src/controllers/auth.controller.js)
 * - Backend: [rateLimiter.js](backend/src/middleware/rateLimiter.js) - Rate limiting middleware
 */

import { create } from "zustand";
import axios from "axios";

// User interface from backend API
interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Store state interface
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingAuth: boolean;
    error: string | null;
    message: string | null;
}

// Store actions interface
interface AuthActions {
    signup: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    checkAuth: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
}

// Combined store type
type AuthStore = AuthState & AuthActions;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Configure axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important: Include cookies
    headers: {
        "Content-Type": "application/json",
    },
});

export const useAuthStore = create<AuthStore>((set) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    error: null,
    message: null,

    // Actions
    signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/api/auth/signup", {
                name,
                email,
                password,
            });

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            // Check for rate limit status code
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                set({
                    error:
                        error.response.data.message ||
                        "Too many signup attempts. Please try again later.",
                    isLoading: false,
                });
            } else {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message || "Signup failed"
                    : "Signup failed";

                set({
                    error: errorMessage,
                    isLoading: false,
                });
            }
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/api/auth/login", {
                email,
                password,
            });

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            // Check for rate limit status code
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                set({
                    error:
                        error.response.data.message ||
                        "Too many login attempts. Please try again after 15 minutes.",
                    isLoading: false,
                });
            } else {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message || "Login failed"
                    : "Login failed";

                set({
                    error: errorMessage,
                    isLoading: false,
                });
            }
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/api/auth/logout");
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Logout failed"
                : "Logout failed";

            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    verifyEmail: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/api/auth/verify-email", {
                verificationToken: code, // Changed from 'code' to 'verificationToken'
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
            // return response.data;
        } catch (error) {
            // Check for rate limit status code
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                set({
                    error:
                        error.response.data.message ||
                        "Too many verification attempts. Please try again later.",
                    isLoading: false,
                });
            } else {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                      "Email verification failed"
                    : "Email verification failed";

                set({
                    error: errorMessage,
                    isLoading: false,
                });
            }
            throw error;
        }
    },

    checkAuth: async () => {
        // await new Promise((r) => setTimeout(r, 3000)); // Simulate delay
        set({ isCheckingAuth: true, error: null });

        try {
            const response = await api.get("/api/auth/check-auth");
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            console.log(error);
            set({ error: null, isAuthenticated: false, isCheckingAuth: false });
        }
    },

    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const response = await api.post("/api/auth/forgot-password", {
                email,
            });
            set({ isLoading: false, message: response.data.message });
            return response.data;
        } catch (error) {
            // Check for rate limit status code
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                set({
                    error:
                        error.response.data.message ||
                        "Too many password reset requests. Please try again later.",
                    isLoading: false,
                });
            } else {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                      "Forgot password request failed"
                    : "Forgot password request failed";
                set({ error: errorMessage, isLoading: false });
            }
            throw error;
        }
    },

    resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const response = await api.post(
                `/api/auth/reset-password/${token}`,
                {
                    password,
                }
            );
            set({
                isLoading: false,
                message: response.data.message,
            });
            return response.data;
        } catch (error) {
            // Check for rate limit status code
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                set({
                    error:
                        error.response.data.message ||
                        "Too many password reset attempts. Please try again after 15 minutes.",
                    isLoading: false,
                });
            } else {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message || "Password reset failed"
                    : "Password reset failed";
                set({ error: errorMessage, isLoading: false });
            }
            throw error;
        }
    },
}));
