import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate(); // For navigation after verification

    const isLoading = false; // Replace with actual loading state

    const handleChange = (index: number, value: string) => {};

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm"
        >
            <div className="p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-emerald-50">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Enter the 6-digit code sent to your email address.
                </p>
                <form className="space-y-6">
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

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-4 w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-base font-semibold text-emerald-50 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader className="animate-spin mr-2 h-5 w-5 text-emerald-50" />
                            </div>
                        ) : (
                            "Verify Email"
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default EmailVerificationPage;
