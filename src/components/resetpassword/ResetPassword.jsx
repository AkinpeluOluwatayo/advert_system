import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordUser, resetAuthState } from "../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = searchParams.get("token");

    const { loading, error, isSuccess } = useSelector((state) => state.auth);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPasswordUser({ token, newPassword: password }));
    };

    useEffect(() => {
        if (isSuccess) {
            setToast(true);
            const timer = setTimeout(() => {
                setToast(false);
                dispatch(resetAuthState());
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-6 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2"
                    >
                        <CheckCircle size={20} />
                        Password reset successful! Redirecting to login...
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">New Password</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                    Enter a new secure password for your account.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col relative">
                        <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading || !token}
                        className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                {!token && (
                    <p className="mt-4 text-amber-600 text-xs text-center font-medium italic">
                        Invalid or missing token. Please request a new link.
                    </p>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;