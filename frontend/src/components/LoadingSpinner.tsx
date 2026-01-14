import { Loader } from "lucide-react";

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loader className="animate-spin h-12 w-12 text-emerald-500" />
        </div>
    );
};

export default LoadingSpinner;
