/**
 * Email Verification Page
 * ------------------------
 * This component renders the email verification page, where users can input a 6-digit verification code
 * sent to their email address. It includes input fields for the code, auto-focus and auto-submit functionality,
 * and a submit button.
 *
 * ### Features
 * - **6-Digit Code Input**:
 *   - Users can input a 6-digit verification code.
 *   - Supports both typing and pasting of the code.
 * - **Auto-Focus**:
 *   - Automatically focuses on the first input field when the component mounts.
 *   - Moves focus to the next input field as the user types.
 * - **Auto-Submit**:
 *   - (Commented out) Automatically submits the form when all 6 digits are filled.
 * - **Validation**:
 *   - Ensures all 6 digits are entered before submission.
 * - **Reusable Submit Button**:
 *   - Uses the `SubmitButton` component for consistent styling and loading state handling.
 *
 * ### Props
 * - None
 *
 * ### State
 * - `code`:
 *   - **Type**: `string[]`
 *   - **Default**: `["", "", "", "", "", ""]`
 *   - **Description**: Stores the 6-digit verification code entered by the user.
 * - `isLoading`:
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Represents the loading state of the form submission.
 *
 * ### Refs
 * - `inputRefs`:
 *   - **Type**: `React.MutableRefObject<(HTMLInputElement | null)[]>`
 *   - **Description**: Stores references to the input fields for managing focus.
 *
 * ### Functions
 * - `handleChange(index: number, value: string)`:
 *   - **Description**: Handles changes to the input fields, including typing and pasting.
 *   - **Parameters**:
 *     - `index`: The index of the input field being updated.
 *     - `value`: The new value entered by the user.
 * - `handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>)`:
 *   - **Description**: Handles the `Backspace` key to move focus to the previous input field.
 *   - **Parameters**:
 *     - `index`: The index of the input field.
 *     - `e`: The keyboard event.
 * - `handleSubmit(e: React.FormEvent)`:
 *   - **Description**: Handles form submission, validates the code, and logs the verification code.
 *   - **Parameters**:
 *     - `e`: The form event.
 *
 * ### Usage Example
 * ```tsx
 * import EmailVerificationPage from "./pages/EmailVerificationPage";
 *
 * const App = () => {
 *   return <EmailVerificationPage />;
 * };
 * ```
 *
 * ### Styling
 * - Utilizes Tailwind CSS for styling.
 * - Includes responsive and accessible styles for input fields and the submit button.
 *
 * ### Dependencies
 * - `framer-motion`: For animations.
 * - `react-router-dom`: For navigation.
 * - `SubmitButton`: A reusable button component with consistent styling and loading state support.
 *
 * ### Notes
 * - The `isLoading` state is currently hardcoded as `false`. Replace it with actual loading logic as needed.
 * - The auto-submit functionality is commented out but can be enabled if required.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import FormCard from "../components/FormCard";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate(); // For navigation after verification

    const isLoading = false; // Replace with actual loading state

    // Focus on the first input when component mounts
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    //Auto-submit when all digits are filled
    // useEffect(() => {
    //     if (code.every((digit) => digit !== "")) {
    //         // Simulate form submission
    //         console.log("Auto-submitting code:", code.join(""));
    //         handleSubmit(new Event("submit") as unknown as React.FormEvent);
    //     }
    // }, [code]);

    // Handles both typing and pasting verification code
    const handleChange = (index: number, value: string) => {
        const newCode = [...code];

        // User pasted multiple characters
        if (value.length > 1) {
            // Extract only numbers from pasted text
            const pastedValues = value
                .slice(0, 6)
                .split("")
                .filter((char) => /^\d$/.test(char));

            // Fill inputs starting from current position
            for (let i = 0; i < pastedValues.length && index + i < 6; i++) {
                newCode[index + i] = pastedValues[i];
            }
            setCode(newCode);

            // Move focus to next empty input or last filled
            const nextEmptyIndex = newCode.findIndex(
                (digit, idx) => idx > index && digit === ""
            );
            const focusIndex =
                nextEmptyIndex !== -1
                    ? nextEmptyIndex
                    : Math.min(index + pastedValues.length, 5);
            inputRefs.current[focusIndex]?.focus();
        } else {
            // User typed a single character
            // Reject non-numbers
            if (!/^\d*$/.test(value)) return;

            newCode[index] = value;
            setCode(newCode);

            // Auto-advance to next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handle backspace to go to previous input
    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // If backspace pressed on empty input, move to previous
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join("");

        // Validate that all 6 digits are filled
        if (verificationCode.length !== 6) {
            console.log("Please enter all 6 digits");
            return;
        }

        console.log("Submitted verification code:", verificationCode);
        // TODO: Call API to verify code
    };

    return (
        <FormCard
            title="Verify Your Email"
            description="Enter the 6-digit code sent to your email address."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={6}
                            value={digit}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg text-emerald-50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <SubmitButton type="submit" isLoading={isLoading}>
                    Verify Email
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default EmailVerificationPage;
