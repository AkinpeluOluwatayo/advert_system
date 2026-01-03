import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, X, ShieldCheck, CheckCircle } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token, loading, error, isSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // 👈 NEW

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
                navigate("/ViewAllAds");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, user, token, navigate, dispatch]);

    useEffect(() => {
        if (error) {

            let friendlyMessage = error;

            if (error.toString().includes("401")) {
                friendlyMessage = "Wrong email or password. Please try again.";
            } else if (error.toString().includes("404")) {
                friendlyMessage = "Account not found. Please check your email.";
            } else if (error.toString().includes("403")) {
                friendlyMessage = "Your account has been blocked. Contact support.";
            } else if (error.toString().includes("500")) {
                friendlyMessage = "Server error. Please try again later.";
            } else if (error.toString().includes("Network Error")) {
                friendlyMessage = "No internet connection. Check your network.";
            }

            setErrorMessage(friendlyMessage);
            setErrorToast(true);

            const timer = setTimeout(() => {
                setErrorToast(false);
                dispatch(resetAuthState());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 font-sans relative">


            <div className="absolute top-4 right-4 z-[60]">
                <Link to="/adminauth">
                    <motion.div
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full cursor-pointer hover:border-blue-600 hover:shadow-lg transition-all shadow-sm"
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-amber-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ShieldCheck size={12} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 group-hover:text-blue-600 font-sans uppercase">
                            Admin Portal
                        </span>
                    </motion.div>
                </Link>
            </div>


            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-xl shadow-2xl z-[70] flex items-center gap-3 font-bold"
                    >
                        <CheckCircle size={20} />
                        Login Successful
                    </motion.div>
                )}

                {errorToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-xl shadow-2xl z-[70] flex items-center gap-3 font-bold max-w-md"
                    >
                        <AlertCircle size={20} />
                        <span>{errorMessage}</span> {/* 👈 CHANGED */}
                        <button onClick={() => setErrorToast(false)} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="flex items-center justify-center px-6 py-12 relative">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Welcome Back 👋</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Email Address</label>
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
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Password</label>
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end -mt-2">
                            <Link
                                to="/forgotpassword"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50 mt-2 shadow-lg shadow-blue-100 dark:shadow-none"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm flex justify-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col justify-center p-16 bg-white dark:bg-slate-900">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-6xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">
                        Buy & Sell <br /><span className="text-blue-600">Anything.</span>
                    </h3>
                    <div className="w-20 h-1.5 bg-blue-600 mb-8 rounded-full"></div>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-light">
                        Connect with millions of users worldwide and find what you need today.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;