import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { Eye, EyeOff, User, Shield, AlertCircle } from "lucide-react";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isSuccess } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        role: "USER",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        setValidationError(""); // Clear error when user starts typing
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (newRole) => setFormData({ ...formData, role: newRole });

    // --- VALIDATION LOGIC ---
    const validateForm = () => {
        if (formData.password.length < 8) {
            setValidationError("Password must be at least 8 characters long.");
            return false;
        }
        if (formData.phoneNumber.length < 10) {
            setValidationError("Please enter a valid phone number (min 10 digits).");
            return false;
        }
        if (formData.address.trim().length < 5) {
            setValidationError("Please enter a more detailed address.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Run validation before dispatching to Redux
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
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900">
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2"
                    >
                        <User size={18} /> Account created successfully
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FORM SECTION */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Create Account 👋</h2>
                        <p className="text-sm text-slate-500">Enter your details to join the marketplace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all border-gray-200 dark:border-slate-600"
                            required
                        />

                        {/* Password with Eye Toggle and MinLength attribute */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password (min 8 characters)"
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all border-gray-200 dark:border-slate-600"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-500 hover:text-blue-600 transition-colors">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Address */}
                        <input
                            type="text"
                            name="address"
                            placeholder="Full Address"
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all border-gray-200 dark:border-slate-600"
                            required
                        />

                        {/* Phone Number */}
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all border-gray-200 dark:border-slate-600"
                            required
                        />

                        {/* ROLE SELECTION */}
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Register As</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("USER")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                                        formData.role === "USER"
                                            ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                            : "border-gray-100 dark:border-slate-700 text-slate-400"
                                    }`}
                                >
                                    <User size={18} />
                                    <span className="font-semibold text-sm">User</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("ADMIN")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                                        formData.role === "ADMIN"
                                            ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                            : "border-gray-100 dark:border-slate-700 text-slate-400"
                                    }`}
                                >
                                    <Shield size={18} />
                                    <span className="font-semibold text-sm">Admin</span>
                                </button>
                            </div>
                        </div>

                        {/* ERROR DISPLAY */}
                        {(validationError || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30"
                            >
                                <AlertCircle size={16} />
                                <span>{validationError || error}</span>
                            </motion.div>
                        )}

                        <button
                            disabled={loading}
                            className="mt-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE TEXT SECTION */}
            <div className="hidden md:flex flex-col justify-center p-12 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-5xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">
                        Join the <br /><span className="text-blue-600">Marketplace.</span>
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm">
                        Create your account to start posting ads and connecting with buyers today.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Signup;