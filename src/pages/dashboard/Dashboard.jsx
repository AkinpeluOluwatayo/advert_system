import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";

function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    // Load dark mode preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDarkMode(!darkMode);
    };

    // Logout
    const handleLogout = () => {
        // later: clear redux user state / token
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Ad<span className="text-blue-600">Connect</span>
                    </h1>

                    <div className="flex items-center gap-5">
                        {/* Dark Mode */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-24">
                {/* Page Intro */}
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Marketplace Dashboard
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-16 max-w-2xl">
                    Browse adverts posted by other users or create your own advert
                    to start selling instantly.
                </p>

                {/* ACTION SECTIONS */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* VIEW ADVERTS */}
                    <Link
                        to="/ViewAllAds"
                        className="group p-12 rounded-3xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-xl hover:shadow-2xl transition"
                    >
                        <h3 className="text-3xl font-bold mb-4 text-blue-600">
                            View All Adverts
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Discover products and services from verified users.
                            Click any advert to see full details and contact sellers.
                        </p>

                        <span className="inline-block font-semibold text-blue-600 group-hover:translate-x-1 transition">
                            Browse Marketplace →
                        </span>
                    </Link>

                    {/* CREATE ADVERT */}
                    <Link
                        to="/create-ad"
                        className="group p-12 rounded-3xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-xl hover:shadow-2xl transition"
                    >
                        <h3 className="text-3xl font-bold mb-4 text-green-600">
                            Create Advert
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Have something to sell? Create an advert in minutes
                            and reach thousands of buyers instantly.
                        </p>

                        <span className="inline-block font-semibold text-green-600 group-hover:translate-x-1 transition">
                            Post an Advert →
                        </span>
                    </Link>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="relative bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden">
                {/* subtle animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-green-500/10 animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Buy • Sell • Advert • Connect
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                        © {new Date().getFullYear()} AdConnect. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;
