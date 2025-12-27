/**
 * Button Component
 * ----------------
 * A reusable button component with consistent styling and loading state support.
 * Built with TypeScript for strong typing and Framer Motion for animations.
 *
 * ### Props
 * - `isLoading` (optional):
 *   - **Type**: `boolean`
 *   - **Default**: `false`
 *   - **Description**: Shows a loading spinner when true and disables the button.
 * - `children` (required):
 *   - **Type**: `React.ReactNode`
 *   - **Description**: The button content (text, icons, etc.).
 * - `...props`:
 *   - **Type**: `ComponentPropsWithoutRef<"button">`
 *   - **Description**: All valid `<button>` attributes (e.g., `type`, `onClick`, `disabled`).
 *
 * ### Usage Example
 * ```tsx
 * import Button from "./components/Button";
 *
 * const App = () => (
 *   <Button type="submit" isLoading={false}>
 *     Submit
 *   </Button>
 * );
 * ```
 */

import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";

interface SubmitButtonProps extends ComponentPropsWithoutRef<"button"> {
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
