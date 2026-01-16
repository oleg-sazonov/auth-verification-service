import { Link } from "react-router-dom";
import { useState, type FormEvent, type ChangeEvent } from "react";

import { Mail, Lock } from "lucide-react";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import FormCard from "../components/FormCard";

import { useAuthStore } from "../store/authStore";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { isLoading, login, error } = useAuthStore();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <FormCard
            title="Login"
            footer={
                <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to={"/signup"}
                        className="text-emerald-400 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleLogin} className="mt-8">
                <Input
                    icon={Mail}
                    type="text"
                    placeholder="Full Name"
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
                <div className="flex items-center mb-4">
                    <Link
                        to={"/forgot-password"}
                        className="text-sm text-emerald-400 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <SubmitButton type="submit" isLoading={isLoading}>
                    Login
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default Login;
