import Input from "../components/Input";
import { Mail, User, Lock } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SubmitButton from "../components/SubmitButton";
import FormCard from "../components/FormCard";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle sign-up logic here
        console.log("Signing up with:", { name, email, password });
    };

    return (
        <FormCard
            title="Login"
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
                <SubmitButton type="submit" isLoading={false}>
                    Sign Up
                </SubmitButton>
            </form>
        </FormCard>
    );
};

export default SignUp;
