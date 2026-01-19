import { motion } from "framer-motion";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import FormCard from "../components/FormCard";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, error, forgotPassword } = useAuthStore();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Password reset request failed:", error);
        }
    };

    return (
        <FormCard
            title="Forgot Password"
            description={
                isSubmitted
                    ? undefined
                    : "Enter your email address and we'll send you a link to reset your password."
            }
            footer={
                <Link
                    to="/login"
                    className="text-sm text-emerald-400 hover:underline flex items-center justify-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            }
        >
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="mt-8">
                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <SubmitButton type="submit" isLoading={isLoading}>
                        Send Reset Link
                    </SubmitButton>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-gray-300 mb-6">
                        If an account exists for{" "}
                        <span className="font-semibold text-emerald-400">
                            {email}
                        </span>
                        , you will receive a password reset link shortly.
                    </p>
                </motion.div>
            )}
        </FormCard>
    );
};

export default ForgotPasswordPage;
