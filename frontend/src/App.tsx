/**
 * App Component
 * -------------
 * The root component of the application that sets up routing, authentication checks, and global UI elements.
 * It uses `react-router` for navigation and `zustand` for state management.
 *
 * ### Features
 * - **Routing**:
 *   - Defines routes for the application, including protected and public routes.
 *   - Handles redirection based on authentication and email verification status.
 * - **Authentication**:
 *   - Uses `isCheckingAuth` to display a loading spinner while verifying authentication status.
 *   - Protects routes that require authentication using the `ProtectedRoute` component.
 *   - Redirects authenticated users away from login/signup pages using the `RedirectAuthenticatedUser` component.
 * - **Global UI**:
 *   - Includes a `Toaster` for displaying toast notifications globally.
 *   - Applies consistent background styling using Tailwind CSS.
 *
 * ### Components
 * - `ProtectedRoute`:
 *   - Protects routes that require authentication.
 *   - Redirects unauthenticated users to the login page.
 *   - Redirects users with unverified emails to the email verification page.
 * - `RedirectAuthenticatedUser`:
 *   - Redirects authenticated and verified users away from login/signup pages to the home page.
 * - `LoadingSpinner`:
 *   - Displays a spinner while the app checks authentication status.
 *
 * ### State Management
 * - **Store**: `useAuthStore` (zustand)
 *   - `isCheckingAuth`: Indicates whether the app is verifying authentication status.
 *   - `isAuthenticated`: Indicates whether the user is authenticated.
 *   - `user`: Contains user details, including `isVerified` status.
 *   - `checkAuth`: Function to verify authentication status on app load.
 *
 * ### Routes
 * - `/`:
 *   - Protected route.
 *   - Displays the `Home` component for authenticated and verified users.
 * - `/signup`:
 *   - Public route.
 *   - Displays the `SignUp` component.
 *   - Redirects authenticated and verified users to `/`.
 * - `/login`:
 *   - Public route.
 *   - Displays the `Login` component.
 *   - Redirects authenticated and verified users to `/`.
 * - `/verify-email`:
 *   - Public route.
 *   - Displays the `EmailVerificationPage` component.
 * - `/forgot-password`:
 *   - Public route.
 *   - Displays the `ForgotPasswordPage` component.
 *   - Redirects authenticated and verified users to `/`.
 * - `*`:
 *   - Catch-all route.
 *   - Displays the `NotFound` component for undefined routes.
 *
 * ### Usage
 * - The `App` component is the entry point of the application and is rendered in `main.tsx`.
 *
 * ### Styling
 * - Utilizes Tailwind CSS for consistent and responsive styling.
 * - Includes background gradients and patterns for a visually appealing layout.
 *
 * ### Dependencies
 * - `react-router`: For routing and navigation.
 * - `zustand`: For state management.
 * - `react-hot-toast`: For toast notifications.
 * - `LoadingSpinner`: Custom component for loading state.
 *
 * ### Example
 * ```tsx
 * import { StrictMode } from "react";
 * import { createRoot } from "react-dom/client";
 * import { BrowserRouter } from "react-router-dom";
 * import App from "./App";
 *
 * createRoot(document.getElementById("root")!).render(
 *   <StrictMode>
 *     <BrowserRouter>
 *       <App />
 *     </BrowserRouter>
 *   </StrictMode>
 * );
 * ```
 */

import { Navigate, Route, Routes } from "react-router";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { useAuthStore } from "./store/authStore";

import { Toaster } from "react-hot-toast";
import { useEffect, type JSX } from "react";

// Protect routes that require authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

// Redirect authenticated users away from login/signup pages
const RedirectAuthenticatedUser = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (isAuthenticated && user?.isVerified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-emerald-50 relative overflow-hidden flex items-center justify-center px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_1px,transparent_1px)] bg-size-[32px_32px] opacity-60" />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-900/80 via-emerald-800/60 to-gray-900/80 mix-blend-screen" />

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignUp />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectAuthenticatedUser>
                            <Login />
                        </RedirectAuthenticatedUser>
                    }
                />

                <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                />

                <Route
                    path="/forgot-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ForgotPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#1f2937", // gray-800
                        color: "#d1fae5", // emerald-100
                        border: "1px solid #374151", // gray-700
                        padding: "16px",
                        borderRadius: "8px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981", // emerald-500
                            secondary: "#d1fae5", // emerald-100
                        },
                        style: {
                            background: "#1f2937", // gray-800
                            color: "#d1fae5", // emerald-100
                            border: "1px solid #10b981", // emerald-500
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444", // red-500
                            secondary: "#fecaca", // red-200
                        },
                        style: {
                            background: "#1f2937", // gray-800
                            color: "#fecaca", // red-200
                            border: "1px solid #ef4444", // red-500
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
