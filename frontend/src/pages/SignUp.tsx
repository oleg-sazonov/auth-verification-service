import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, User, Lock } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";

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
            className="w-full max-w-md overflow-hidden rounded-lg bg-gray-800/50 p-2 text-center text-2xl font-semibold shadow-lg backdrop-blur-sm"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold text-emerald-50 mb-6  ">
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
                    {/*Password Strength Indicator could go here*/}
                </form>
            </div>
        </motion.div>
    );
};

export default SignUp;
