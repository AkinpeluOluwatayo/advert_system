import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { Eye, EyeOff, User, Shield, AlertCircle, CheckCircle } from "lucide-react";

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
        setValidationError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (newRole) => setFormData({ ...formData, roles: newRole });

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
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, dispatch]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900">
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                                className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
                        <CheckCircle size={18} /> Account created successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                    <h2 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Create Account 👋</h2>
                    <p className="text-sm text-slate-500 mb-8">Enter your details to join.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <input
                            type="text"
                            name="address"
                            placeholder="Full Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                            required
                        />

                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 border-gray-200 dark:border-slate-600 transition-all"
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Register As</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("USER")}
                                    className={`py-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                                        formData.roles === "USER" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-slate-400"
                                    }`}
                                >User</button>
                                <button
                                    type="button"
                                    onClick={() => setRole("ADMIN")}
                                    className={`py-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                                        formData.roles === "ADMIN" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-slate-400"
                                    }`}
                                >Admin</button>
                            </div>
                        </div>

                        {(validationError || error) && (
                            <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-100">
                                <AlertCircle size={16} /> {validationError || error}
                            </div>
                        )}

                        <button disabled={loading} className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100">
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* NEW: ADDED LOGIN LINK BELOW THE FORM */}
                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-bold hover:no-underline transition-all"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col justify-center p-12 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 text-slate-900 dark:text-white">
                <h3 className="text-5xl font-extrabold mb-4 leading-tight">Join the <br /><span className="text-blue-600">Marketplace.</span></h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">Secure registration for all users.</p>
            </div>
        </div>
    );
}

export default Signup;