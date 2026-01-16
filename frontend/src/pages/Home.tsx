import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { formatDate, formatDateTime } from "../utils/date";

const Home = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md mx-auto"
        >
            <div className="overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm backdrop-filter">
                {/* Header Section */}
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                        Welcome Back!
                    </h2>

                    {/* Profile Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                                Profile Information
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-start justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                    <span className="text-sm font-medium text-gray-400">
                                        Name:
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-50 text-right">
                                        {user?.name}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                    <span className="text-sm font-medium text-gray-400">
                                        Email:
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-50 text-right break-all">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div>
                            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                                Account Status
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                    <span className="text-sm font-medium text-gray-400">
                                        Email Verified:
                                    </span>
                                    <span
                                        className={`text-sm font-semibold ${
                                            user?.isVerified
                                                ? "text-emerald-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {user?.isVerified ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                    <span className="text-sm font-medium text-gray-400">
                                        Member Since:
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-50 text-right">
                                        {user?.createdAt
                                            ? formatDate(user.createdAt)
                                            : "N/A"}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                    <span className="text-sm font-medium text-gray-400">
                                        Last Login:
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-50 text-right">
                                        {user?.lastLogin
                                            ? formatDateTime(user.lastLogin)
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Logout Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
