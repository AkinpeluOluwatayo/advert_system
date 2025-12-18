import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../redux/actions/UserLoginSlice.js";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (user) {
            setTimeout(() => navigate("/Dashboard"), 1500);
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

            {/* ================= LEFT: LOGIN FORM ================= */}
            <div className="flex items-center px-6">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl w-full max-w-md md:ml-24">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Welcome Back 👋
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Login to continue managing your account
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* EMAIL */}
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
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* FEEDBACK */}
                    {error && (
                        <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>
                    )}
                    {user && (
                        <p className="mt-4 text-green-500 text-sm font-medium">
                            Login successful 🎉
                        </p>
                    )}

                    {/* LINKS */}
                    <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                        <p>
                            Don’t have an account?{" "}
                            <a
                                href="/signup"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Sign Up
                            </a>
                        </p>
                        <p className="mt-2">
                            <a
                                href="/forgot-password"
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Forgot password?
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT: IMAGE / VISUAL ================= */}
            <div className="hidden md:block relative">
                {/*<img*/}
                {/*    src="/images/loginimage.png"*/}
                {/*    alt="Buy and Sell Marketplace"*/}
                {/*    className="absolute inset-0 w-full h-full object-cover"*/}
                {/*/>*/}

                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900/70 dark:bg-slate-900/80"></div>

                {/* HIGHER TOP-ALIGNED TEXT OVERLAY */}
                <div className="absolute top-49 left-0 z-10 px-14 text-white max-w-xl">
                    <h3 className="text-4xl font-extrabold leading-tight">
                        Buy & Sell <br /> Anything, Anywhere
                    </h3>
                    <p className="mt-6 text-lg text-blue-100">
                        Join a trusted marketplace where millions connect to buy,
                        sell, and grow their businesses effortlessly.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
