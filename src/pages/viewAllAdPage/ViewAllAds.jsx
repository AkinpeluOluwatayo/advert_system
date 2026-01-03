import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAds } from "../../redux/actions/AdvertSlice";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Filter, ChevronLeft, Sun, Moon, LogOut, User, Search, RefreshCw, Tag } from "lucide-react";

function ViewAllAdverts() {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { ads = [], loading, error } = useSelector(state => state.ads);

    const [darkMode, setDarkMode] = useState(false);
    const [showFilters, setShowFilters] = useState(true);


    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        minPrice: "",
        maxPrice: "",
    });


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
        dispatch(getAllAds());
    }, [dispatch]);

    const toggleDarkMode = () => {
        const isDark = !darkMode;
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setDarkMode(isDark);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        dispatch(getAllAds(filters));
    };

    const handleClearFilters = () => {
        const cleared = { keyword: "", location: "", minPrice: "", maxPrice: "" };
        setFilters(cleared);
        dispatch(getAllAds(cleared));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans">


            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <Link to="/" className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white shrink-0">
                        DealBridge<span className="text-blue-600">Connect</span>
                    </Link>


                    <div className="hidden md:flex relative flex-1 max-w-md mx-4">
                        <input
                            type="text"
                            name="keyword"
                            placeholder="Quick search..."
                            value={filters.keyword}
                            onChange={handleFilterChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/CreateAdvert" className="hidden sm:block px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm active:scale-95">
                            + Create
                        </Link>
                        <button onClick={() => navigate("/UserProfile")} className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow active:scale-95">
                            <User size={20} />
                        </button>
                        <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow active:scale-95">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">


                <aside className="lg:w-72 shrink-0">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                                <Filter size={18} className="text-blue-600" /> Filters
                            </h2>
                            <button onClick={handleClearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-700">Reset</button>
                        </div>

                        <form onSubmit={handleApplyFilters} className="space-y-5">

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Keyword</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="keyword"
                                        value={filters.keyword}
                                        onChange={handleFilterChange}
                                        placeholder="What are you looking for?"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm transition"
                                    />
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City or State"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm transition"
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Min ₦</label>
                                    <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" className="w-full px-3 py-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Max ₦</label>
                                    <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" className="w-full px-3 py-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 dark:shadow-none active:scale-[0.97]">
                                Apply Filters
                            </button>
                        </form>
                    </div>
                </aside>


                <main className="flex-1">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium animate-pulse">Finding the best deals...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 p-8 rounded-3xl text-center">
                            <p className="text-red-500 font-bold mb-4">{error}</p>
                            <button onClick={() => dispatch(getAllAds())} className="px-6 py-2 bg-red-600 text-white rounded-xl">Try Again</button>
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="text-center py-32">
                            <Search className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 text-xl font-medium">No results found.</p>
                            <button onClick={handleClearFilters} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {ads.map((ad, index) => (
                                <Link
                                    to={`/ProductDetails/${ad.id || ad._id}`}
                                    key={ad.id || ad._id || index}
                                    className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
                                >

                                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {ad.images?.[0] ? (
                                            <img
                                                src={ad.images[0]}
                                                alt={ad.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">No Image</div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            ₦{ad.price?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-md font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition truncate mb-1">{ad.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{ad.description}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t dark:border-gray-800">
                                            <div className="flex items-center text-xs text-gray-400 font-medium">
                                                <MapPin size={14} className="mr-1 text-blue-600" />{ad.location || "Nigeria"}
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Details &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ViewAllAdverts;