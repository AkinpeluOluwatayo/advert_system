import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetAuthState } from "../../../redux/actions/AuthSlice.js";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isSuccess } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "", password: "", address: "", phoneNumber: "", role: "USER",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupUser(formData));
    };

    useEffect(() => {
        if (isSuccess) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetAuthState()); // Safe here: redirecting to login
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
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                    >
                        Account created successfully
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12 rounded-r-3xl">
                <h3 className="text-4xl font-extrabold mb-4">Join the Marketplace</h3>
                <p className="text-lg text-blue-100">Create your account to start posting ads today.</p>
            </div>

            <div className="flex items-center justify-center px-6 py-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white">Create Account 👋</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white" required />

                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full p-4 rounded-xl border dark:bg-slate-700 dark:text-white" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-gray-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white" required />
                        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white" required />

                        <select name="role" onChange={handleChange} className="p-4 rounded-xl border dark:bg-slate-700 dark:text-white">
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <button disabled={loading} className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </form>

                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

                    <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;