import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import EmailVerificationPage from "./pages/EmailVerificationPage";

function App() {
    return (
        <div className="min-h-screen bg-gray-950 text-emerald-50 relative overflow-hidden flex items-center justify-center px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_1px,transparent_1px)] bg-size-[32px_32px] opacity-60" />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-900/80 via-emerald-800/60 to-gray-900/80 mix-blend-screen" />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
