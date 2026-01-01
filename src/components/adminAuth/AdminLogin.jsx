import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin, resetAuthState } from "../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle, User } from "lucide-react";

function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { admin, adminToken, loading, error, isSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
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
        if (isSuccess && admin && adminToken) {
            setToast({ show: true, message: "Admin Login Successful", type: "success" });
            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                navigate("/adminPage");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (error) {
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
            <div className="absolute top-4 right-4 z-[60]">
                <Link to="/login">
                    <motion.div
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full cursor-pointer hover:border-blue-600 hover:shadow-lg transition-all shadow-sm"
                    >
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-slate-900 transition-colors">
                            <User size={12} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 group-hover:text-blue-600 font-sans uppercase">
                            USER PORTAL
                        </span>
                    </motion.div>
                </Link>
            </div>

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

            <div className="flex items-center justify-center px-6 py-12 relative overflow-hidden">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-blue-600" size={28} />
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Portal</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-sans">
                        Secure access for administrators to manage system protocols.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Admin Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                required
                            />
                        </div>

                        <div className="flex flex-col relative">
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Master Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-12 focus:ring-2 focus:ring-blue-600 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-10 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition active:scale-[0.98] disabled:bg-blue-400 shadow-lg shadow-blue-100 dark:shadow-none mt-2"
                        >
                            {loading ? "Authenticating..." : "Login as Admin"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="hidden md:flex flex-col justify-center bg-slate-900 text-white p-16 rounded-l-[3rem] shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-5xl font-extrabold mb-6 leading-tight">System <br/>Administration</h3>
                    <div className="w-20 h-1 bg-blue-600 mb-8 rounded-full"></div>
                    <p className="text-xl text-slate-400 font-light leading-relaxed max-w-sm">
                        High-level access to library protocols, user registries,
                        and inventory distribution cycles.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminLogin;