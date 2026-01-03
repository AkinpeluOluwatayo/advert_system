import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin, resetAuthState } from "../../redux/actions/AuthSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle, User, Loader2, ArrowRight } from "lucide-react";

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
            setToast({ show: true, message: "Security Protocol: Password too short", type: "error" });
            return;
        }
        dispatch(loginAdmin(formData));
    };

    useEffect(() => {
        if (isSuccess && admin && adminToken) {
            setToast({ show: true, message: "Authorized: Admin Login Successful", type: "success" });
            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                navigate("/adminPage");
                dispatch(resetAuthState());
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (error) {
            const errorMessage = error.toString().includes("401")
                ? "Invalid Admin Credentials"
                : "System Error: Unable to authenticate";

            setToast({ show: true, message: errorMessage, type: "error" });

            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                dispatch(resetAuthState());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, error, admin, adminToken, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">


            <div className="absolute top-6 right-6 z-[60]">
                <Link to="/login">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500 shadow-xl transition-all"
                    >
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                            <User size={16} />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 group-hover:text-blue-500 uppercase">
                            User Portal
                        </span>
                    </motion.div>
                </Link>
            </div>


            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 30, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-0 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-[2rem] shadow-2xl z-[100] flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs border-2 ${
                            toast.type === "success"
                                ? "bg-green-600 border-green-400"
                                : "bg-red-600 border-red-400"
                        }`}
                    >
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="flex items-center justify-center px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-800"
                >
                    <div className="mb-8">
                        <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] mb-6">
                            <ShieldCheck className="text-blue-600" size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Admin Login</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Restricted high-level access portal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Admin Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@admin.protocol"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Master Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white pr-14 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-500/20 dark:shadow-none mt-4 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Authenticate Access <ArrowRight size={18}/></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>


            <div className="hidden md:flex flex-col justify-center bg-slate-900 text-white p-20 relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs mb-4 block">System Core v4.0</span>
                    <h3 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                        Management <br/><span className="text-blue-600 font-outline-2">Interface.</span>
                    </h3>
                    <div className="w-24 h-2 bg-blue-600 mb-10 rounded-full"></div>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md italic">
                        "Oversee marketplace operations, manage user verification tiers, and monitor real-time transaction protocols."
                    </p>
                </motion.div>

                <div className="absolute bottom-12 left-20 flex gap-12 opacity-30">
                    <div className="flex flex-col"><span className="text-3xl font-black">99.9%</span><span className="text-[10px] uppercase font-bold tracking-widest">Uptime</span></div>
                    <div className="flex flex-col"><span className="text-3xl font-black">256-bit</span><span className="text-[10px] uppercase font-bold tracking-widest">Encryption</span></div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;