/**
 * ResetPasswordPage Component
 * ---------------------------
 * Handles the password reset process using a token provided via email.
 * This page validates the token, allows the user to set a new password, and handles errors gracefully.
 *
 * ### Features
 * - **Token Extraction**:
 *   - Extracts the reset token from the query string using `useSearchParams()`.
 *   - Example URL: `/reset-password?token=abc123`.
 * - **Form Validation**:
 *   - Ensures passwords match.
 *   - Enforces a minimum password length of 6 characters.
 * - **Error Handling**:
 *   - Missing token → Displays error UI with a "Request New Reset Link" button.
 *   - Invalid/expired token → Displays error UI after backend validation.
 *   - Other errors → Displays inline error above the form.
 * - **Success Flow**:
 *   - Shows a success toast on successful password reset.
 *   - Redirects to the login page after a 2-second delay.
 *
 * ### Props
 * - None (uses Zustand store and URL query parameters).
 *
 * ### State
 * - `password`:
 *   - **Type**: `string`
 *   - **Description**: Stores the new password entered by the user.
 * - `confirmPassword`:
 *   - **Type**: `string`
 *   - **Description**: Stores the confirmation password to ensure they match.
 *
 * ### Workflow
 * 1. **Token Validation**:
 *    - If no token is present, shows an error UI immediately.
 *    - If the backend returns an "Invalid or expired token" error, shows the same error UI.
 * 2. **Password Input**:
 *    - User enters and confirms the new password.
 *    - Form validates that passwords match and meet the minimum length requirement.
 * 3. **Form Submission**:
 *    - Calls the `resetPassword` function from the `useAuthStore`.
 *    - Sends the token and new password to the backend.
 * 4. **Success**:
 *    - Displays a success toast.
 *    - Redirects to the login page after a short delay.
 * 5. **Error Handling**:
 *    - Displays inline errors for other backend issues (e.g., network errors).
 *
 * ### Error States
 * - **No Token**:
 *   - Shows error UI with a red lock icon and a "Request New Reset Link" button.
 * - **Invalid/Expired Token**:
 *   - Shows the same error UI after backend validation.
 * - **Other Errors**:
 *   - Displays inline error messages above the form.
 *
 * ### Components Used
 * - `FormCard`: A reusable card component for consistent form styling.
 * - `Input`: A reusable input component for password fields.
 * - `SubmitButton`: A reusable button component with a loading state.
 * - `motion.div`: Used for animations (Framer Motion).
 *
 * ### Dependencies
 * - `zustand`: For state management (`useAuthStore`).
 * - `react-router-dom`: For navigation and query parameter extraction.
 * - `react-hot-toast`: For toast notifications.
 * - `framer-motion`: For animations.
 *
 * ### Related Files
 * - `authStore.ts`: Contains the `resetPassword` function for API integration.
 * - `ForgotPasswordPage.tsx`: Related page for requesting a password reset link.
 * - `password.controller.js`: Backend controller for handling password reset logic.
 *
 * ### Usage Example
 * ```tsx
 * <Route path="/reset-password" element={<ResetPasswordPage />} />
 * ```
 */

import { motion } from "framer-motion";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import FormCard from "../components/FormCard";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchParams] = useSearchParams(); // use this instead of useParams
    const navigate = useNavigate();

    const { isLoading, error, resetPassword } = useAuthStore();

    const token = searchParams.get("token");

    // Clear error when component mounts
    useEffect(() => {
        useAuthStore.setState({ error: null, message: null });
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        // Validate token exists
        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully!");

            // Navigate to login after short delay
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Password reset failed:", error);
        }
    };

    // Show error state if no token OR if backend returns invalid/expired token error
    if (!token || (error && error.includes("Invalid or expired token"))) {
        return (
            <FormCard title="Reset Password">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <p className="text-gray-300 mb-6">
                        {error ||
                            "Invalid or missing reset token. Please request a new password reset link."}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/forgot-password")}
                        className="mt-4 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-emerald-50 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
                    >
                        Request New Reset Link
                    </motion.button>
                    {/* <Button
                        variant="primary"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Request New Reset Link
                    </Button> */}
                </motion.div>
            </FormCard>
        );
    }

    return (
        <FormCard
            title="Reset Password"
            description="Enter your new password below."
        >
            {/* <form onSubmit={handleSubmit} className="mt-8">
                {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )} */}

            <form onSubmit={handleSubmit} className="mt-8">
                {error && !error.includes("Invalid or expired token") && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <Input
                    icon={Lock}
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <Input
                    icon={Lock}
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                    }
                    required
                />

                <SubmitButton type="submit" isLoading={isLoading}>
                    Reset Password
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default ResetPasswordPage;
