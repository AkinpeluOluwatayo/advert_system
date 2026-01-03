import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAds } from "../../redux/actions/AdvertSlice";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Filter, ChevronLeft, Sun, Moon, LogOut, User } from "lucide-react";

function ViewAllAdverts() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { ads = [], loading: reduxLoading, error: reduxError } = useSelector(state => state.ads);


    const [darkMode, setDarkMode] = useState(false);

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


    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        minPrice: "",
        maxPrice: "",
    });
    const [showFilters, setShowFilters] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            setError(null);
            try {
                await dispatch(getAllAds()).unwrap();
            } catch (err) {
                console.error("Error fetching ads:", err);
                setError("Failed to load adverts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [dispatch]);

    useEffect(() => {
        setLoading(reduxLoading);
        setError(reduxError);
    }, [reduxLoading, reduxError]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyFilters = () => {
        const filterParams = {
            keyword: searchQuery || filters.keyword,
            location: filters.location,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
        };
        dispatch(getAllAds(filterParams));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleApplyFilters();
    };

    const handleClearFilters = () => {
        setFilters({ keyword: "", location: "", minPrice: "", maxPrice: "" });
        setSearchQuery("");
        dispatch(getAllAds());
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">


            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                            DealBridge<span className="text-blue-600">Connect</span>
                        </h1>


                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition md:hidden"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search adverts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition w-full"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex items-center gap-2 sm:gap-3">

                        <button
                            onClick={toggleDarkMode}
                            className="hidden md:flex p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <Link
                            to="/CreateAdvert"
                            className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-700 transition shadow"
                        >
                            + Create
                        </Link>

                        <button
                            onClick={() => navigate("/UserProfile")}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shadow"
                        >
                            <User size={14} />
                            <span className="hidden xs:inline">Profile</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-500 text-white text-xs sm:text-sm font-semibold hover:bg-red-600 transition shadow"
                        >
                            <LogOut size={14} />
                            <span className="hidden xs:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8 relative">


                <aside className="relative flex-shrink-0">
                    <button
                        className="absolute -right-5 top-0 flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-20"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? <ChevronLeft size={20} /> : <Filter size={20} />}
                    </button>

                    <div
                        className={`bg-white dark:bg-gray-900 p-6 rounded-3xl shadow transition-all duration-300 overflow-hidden ${
                            showFilters ? "w-64 opacity-100" : "w-0 opacity-0 p-0"
                        }`}
                    >
                        {showFilters && (
                            <div className="space-y-6">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Filters</h2>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City or State"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Min</label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="₦ Min"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Max</label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="₦ Max"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button onClick={handleApplyFilters} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Apply</button>
                                    <button onClick={handleClearFilters} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition">Clear</button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>


                <main className="flex-1">
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-red-500 font-medium">{error}</p>
                    )}

                    {!loading && !error && ads.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-xl mb-4">No adverts found.</p>
                            <Link to="/CreateAdvert" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Create First Advert</Link>
                        </div>
                    )}

                    {!loading && !error && ads.length > 0 && (
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {ads.map((ad, index) => (
                                <div key={ad.id || ad._id || index} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border dark:border-gray-800">
                                    <div className="relative h-52 overflow-hidden">
                                        {ad.images?.[0] ? (
                                            <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                                        )}
                                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                                            ₦{ad.price?.toLocaleString() || '0'}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition truncate">{ad.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{ad.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            <MapPin size={16} className="mr-1" />{ad.location || "Nigeria"}
                                        </div>
                                        <Link to={`/ProductDetails/${ad.id}`} className="block text-center px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-800 text-white font-semibold hover:bg-blue-600 transition">View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ViewAllAdverts;