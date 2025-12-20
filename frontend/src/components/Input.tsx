/**
 * Input Component
 * ---------------
 * A reusable input component with an icon, designed for forms.
 * Built with TypeScript for strong typing and React for rendering.
 *
 * ### Props
 * - `icon` (required):
 *   - **Type**: `ElementType`
 *   - **Description**: A React component (e.g., an icon) to display inside the input field.
 * - `...props`:
 *   - **Type**: `ComponentPropsWithoutRef<"input">`
 *   - **Description**: All valid `<input>` attributes (e.g., `type`, `placeholder`, `value`, `onChange`).
 *
 * ### TypeScript Concepts
 * - `ComponentPropsWithoutRef<"input">`: Extracts all valid props for a native `<input>` element, excluding `ref`.
 * - `ElementType`: Represents any valid React component or HTML tag.
 *
 * ### Usage Example
 * ```tsx
 * import { Mail } from "lucide-react";
 *
 * const App = () => (
 *   <Input
 *     icon={Mail}
 *     type="email"
 *     placeholder="Enter your email"
 *     value=""
 *     onChange={(e) => console.log(e.target.value)}
 *   />
 * );
 * ```
 */

import { type ComponentPropsWithoutRef, type ElementType } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
    icon: ElementType;
}

const Input = ({ icon: Icon, ...props }: InputProps) => {
    return (
        <div className="relative mb-6">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <Icon className="size-5 text-green-500" />
            </div>
            <input
                {...props}
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-2 pe-4 ps-10 text-sm text-emerald-50 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    );
};

export default Input;
