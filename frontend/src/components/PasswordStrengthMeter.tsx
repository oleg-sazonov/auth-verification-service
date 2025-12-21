/**
 * Password Strength Meter Component
 * ---------------------------------
 * This component provides a visual representation of password strength and displays criteria for a strong password.
 * It consists of two main parts:
 * - `PasswordCriteria`: Displays a checklist of password requirements.
 * - `PasswordStrengthMeter`: Displays a strength bar and the password strength label.
 *
 * ### Props
 * - `password` (required):
 *   - **Type**: `string`
 *   - **Description**: The password string to evaluate.
 *
 * ### Components
 * #### PasswordCriteria
 * - Displays a checklist of password requirements.
 * - Each requirement is marked as met or unmet based on the provided password.
 * - **Criteria**:
 *   1. At least 8 characters.
 *   2. Contains an uppercase letter.
 *   3. Contains a lowercase letter.
 *   4. Includes a number.
 *   5. Has a special character.
 *
 * #### PasswordStrengthMeter
 * - Evaluates the password strength based on the following rules:
 *   - Length of at least 8 characters.
 *   - Contains both uppercase and lowercase letters.
 *   - Includes at least one number.
 *   - Contains at least one special character.
 * - Displays a strength bar with up to 4 segments:
 *   - 0: Very Weak
 *   - 1: Weak
 *   - 2: Fair
 *   - 3: Strong
 *   - 4: Very Strong
 * - Provides a color-coded strength bar:
 *   - Red for weak passwords.
 *   - Yellow for fair passwords.
 *   - Green for strong passwords.
 *
 * ### Usage Example
 * ```tsx
 * import PasswordStrengthMeter from "./PasswordStrengthMeter";
 *
 * const App = () => {
 *   const [password, setPassword] = useState("");
 *
 *   return (
 *     <div>
 *       <input
 *         type="password"
 *         value={password}
 *         onChange={(e) => setPassword(e.target.value)}
 *         placeholder="Enter your password"
 *       />
 *       <PasswordStrengthMeter password={password} />
 *     </div>
 *   );
 * };
 * ```
 *
 * ### Styling
 * - Utilizes Tailwind CSS for styling.
 * - Classes are used for colors, spacing, and transitions.
 *
 * ### Dependencies
 * - `lucide-react`: For rendering the check (`Check`) and cross (`X`) icons.
 *
 * ### TypeScript Concepts
 * - Strong typing for props ensures the `password` prop is always a string.
 */

import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }: { password: string }) => {
    const criteria = [
        { id: 1, label: "At least 8 characters", met: password.length >= 8 },
        {
            id: 2,
            label: "Contains uppercase letter",
            met: /[A-Z]/.test(password),
        },
        {
            id: 3,
            label: "Contains lowercase letter",
            met: /[a-z]/.test(password),
        },
        { id: 4, label: "Includes a number", met: /\d/.test(password) },
        {
            id: 5,
            label: "Has a special character",
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ];

    return (
        <div className="mt-2 space-y-1 ">
            {criteria.map((item) => (
                <div key={item.id} className="flex items-center text-sm">
                    {item.met ? (
                        <Check className="size-4 text-green-600 mr-2" />
                    ) : (
                        <X className="size-4 text-gray-600 mr-2" />
                    )}
                    <span
                        className={
                            item.met ? "text-green-600" : "text-gray-600"
                        }
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const getStrength = (pass: string): number => {
        let strength = 0;
        if (pass.length >= 8) strength += 1;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength += 1;
        if (/\d/.test(pass)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength += 1;
        return strength;
    };

    const strength = getStrength(password);

    const getColor = (strength: number) => {
        switch (strength) {
            case 0:
                return "bg-red-500";
            case 1:
                return "bg-red-400";
            case 2:
                return "bg-yellow-500";
            case 3:
                return "bg-yellow-400";
            default:
                return "bg-green-600";
        }
    };

    const getStrengthLabel = (strength: number) => {
        switch (strength) {
            case 0:
                return "Very Weak";
            case 1:
                return "Weak";
            case 2:
                return "Fair";
            case 3:
                return "Strong";
            case 4:
                return "Very Strong";
            default:
                return "";
        }
    };
    return (
        <div className="mt-2">
            <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">
                    Password strength:
                </span>
                <span className="text-xs text-gray-400">
                    {getStrengthLabel(strength)}
                </span>
            </div>
            <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
                            index < strength
                                ? getColor(strength)
                                : "bg-gray-600"
                        }`}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrengthMeter;
