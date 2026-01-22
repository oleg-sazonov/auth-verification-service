/**
 * App Component
 * -------------
 * The root component of the application that sets up routing, authentication checks, and global UI elements.
 * It uses `react-router-dom` for navigation and `zustand` for state management.
 *
 * ### Features
 * - **Routing**:
 *   - Defines routes for the application, including protected and public routes.
 *   - Handles redirection based on authentication and email verification status.
 * - **Authentication**:
 *   - Uses `isCheckingAuth` from [`useAuthStore`](frontend/src/store/authStore.ts) to display a loading spinner while verifying authentication status.
 *   - Protects routes that require authentication using the [`ProtectedRoute`](#protectedroute) wrapper component.
 *   - Redirects authenticated users away from login/signup pages using the [`RedirectAuthenticatedUser`](#redirectauthenticateduser) wrapper component.
 * - **Global UI**:
 *   - Includes a `Toaster` component from `react-hot-toast` for displaying toast notifications globally.
 *   - Applies consistent background styling using Tailwind CSS with gradient overlays and radial patterns.
 *
 * ### Components
 *
 * #### ProtectedRoute
 * A wrapper component that protects routes requiring authentication.
 * - **Props**:
 *   - `children`: JSX.Element - The component to render if access is granted.
 * - **Behavior**:
 *   - Redirects unauthenticated users to [`/login`](frontend/src/pages/Login.tsx).
 *   - Redirects authenticated users with unverified emails to [`/verify-email`](frontend/src/pages/EmailVerificationPage.tsx).
 *   - Renders children if user is authenticated and verified.
 * - **Usage**:
 *   ```tsx
 *   <Route path="/" element={
 *     <ProtectedRoute>
 *       <Home />
 *     </ProtectedRoute>
 *   } />
 *   ```
 *
 * #### RedirectAuthenticatedUser
 * A wrapper component that redirects authenticated users away from public-only pages.
 * - **Props**:
 *   - `children`: JSX.Element - The component to render if user is not authenticated or not verified.
 * - **Behavior**:
 *   - Redirects authenticated and verified users to [`/`](frontend/src/pages/Home.tsx) (home page).
 *   - Renders children for unauthenticated users or users with unverified emails.
 * - **Usage**:
 *   ```tsx
 *   <Route path="/login" element={
 *     <RedirectAuthenticatedUser>
 *       <Login />
 *     </RedirectAuthenticatedUser>
 *   } />
 *   ```
 *
 * ### State Management
 * Uses [`useAuthStore`](frontend/src/store/authStore.ts) from zustand:
 * - `isCheckingAuth`: `boolean` - Indicates whether the app is verifying authentication status.
 * - `isAuthenticated`: `boolean` - Indicates whether the user is authenticated.
 * - `user`: `User | null` - Contains user details, including `isVerified` status.
 * - `checkAuth()`: `Promise<void>` - Function to verify authentication status, called on app load.
 *
 * ### Routes
 * - **`/`**:
 *   - Protected route requiring authentication and email verification.
 *   - Renders [`Home`](frontend/src/pages/Home.tsx) component.
 * - **`/signup`**:
 *   - Public route for user registration.
 *   - Renders [`SignUp`](frontend/src/pages/SignUp.tsx) component.
 *   - Redirects authenticated and verified users to `/`.
 * - **`/login`**:
 *   - Public route for user authentication.
 *   - Renders [`Login`](frontend/src/pages/Login.tsx) component.
 *   - Redirects authenticated and verified users to `/`.
 * - **`/verify-email`**:
 *   - Public route for email verification.
 *   - Renders [`EmailVerificationPage`](frontend/src/pages/EmailVerificationPage.tsx) component.
 *   - No redirect logic (allows both authenticated and unauthenticated access).
 * - **`/forgot-password`**:
 *   - Public route for password reset requests.
 *   - Renders [`ForgotPasswordPage`](frontend/src/pages/ForgotPasswordPage.tsx) component.
 *   - Redirects authenticated and verified users to `/`.
 * - **`/reset-password`**:
 *   - Public route for resetting password with a token.
 *   - Renders [`ResetPasswordPage`](frontend/src/pages/ResetPasswordPage.tsx) component.
 *   - Accepts a `token` query parameter (e.g., `/reset-password?token=abc123`).
 * - **`*`** (Catch-all):
 *   - Fallback route for undefined paths.
 *   - Renders [`NotFound`](frontend/src/pages/NotFound.tsx) component.
 *
 * ### Lifecycle
 * 1. **Component Mount**:
 *    - Calls [`checkAuth()`](frontend/src/store/authStore.ts) via `useEffect` to verify authentication status.
 *    - Displays [`LoadingSpinner`](frontend/src/components/LoadingSpinner.tsx) while `isCheckingAuth` is `true`.
 * 2. **Authentication Check Complete**:
 *    - Renders the appropriate route based on authentication and verification status.
 *    - Route guards handle redirects automatically.
 *
 * ### Dependencies
 * - [`react-router-dom`](https://reactrouter.com/): For routing (`Navigate`, `Route`, `Routes`).
 * - [`zustand`](https://github.com/pmndrs/zustand): For state management via [`useAuthStore`](frontend/src/store/authStore.ts).
 * - [`react-hot-toast`](https://react-hot-toast.com/): For toast notifications (`Toaster`).
 * - [`LoadingSpinner`](frontend/src/components/LoadingSpinner.tsx): Custom loading component.
 *
 * ### Entry Point
 * This component is rendered in [main.tsx](frontend/src/main.tsx):
 * ```tsx
 * import { StrictMode } from "react";
 * import { createRoot } from "react-dom/client";
 * import { BrowserRouter } from "react-router-dom";
 * import App from "./App.tsx";
 *
 * createRoot(document.getElementById("root")!).render(
 *   <StrictMode>
 *     <BrowserRouter>
 *       <App />
 *     </BrowserRouter>
 *   </StrictMode>
 * );
 * ```
 *
 * ### Related Files
 * - Backend: [server.js](backend/src/server.js) - Handles authentication API endpoints.
 * - Backend: [auth.routes.js](backend/src/routes/auth.routes.js) - Defines authentication routes.
 * - Backend: [protectRoute.js](backend/src/middleware/protectRoute.js) - Middleware for route protection.
 */

import { Navigate, Route, Routes } from "react-router";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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

                <Route path="/reset-password" element={<ResetPasswordPage />} />

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
