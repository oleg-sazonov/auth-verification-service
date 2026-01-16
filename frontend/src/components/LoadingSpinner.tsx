/**
 * LoadingSpinner Component
 * ------------------------
 * A reusable animated loading spinner component built with Framer Motion.
 * Designed to match the app's visual style with emerald accents and dark backgrounds.
 *
 * ### Features
 * - **Framer Motion Animations**:
 *   - Smooth fade-in animation on mount.
 *   - Continuous rotation animation for the spinner.
 *   - Pulsing glow effect for visual depth.
 * - **Accessibility**:
 *   - Includes `role="status"` and `aria-label` for screen readers.
 *   - Hidden accessible text for assistive technologies.
 * - **Responsive Design**:
 *   - Centers the spinner vertically and horizontally.
 *   - Matches the App.tsx background styling with gradients and patterns.
 *
 * ### Props
 * - `size` (optional):
 *   - **Type**: `number`
 *   - **Default**: `64`
 *   - **Description**: The size of the spinner in pixels (height and width).
 * - `message` (optional):
 *   - **Type**: `string`
 *   - **Default**: `"Loading..."`
 *   - **Description**: Accessible message for screen readers.
 *
 * ### Usage Example
 * ```tsx
 * import LoadingSpinner from "./components/LoadingSpinner";
 *
 * const App = () => (
 *   <LoadingSpinner size={80} message="Loading your dashboard..." />
 * );
 * ```
 *
 * ### Styling
 * - Utilizes Tailwind CSS for consistent theming with App.tsx.
 * - Includes background gradient, radial pattern, and emerald accents.
 * - Matches the exact style used in App.tsx for seamless integration.
 *
 * ### Dependencies
 * - `framer-motion`: For smooth animations.
 */

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: number;
    message?: string;
}

const LoadingSpinner = ({
    size = 64,
    message = "Loading...",
}: LoadingSpinnerProps) => {
    return (
        <div
            className="min-h-screen bg-gray-950 text-emerald-50 relative overflow-hidden flex items-center justify-center px-4"
            role="status"
            aria-label={message}
        >
            {/* Background pattern - matches App.tsx */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_1px,transparent_1px)] bg-size-[32px_32px] opacity-60" />

            {/* Gradient overlay - matches App.tsx */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-900/80 via-emerald-800/60 to-gray-900/80 mix-blend-screen" />

            {/* Spinner container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className="relative z-10"
            >
                {/* Spinning border */}
                <motion.div
                    className="rounded-full border-4 border-gray-700"
                    style={{
                        width: size,
                        height: size,
                        borderTopColor: "rgb(16, 185, 129)", // emerald-500
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Pulsing glow effect */}
                {/* <motion.div
                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                /> */}

                {/* Visually hidden text for screen readers */}
                <span className="sr-only">{message}</span>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
