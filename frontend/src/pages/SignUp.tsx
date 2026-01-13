import { Mail, User, Lock } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SubmitButton from "../components/SubmitButton";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

import { useAuthStore } from "../store/authStore";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signup, isLoading, error } = useAuthStore();

    const navigate = useNavigate();

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate("/verify-email");
        } catch (error) {
            // Error is already handled in the store
            console.error("Signup failed:", error);
        }
    };

    return (
        <FormCard
            title="Sign Up"
            footer={
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to={"/login"}
                        className="text-emerald-400 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSignUp} className="mt-8">
                {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}
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
                <SubmitButton type="submit" isLoading={isLoading}>
                    Sign Up
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default SignUp;
