import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token, loading, error, isSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    // Handle Success
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

    // Handle Error Toast
    useEffect(() => {
        if (error) {
            setErrorToast(true);
            const timer = setTimeout(() => {
                setErrorToast(false);
                dispatch(resetAuthState());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 font-sans">
            {/* --- TOASTS --- */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                    >
                        Login Successful
                    </motion.div>
                )}

                {errorToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2"
                    >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                        <button onClick={() => setErrorToast(false)} className="ml-2">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Welcome Back 👋</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col relative">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* --- FORGOT PASSWORD LINK --- */}
                        <div className="flex justify-end -mt-2">
                            <Link
                                to="/forgotpassword"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:no-underline transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50 mt-2"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm flex justify-center gap-2 text-slate-600 dark:text-slate-400">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-blue-600 font-bold hover:no-underline">Sign Up</Link>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col justify-center p-12 bg-white dark:bg-slate-900">
                <h3 className="text-5xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">
                    Buy & Sell <br /><span className="text-blue-600">Anything.</span>
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm">
                    Connect with millions of users worldwide and find what you need today.
                </p>
            </div>
        </div>
    );
}

export default Login;