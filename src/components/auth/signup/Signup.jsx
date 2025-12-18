import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://jsonplaceholder.typicode.com/users",
                formData
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess("Account created successfully.");
                setTimeout(() => navigate("/Dashboard"), 1500);
            } else {
                setError("Something went wrong. Please try again");
            }
        } catch (err) {
            setError("Network connection error. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

            {/* ================= LEFT: TEXT OVERLAY ================= */}
            <div className="hidden md:flex flex-col justify-start px-12 py-16">
                <h3 className="text-4xl font-extrabold leading-tight text-blue-600 dark:text-blue-400">
                    Join the Marketplace <br /> Connect & Grow
                </h3>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                    Create your account to start posting ads, finding great deals,
                    and growing your business effortlessly.
                </p>
            </div>

            {/* ================= RIGHT: SIGNUP FORM ================= */}
            <div className="flex items-center px-6">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md md:mr-24 transition-colors duration-300">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Get Started 👋
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Create your account to join our community
                    </p>

                    {error && (
                        <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>
                    )}
                    {success && (
                        <p className="mt-2 text-green-500 text-sm font-medium">{success}</p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600
                                    bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                                    placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600
                                    bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                                    placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                required
                            />
                        </div>

                        {/* BUTTON WITH SPINNER */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-blue-600 text-white py-3 rounded-xl font-semibold
                                hover:bg-blue-700 transition-all duration-200 shadow-lg
                                flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* LINKS */}
                    <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Login
                            </Link>
                        </p>
                        <p className="mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Forgot password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
