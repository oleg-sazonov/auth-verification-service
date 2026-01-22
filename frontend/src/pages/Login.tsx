/**
 * Login Component
 * ---------------
 * This component renders the login page, allowing users to authenticate by entering their email and password.
 * It includes form validation, error handling, and a loading state during the login process.
 *
 * ### Features
 * - **Form Inputs**:
 *   - Email and password fields with validation.
 *   - Uses the `Input` component for consistent styling.
 * - **Error Handling**:
 *   - Displays error messages from the `useAuthStore` if login fails.
 * - **Loading State**:
 *   - Disables the submit button and shows a loading spinner during the login process.
 * - **Navigation**:
 *   - Includes links to the "Sign Up" and "Forgot Password" pages.
 *
 * ### Props
 * - None (state and actions are managed via Zustand's `useAuthStore`).
 *
 * ### State
 * - `email`:
 *   - **Type**: `string`
 *   - **Default**: `""`
 *   - **Description**: Stores the user's email input.
 * - `password`:
 *   - **Type**: `string`
 *   - **Default**: `""`
 *   - **Description**: Stores the user's password input.
 *
 * ### Workflow
 * 1. **User Input**:
 *    - User enters their email and password into the form fields.
 * 2. **Form Submission**:
 *    - On form submission, the `handleLogin` function is called.
 *    - Calls the `login` action from the `useAuthStore` to authenticate the user.
 * 3. **Error Handling**:
 *    - If the login fails, the error message is displayed above the submit button.
 * 4. **Loading State**:
 *    - The submit button is disabled, and a loading spinner is displayed while the login request is in progress.
 *
 * ### Error Handling
 * - Errors from the `login` action are stored in the `error` state of the `useAuthStore`.
 * - The error message is displayed in a styled alert box above the submit button.
 *
 * ### Components Used
 * - `FormCard`: A reusable card component for consistent form styling.
 * - `Input`: A reusable input component for the email and password fields.
 * - `SubmitButton`: A reusable button component with a loading state.
 *
 * ### Dependencies
 * - `zustand`: For state management (`useAuthStore`).
 * - `react-router-dom`: For navigation to the "Sign Up" and "Forgot Password" pages.
 * - `lucide-react`: For rendering icons in the input fields.
 *
 * ### Related Files
 * - `authStore.ts`: Contains the `login` function for API integration.
 * - `SignUp.tsx`: Related page for user registration.
 * - `ForgotPasswordPage.tsx`: Related page for password reset requests.
 *
 * ### Usage Example
 * ```tsx
 * import Login from "./pages/Login";
 *
 * const App = () => {
 *   return <Login />;
 * };
 * ```
 *
 * ### Styling
 * - Utilizes Tailwind CSS for styling.
 * - Includes responsive and accessible styles for input fields and the submit button.
 *
 * ### Notes
 * - The `isLoading` state is managed by the `useAuthStore` and is used to disable the submit button during API calls.
 * - The `error` state from the `useAuthStore` is displayed if the login request fails.
 */

import { Link } from "react-router-dom";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";

import { Mail, Lock } from "lucide-react";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import FormCard from "../components/FormCard";

import { useAuthStore } from "../store/authStore";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { isLoading, login, error } = useAuthStore();

    // Clear error when component mounts
    useEffect(() => {
        useAuthStore.setState({ error: null, message: null });
    }, []);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <FormCard
            title="Login"
            footer={
                <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to={"/signup"}
                        className="text-emerald-400 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleLogin} className="mt-8">
                <Input
                    icon={Mail}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                />
                <Input
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />
                <div className="flex items-center mb-4">
                    <Link
                        to={"/forgot-password"}
                        className="text-sm text-emerald-400 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <SubmitButton type="submit" isLoading={isLoading}>
                    Login
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default Login;
