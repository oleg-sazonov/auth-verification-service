/**
 * RateLimitWarning Component
 * ---------------------------
 * Displays a warning message when user is approaching rate limit.
 * Shows remaining attempts and provides visual feedback.
 *
 * ### Props
 * - `remaining`: number - Number of remaining attempts
 * - `limit`: number - Total number of attempts allowed
 * - `action`: string - Action name (e.g., "login attempts", "verification attempts")
 *
 * ### Usage
 * ```tsx
 * <RateLimitWarning remaining={2} limit={5} action="login attempts" />
 * ```
 */

import { AlertTriangle } from "lucide-react";

interface RateLimitWarningProps {
    remaining: number;
    limit: number;
    action: string;
}

const RateLimitWarning = ({
    remaining,
    limit,
    action,
}: RateLimitWarningProps) => {
    // Only show warning when 20% or less attempts remain
    const showWarning = remaining <= Math.ceil(limit * 0.2);

    if (!showWarning || remaining <= 0) return null;

    return (
        <div className="mb-4 p-3 rounded bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
                <p className="font-semibold">Rate limit warning</p>
                <p className="text-xs mt-1">
                    You have {remaining} {action} remaining. Please wait 15
                    minutes after reaching the limit.
                </p>
            </div>
        </div>
    );
};

export default RateLimitWarning;
