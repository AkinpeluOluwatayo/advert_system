import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error, isSuccess } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (isSuccess) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                navigate("/dashboard");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900">
            {/* TOAST */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                    >
                        Login Successful
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT: FORM */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md transition-colors duration-300">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Welcome Back 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Login to your account to manage your ads, profile, and enjoy all features.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                required
                            />
                        </div>

                        {/* Password with toggle */}
                        <div className="flex flex-col relative">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-slate-500 dark:text-slate-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {error && <p className="text-red-500 mt-4">{error}</p>}

                    {/* Footer links in white */}
                    <div className="mt-6 text-sm flex flex-wrap items-center gap-2 text-white">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="font-semibold hover:no-underline">
                            Sign Up
                        </Link>
                        <span>|</span>
                        <Link to="/forgot-password" className="font-semibold hover:no-underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>

            {/* RIGHT: Marketing / Text */}
            <div className="hidden md:flex flex-col justify-center bg-blue-600 dark:bg-slate-900 text-white p-12 rounded-l-3xl">
                <h3 className="text-4xl font-extrabold mb-4">Buy & Sell Anything</h3>
                <p className="text-lg text-blue-100 dark:text-slate-300">
                    Join our marketplace and connect with millions of users worldwide.
                    Manage your account, post ads, and grow your business effortlessly.
                </p>
            </div>
        </div>
    );
}

export default Login;
