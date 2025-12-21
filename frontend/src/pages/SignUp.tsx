import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, User, Lock } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm"
        >
            <div className="p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-emerald-50">
                    Create Account
                </h2>
                <form onSubmit={handleSignUp} className="mt-8">
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                        }
                    />
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                    />
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                    />
                    <PasswordStrengthMeter password={password} />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-4 w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-base font-semibold text-emerald-50 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Sign Up
                    </motion.button>
                </form>
            </div>
            <div className="px-8 py-4 bg-gray-700/50 border-t border-gray-600 text-sm text-gray-400 bg-opacity-50 flex justify-center ">
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to={"/login"}
                        className="text-emerald-400 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUp;
