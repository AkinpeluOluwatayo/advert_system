import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, resetAuthState } from "../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { admin, adminToken, loading, error, isSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    // Updated toast state to handle message and type (success/error)
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            setToast({ show: true, message: "Password too short!", type: "error" });
            return;
        }
        dispatch(loginAdmin(formData));
    };

    useEffect(() => {
        // SUCCESS CASE
        if (isSuccess && admin && adminToken) {
            setToast({ show: true, message: "Admin Login Successful", type: "success" });
            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                navigate("/adminPage");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }

        // ERROR CASE
        if (error) {
            // Check if it's a 401 (Wrong credentials) or general error
            const errorMessage = error.toString().includes("401")
                ? "Wrong Admin Credentials"
                : error;

            setToast({ show: true, message: errorMessage, type: "error" });

            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                dispatch(resetAuthState());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, error, admin, adminToken, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-100 dark:bg-slate-900 relative">

            {/* DYNAMIC TOAST */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 20, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className={`fixed top-0 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-white font-bold ${
                            toast.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FORM */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-blue-600" size={28} />
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Portal</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Login as an administrator to manage users and system settings.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Admin Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
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
                                placeholder="Enter admin password"
                                className="px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12 focus:ring-2 focus:ring-blue-600 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-slate-500 hover:text-blue-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 shadow-lg shadow-blue-200"
                        >
                            {loading ? "Authenticating..." : "Login as Admin"}
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:flex flex-col justify-center bg-slate-900 text-white p-12 rounded-l-3xl">
                <h3 className="text-4xl font-extrabold mb-4">Administration Panel</h3>
                <p className="text-lg text-slate-300">
                    Secure access for administrators only. Monitor activity,
                    manage users, ads, reports, and system configurations.
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;