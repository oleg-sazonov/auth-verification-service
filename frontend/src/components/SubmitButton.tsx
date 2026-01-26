/**
 * SubmitButton Component
 * ----------------------
 * A reusable submit button component with loading state support and animations.
 * Built with TypeScript for strong typing and Framer Motion for smooth interactions.
 *
 * ### Props
 * - `isLoading` (optional):
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Shows a loading spinner when true and disables the button.
 * - `children` (required):
 *   - **Type**: `React.ReactNode`
 *   - **Description**: The button content (text, icons, etc.).
 * - `disabled` (optional):
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Manually disable the button.
 * - `...props` (optional):
 *   - **Type**: `Omit<HTMLMotionProps<"button">, "children">`
 *   - **Description**: All valid Framer Motion button props (e.g., `type`, `onClick`, `className`).
 *
 * ### Features
 * - **Loading State**: Displays a spinning loader icon from `lucide-react` when `isLoading` is true.
 * - **Auto-disable**: Button is automatically disabled when loading or manually disabled.
 * - **Hover Animation**: Scales up slightly on hover (1.02x) for visual feedback.
 * - **Tap Animation**: Scales down slightly on click (0.98x) for tactile feedback.
 * - **Accessible**: Includes focus ring styles and disabled cursor states.
 *
 * ### Styling
 * - Uses Tailwind CSS for consistent emerald-themed styling.
 * - Full-width button with rounded corners.
 * - Disabled state shows reduced opacity and changes cursor.
 * - Focus ring for keyboard accessibility.
 *
 * ### Usage Example
 * ```tsx
 * import SubmitButton from "./components/SubmitButton";
 *
 * const LoginForm = () => {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <SubmitButton type="submit" isLoading={isLoading}>
 *         Login
 *       </SubmitButton>
 *     </form>
 *   );
 * };
 * ```
 *
 * ### Used In
 * - [`Login.tsx`](frontend/src/pages/Login.tsx) - Login form submission
 * - [`SignUp.tsx`](frontend/src/pages/SignUp.tsx) - User registration
 * - [`EmailVerificationPage.tsx`](frontend/src/pages/EmailVerificationPage.tsx) - Email verification
 * - [`ForgotPasswordPage.tsx`](frontend/src/pages/ForgotPasswordPage.tsx) - Password reset request
 * - [`ResetPasswordPage.tsx`](frontend/src/pages/ResetPasswordPage.tsx) - Password reset
 *
 * ### Dependencies
 * - `framer-motion`: For button animations (`motion.button`, `HTMLMotionProps`)
 * - `lucide-react`: For the loading spinner icon (`Loader`)
 *
 * ### TypeScript
 * - Interface extends `HTMLMotionProps<"button">` but omits `children` to ensure proper typing.
 * - This prevents conflicts between React's native props and Framer Motion's animation props.
 *
 * ### Related Components
 * - [`Button.tsx`](frontend/src/components/Button.tsx) - General-purpose button with variant support
 * - [`Input.tsx`](frontend/src/components/Input.tsx) - Form input component
 * - [`FormCard.tsx`](frontend/src/components/FormCard.tsx) - Form container component
 */

import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader } from "lucide-react";
// import { type ComponentPropsWithoutRef } from "react";

interface SubmitButtonProps extends Omit<
    HTMLMotionProps<"button">,
    "children"
> {
    isLoading?: boolean;
    children: React.ReactNode;
}

const SubmitButton = ({
    isLoading = false,
    children,
    disabled,
    ...props
}: SubmitButtonProps) => {
    const isDisabled = isLoading || disabled;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-base font-semibold text-emerald-50 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDisabled}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2 h-5 w-5 text-emerald-50" />
                </div>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default SubmitButton;
