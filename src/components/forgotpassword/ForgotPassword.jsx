import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordUser, resetAuthState } from "../../redux/actions/AuthSlice.js";

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
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                    >
                        ✅ Link sent! Check your console/email.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md transition-colors duration-300">
                <h2 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">Reset Password</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                    Enter your email address and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4 text-sm">⚠️ {error}</p>}

                <div className="mt-6 text-sm flex gap-2 justify-center items-center">
                    <span className="text-slate-500">Remembered?</span>
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;