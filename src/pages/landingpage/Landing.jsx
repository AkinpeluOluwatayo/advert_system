import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const slides = [
    "Advertise smarter. Reach more buyers.",
    "Buy & Sell faster with trusted users.",
    "Post ads in minutes. Close deals today.",
];

function LandingPage() {
    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, []);


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <h1 className="text-2xl font-extrabold tracking-tight">
                        DealBridge<span className="text-blue-600">Connect</span>
                    </h1>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Account Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                            >
                                Account
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border dark:border-gray-800 overflow-hidden">
                                    <Link
                                        to="/login"
                                        className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ================= SLIDER ================= */}
            <section className="bg-blue-600 py-6 text-white overflow-hidden">
                <div className="relative h-8 flex items-center justify-center">
                    {slides.map((text, index) => (
                        <div
                            key={index}
                            className={`absolute transition-all duration-700 ease-in-out text-lg font-semibold ${
                                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                            }`}
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= HERO ================= */}
            <main className="flex-1">
                <section className="relative flex items-center justify-center text-center px-6 py-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 -z-10" />

                    <div className="max-w-3xl">
                        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Buy & Sell <br />
                            <span className="text-blue-600">Anything, Anywhere</span>
                        </h2>

                        <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
                            A next-generation advertising platform where individuals and businesses
                            connect effortlessly. Post ads, find deals, and grow faster.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/signup"
                                className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/signup"
                                className="px-10 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-blue-600 hover:text-blue-600 transition"
                            >
                                Browse Ads
                            </Link>
                        </div>
                    </div>
                </section>


                <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Post Ads Easily",
                            desc: "Create and publish ads in minutes with smart categories.",
                        },
                        {
                            title: "Trusted Community",
                            desc: "Verified users and admin moderation for safety.",
                        },
                        {
                            title: "Instant Chat",
                            desc: "Chat directly with buyers and sellers in real time.",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="p-10 rounded-3xl bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-blue-600">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </section>
            </main>


            <footer className="border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="text-center text-sm text-gray-500 py-6">
                    © {new Date().getFullYear()} DealBridge. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
