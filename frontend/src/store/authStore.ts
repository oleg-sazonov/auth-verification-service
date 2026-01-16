import { create } from "zustand";
import axios from "axios";

// Define the User interface based on backend API responses
interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Define the store state interface
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingAuth: boolean;
    error: string | null;
}

// Define the store actions interface
interface AuthActions {
    signup: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    // logout: () => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    checkAuth: () => Promise<void>;
    // forgotPassword: (email: string) => Promise<void>;
    // resetPassword: (token: string, password: string) => Promise<void>;
    // clearError: () => void;
}

// Combine state and actions
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
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Signup failed"
                : "Signup failed";

            set({
                error: errorMessage,
                isLoading: false,
            });
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
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Login failed"
                : "Login failed";

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
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Email verification failed"
                : "Email verification failed";

            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    checkAuth: async () => {
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
}));
