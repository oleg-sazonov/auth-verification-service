/**
 * FormCard Component
 * ------------------
 * A reusable card container for forms with consistent styling and animations.
 * Built with TypeScript and Framer Motion for smooth transitions.
 *
 * ### Props
 * - `title` (required):
 *   - **Type**: `string`
 *   - **Description**: The heading text displayed at the top of the card.
 * - `description` (optional):
 *   - **Type**: `string`
 *   - **Description**: Optional subtitle or description text below the title.
 * - `children` (required):
 *   - **Type**: `React.ReactNode`
 *   - **Description**: The form content or other elements to display inside the card.
 * - `footer` (optional):
 *   - **Type**: `React.ReactNode`
 *   - **Description**: Optional footer content (e.g., links to other pages).
 *
 * ### Usage Example
 * ```tsx
 * import FormCard from "./components/FormCard";
 *
 * const App = () => (
 *   <FormCard
 *     title="Login"
 *     footer={<p>Don't have an account? <Link to="/signup">Sign Up</Link></p>}
 *   >
 *     <form>{ form inputs }</form>
 *   </FormCard>
 * );
 * ```
 */

import { motion } from "framer-motion";

interface FormCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const FormCard = ({ title, description, children, footer }: FormCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm"
        >
            <div className="p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-emerald-50">
                    {title}
                </h2>
                {description && (
                    <p className="text-center text-gray-300 mb-6">
                        {description}
                    </p>
                )}
                {children}
            </div>
            {footer && (
                <div className="px-8 py-4 bg-gray-700/50 border-t border-gray-600 text-sm text-gray-400 bg-opacity-50 flex justify-center">
                    {footer}
                </div>
            )}
        </motion.div>
    );
};

export default FormCard;
