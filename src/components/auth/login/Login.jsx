import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token, loading, error, isSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (isSuccess && user && token) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                navigate("/dashboard");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, user, token, navigate, dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(resetAuthState());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900">
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

            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Welcome Back 👋</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div className="flex flex-col relative">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12 outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-slate-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-4 text-sm bg-red-100 p-2 rounded">
                            {typeof error === 'string' ? error : "Invalid credentials"}
                        </p>
                    )}

                    <div className="mt-6 text-sm flex gap-2 text-slate-600 dark:text-slate-400">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
                    </div>
                </div>
            </div>

            {/* UPDATED SEGMENT: Removed bg-blue-600 and rounded-l-3xl */}
            <div className="hidden md:flex flex-col justify-center p-12">
                <h3 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">
                    Buy & Sell Anything
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Connect with millions of users worldwide.
                </p>
            </div>
        </div>
    );
}

export default Login;