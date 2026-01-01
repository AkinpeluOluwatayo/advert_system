import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, User } from "lucide-react";

function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);


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


    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">

                    <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight truncate">
                        DealBridge<span className="text-blue-600">Connect</span>
                    </h1>

                    <div className="flex items-center gap-2 sm:gap-4">

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </button>


                        <button
                            onClick={() => navigate("/UserProfile")}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shadow flex-shrink-0"
                        >
                            <User size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Profile</span>
                        </button>


                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-red-500 text-white text-xs sm:text-sm font-semibold hover:bg-red-600 transition shadow flex-shrink-0"
                        >
                            <LogOut size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24 w-full">

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight">
                    Marketplace Dashboard
                </h2>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 md:mb-16 max-w-2xl leading-relaxed">
                    Browse adverts posted by other users or create your own advert
                    to start selling instantly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

                    <Link
                        to="/ViewAllAds"
                        className="group p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-blue-600">
                            View All Adverts
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                            Discover products and services from verified users.
                            Click any advert to see full details and contact sellers.
                        </p>

                        <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-600 group-hover:translate-x-1 transition">
                            Browse Marketplace →
                        </span>
                    </Link>

                    <Link
                        to="/CreateAdvert"
                        className="group p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                    >
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-green-600">
                            Create Advert
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                            Have something to sell? Create an advert in minutes
                            and reach thousands of buyers instantly.
                        </p>

                        <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-green-600 group-hover:translate-x-1 transition">
                            Post an Advert →
                        </span>
                    </Link>
                </div>
            </main>


            <footer className="relative bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden mt-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-green-500/10 animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Buy • Sell • Advert • Connect
                    </p>

                    <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                        © {new Date().getFullYear()} DealBridge. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;