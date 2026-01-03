import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordUser, resetAuthState } from "../../redux/actions/AuthSlice.js";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isSuccess } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPasswordUser(email));
    };

    useEffect(() => {
        if (isSuccess) {
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetAuthState());
                navigate("/login");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 font-sans">


            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 font-bold text-center"
                    >
                        <CheckCircle size={20} />
                        <span>Link sent! Check your inbox.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700 transition-all">


                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 text-sm font-semibold group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reset Password</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                        No worries! Enter your email below and we'll send you a secure link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <label className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-4 pl-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                                required
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-none min-h-[58px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Sending...</span>
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-500 text-sm flex items-center gap-2"
                    >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Still having trouble? <Link to="/aboutus" className="text-blue-600 font-bold hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;