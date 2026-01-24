import { motion } from "framer-motion";
import { ArrowLeft, Home as HomeIcon, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";

const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    // Determine if user is fully authenticated (logged in and verified)
    const isFullyAuthenticated = isAuthenticated && user?.isVerified;

    const handleGoBack = () => {
        // Go back to previous page in history
        navigate(-1);
    };

    const handleGoHome = () => {
        if (isFullyAuthenticated) {
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md mx-auto text-center"
        >
            <div className="overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm backdrop-filter p-8">
                {/* 404 Error Display */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                >
                    <h1 className="text-8xl font-bold bg-linear-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text mb-4">
                        404
                    </h1>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-6" />
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4 mb-8"
                >
                    <h2 className="text-2xl font-semibold text-emerald-50">
                        Page Not Found
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Oops! The page you're looking for doesn't exist. It
                        might have been moved or deleted.
                    </p>
                </motion.div>

                {/* Navigation Options */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-3"
                >
                    {/* Primary Action - Go Back */}
                    <Button
                        variant="primary"
                        onClick={handleGoBack}
                        className="w-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>

                    {/* Secondary Actions */}
                    <div className="flex gap-3">
                        {/* Go Home/Login Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoHome}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg bg-gray-700/50 hover:bg-gray-700 text-emerald-50 border border-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <HomeIcon className="w-4 h-4" />
                            {isFullyAuthenticated ? "Home" : "Login"}
                        </motion.button>

                        {/* Sign Up Button - Only show for non-authenticated users */}
                        {!isFullyAuthenticated && (
                            <Link to="/signup" className="flex-1">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg bg-gray-700/50 hover:bg-gray-700 text-emerald-50 border border-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-8 pt-6 border-t border-gray-700"
                >
                    <p className="text-xs text-gray-500">
                        Lost? Use the buttons above to get back on track.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NotFound;
