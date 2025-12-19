import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authService as AuthService } from "../../services/AuthServices.js";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await AuthService.forgotPassword(email);
            setShowToast(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            {/* Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                    >
                        ✅ Password reset link sent
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md transition-colors duration-300">
                <h2 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">
                    Reset Password
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Enter your email address and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Email Input */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Footer Link */}
                <div className="mt-6 text-sm text-white flex gap-2 items-center">
                    <span>Remembered your password?</span>
                    <Link to="/login" className="font-semibold hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;