import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/actions/ViewAllAdvertSlice";
import { Link } from "react-router-dom";
import { MapPin, ChevronLeft, ChevronRight, Filter } from "lucide-react";

function ViewAllAdverts() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [filters, setFilters] = useState({
        name: "",
        location: "",
        priceMin: "",
        priceMax: "",
    });
    const [showFilters, setShowFilters] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredProducts = products.filter((product) => {
        const matchesName = product.title
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const matchesLocation = product.brand
            ?.toLowerCase()
            .includes(filters.location.toLowerCase());
        const matchesPriceMin =
            filters.priceMin === "" || product.price >= Number(filters.priceMin);
        const matchesPriceMax =
            filters.priceMax === "" || product.price <= Number(filters.priceMax);
        const matchesSearch =
            searchQuery === "" ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return (
            matchesName &&
            matchesLocation &&
            matchesPriceMin &&
            matchesPriceMax &&
            matchesSearch
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* ================= NAVBAR ================= */}
            <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        All <span className="text-blue-600">Adverts</span>
                    </h1>

                    <input
                        type="text"
                        placeholder="Search adverts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition w-full md:w-64"
                    />

                    <Link
                        to="/create-ad"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow text-center"
                    >
                        Create Advert
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 relative">
                {/* ================= FILTER SIDEBAR ================= */}
                <aside className="relative flex-shrink-0">
                    {/* Persistent Toggle Button */}
                    <button
                        className="absolute -right-5 top-10 md:top-0 md:right-0 flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-20"
                        onClick={() => setShowFilters(!showFilters)}
                        title="Toggle Filters"
                    >
                        {showFilters ? <ChevronLeft size={20} /> : <Filter size={20} />}
                    </button>

                    {/* Filter panel */}
                    <div
                        className={`bg-white dark:bg-gray-900 p-6 rounded-3xl shadow transition-all duration-300 overflow-hidden ${
                            showFilters
                                ? "w-64 opacity-100"
                                : "w-0 opacity-0 p-0 md:p-0"
                        }`}
                    >
                        {showFilters && (
                            <div className="space-y-6">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                    Filters
                                </h2>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        placeholder="Search by name"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="Enter location"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 mb-2">
                                        Price Min
                                    </label>
                                    <input
                                        type="number"
                                        name="priceMin"
                                        value={filters.priceMin}
                                        onChange={handleFilterChange}
                                        placeholder="₦0"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 mb-2">
                                        Price Max
                                    </label>
                                    <input
                                        type="number"
                                        name="priceMax"
                                        value={filters.priceMax}
                                        onChange={handleFilterChange}
                                        placeholder="₦100,000"
                                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ================= ADVERT CARDS ================= */}
                <main className="flex-1">
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-red-500 font-medium">{error}</p>
                    )}

                    {!loading && !error && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border dark:border-gray-800"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                                            {product.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            <MapPin size={16} className="mr-1" />
                                            {product.brand || "Nigeria"}
                                        </div>

                                        <Link
                                            to={`/ProductDetails/${product.id}`}
                                            className="block text-center px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-800 text-white font-semibold hover:bg-blue-600 transition"
                                        >
                                            View Details
                                        </Link>
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
