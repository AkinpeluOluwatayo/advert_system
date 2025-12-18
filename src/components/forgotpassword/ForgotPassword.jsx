import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setShowToast(false);

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            // Simulate API call for password reset
            const response = await axios.post(
                "https://jsonplaceholder.typicode.com/posts",
                { email }
            );

            if (response.status === 201 || response.status === 200) {
                setShowToast(true);

                // Redirect after short delay
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 relative">
            {/* ================= TOAST ================= */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3"
                    >
                        ✅ Password reset link sent!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= LEFT: IMAGE / TEXT ================= */}
            <div className="hidden md:flex flex-col justify-center px-12 py-16">
                <h3 className="text-4xl font-extrabold leading-tight text-blue-600 dark:text-blue-400">
                    Forgot Password?
                </h3>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                    Enter your email address and we’ll send you a link to reset your password.
                    Make sure to check your inbox.
                </p>
            </div>

            {/* ================= RIGHT: FORM ================= */}
            <div className="flex items-center px-6">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md md:mr-24 transition-colors duration-300">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Reset Password
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Enter your email to receive a password reset link
                    </p>

                    {error && (
                        <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600
                  bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                  placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-blue-600 text-white py-3 rounded-xl font-semibold
                hover:bg-blue-700 transition-all duration-200 shadow-lg
                flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                        <p>
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
