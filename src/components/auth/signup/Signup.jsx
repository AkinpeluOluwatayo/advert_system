import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Mail, Lock, MapPin, Phone } from "lucide-react";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isSuccess } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        roles: "USER",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        if (validationError) setValidationError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.password.length < 8) {
            setValidationError("Password must be at least 8 characters long.");
            return false;
        }
        if (formData.phoneNumber.length < 10) {
            setValidationError("Please enter a valid phone number.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(signupUser(formData));
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetAuthState());
                navigate("/login");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 font-sans selection:bg-blue-100">


            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 font-bold"
                    >
                        <CheckCircle size={18} /> Account created successfully!
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account 👋</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Join thousands of traders today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                                required
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>


                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 pr-12 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                                required
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>


                        <div className="relative">
                            <input
                                type="text"
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                                required
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>

                        {/* Phone Input */}
                        <div className="relative">
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                                required
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>


                        {(validationError || error) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20"
                            >
                                <AlertCircle size={16} /> {validationError || error}
                            </motion.div>
                        )}


                        <button
                            disabled={loading}
                            className="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/20 dark:shadow-none min-h-[60px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Securing Account...</span>
                                </>
                            ) : "Register Now"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Already a member?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>


            <div className="hidden md:flex flex-col justify-center p-16 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-6xl font-black mb-4 leading-tight text-slate-900 dark:text-white">
                        The Future <br /><span className="text-blue-600">of Trading.</span>
                    </h3>
                    <div className="w-20 h-1.5 bg-blue-600 mb-8 rounded-full"></div>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-light italic">
                        "Experience the most secure and fastest way to trade with verified users across the nation."
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Signup;