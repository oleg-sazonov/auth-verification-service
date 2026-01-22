/**
 * Forgot Password Page
 * ---------------------
 * This component renders the "Forgot Password" page, allowing users to request a password reset link
 * by entering their email address. It includes form validation, error handling, and a success message
 * upon submission.
 *
 * ### Features
 * - **Form Inputs**:
 *   - Email input field with validation.
 *   - Uses the `Input` component for consistent styling.
 * - **Error Handling**:
 *   - Displays error messages from the `useAuthStore` if the password reset request fails.
 * - **Loading State**:
 *   - Disables the submit button and shows a loading spinner during the password reset request.
 * - **Success Message**:
 *   - Displays a confirmation message after the reset link is sent.
 * - **Navigation**:
 *   - Includes a link to navigate back to the "Login" page.
 *
 * ### Props
 * - None (state and actions are managed via Zustand's `useAuthStore`).
 *
 * ### State
 * - `email`:
 *   - **Type**: `string`
 *   - **Default**: `""`
 *   - **Description**: Stores the user's email input.
 * - `isSubmitted`:
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Tracks whether the password reset request has been successfully submitted.
 *
 * ### Workflow
 * 1. **User Input**:
 *    - User enters their email address into the input field.
 * 2. **Form Submission**:
 *    - On form submission, the `handleSubmit` function is called.
 *    - Calls the `forgotPassword` action from the `useAuthStore` to send the reset link.
 * 3. **Error Handling**:
 *    - If the request fails, the error message is displayed above the input field.
 * 4. **Success Message**:
 *    - If the request succeeds, a confirmation message is displayed.
 *
 * ### Error Handling
 * - Errors from the `forgotPassword` action are stored in the `error` state of the `useAuthStore`.
 * - The error message is displayed in a styled alert box above the input field.
 *
 * ### Components Used
 * - `FormCard`: A reusable card component for consistent form styling.
 * - `Input`: A reusable input component for the email field.
 * - `SubmitButton`: A reusable button component with a loading state.
 *
 * ### Dependencies
 * - `zustand`: For state management (`useAuthStore`).
 * - `react-router-dom`: For navigation to the "Login" page.
 * - `lucide-react`: For rendering icons in the input field and success message.
 * - `framer-motion`: For animations on the success message.
 *
 * ### Related Files
 * - `authStore.ts`: Contains the `forgotPassword` function for API integration.
 * - `Login.tsx`: Related page for user authentication.
 *
 * ### Usage Example
 * ```tsx
 * import ForgotPasswordPage from "./pages/ForgotPasswordPage";
 *
 * const App = () => {
 *   return <ForgotPasswordPage />;
 * };
 * ```
 *
 * ### Styling
 * - Utilizes Tailwind CSS for styling.
 * - Includes responsive and accessible styles for the input field, submit button, and success message.
 *
 * ### Notes
 * - The `isLoading` state is managed by the `useAuthStore` and is used to disable the submit button during API calls.
 * - The `error` state from the `useAuthStore` is displayed if the password reset request fails.
 * - The success message is displayed conditionally based on the `isSubmitted` state.
 */

import { motion } from "framer-motion";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import FormCard from "../components/FormCard";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, error, forgotPassword } = useAuthStore();

    // Clear error when component mounts
    useEffect(() => {
        useAuthStore.setState({ error: null, message: null });
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Password reset request failed:", error);
        }
    };

    return (
        <FormCard
            title="Forgot Password"
            description={
                isSubmitted
                    ? undefined
                    : "Enter your email address and we'll send you a link to reset your password."
            }
            footer={
                <Link
                    to="/login"
                    className="text-sm text-emerald-400 hover:underline flex items-center justify-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            }
        >
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="mt-8">
                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <SubmitButton type="submit" isLoading={isLoading}>
                        Send Reset Link
                    </SubmitButton>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-gray-300 mb-6">
                        If an account exists for{" "}
                        <span className="font-semibold text-emerald-400">
                            {email}
                        </span>
                        , you will receive a password reset link within 10-15
                        minutes. Please check your spam folder if you don't see
                        it.
                    </p>
                </motion.div>
            )}
        </FormCard>
    );
};

export default ForgotPasswordPage;
