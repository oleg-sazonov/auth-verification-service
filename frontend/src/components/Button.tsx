/**
 * Button Component
 * ----------------
 * A reusable button component with variant support, loading state, and consistent styling.
 * Built with TypeScript for strong typing and Framer Motion for animations.
 *
 * ### Props
 * - `variant` (optional):
 *   - **Type**: `"primary" | "danger"`
 *   - **Default**: `"primary"`
 *   - **Description**: Determines the button's color scheme.
 *     - `"primary"`: Emerald green theme for standard actions.
 *     - `"danger"`: Red theme for destructive actions.
 *
 * - `isLoading` (optional):
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Shows a loading spinner when true and disables the button.
 *
 * - `children` (required):
 *   - **Type**: `React.ReactNode`
 *   - **Description**: The button content (e.g., text, icons, or other elements).
 *
 * - `className` (optional):
 *   - **Type**: `string`
 *   - **Default**: `""`
 *   - **Description**: Additional Tailwind CSS classes for customization.
 *
 * - `disabled` (optional):
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Disables the button when true.
 *
 * - `...props`:
 *   - **Type**: `HTMLMotionProps<"button">`
 *   - **Description**: All valid `<button>` attributes (e.g., `type`, `onClick`, `aria-*`).
 *
 * ### Features
 * - **Variants**:
 *   - `"primary"`: Styled for standard actions with emerald green.
 *   - `"danger"`: Styled for destructive actions with red.
 *
 * - **Loading State**:
 *   - Displays a spinner and disables the button when `isLoading` is true.
 *
 * - **Animations**:
 *   - Hover and tap animations using Framer Motion.
 *
 * ### Usage Example
 * ```tsx
 * import Button from "./components/Button";
 * import { LogOut } from "lucide-react";
 *
 * const App = () => (
 *   <>
 *     <Button variant="primary" onClick={handleClick}>
 *       Save Changes
 *     </Button>
 *     <Button variant="danger" isLoading={true}>
 *       <LogOut className="w-5 h-5" />
 *       Logout
 *     </Button>
 *   </>
 * );
 * ```
 */

import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader } from "lucide-react";
// import { type ComponentPropsWithoutRef } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "danger";
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

const Button = ({
    variant = "primary",
    isLoading = false,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) => {
    const isDisabled = isLoading || disabled;

    const baseStyles =
        "w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

    const variantStyles = {
        primary:
            "bg-emerald-600 hover:bg-emerald-700 text-emerald-50 focus:ring-emerald-500",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={isDisabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader className="animate-spin h-5 w-5" />
                    Loading...
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
