import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/actions/ViewAllAdvertSlice";
import { Link } from "react-router-dom";
import { Edit2, Trash2, User } from "lucide-react";

function UserProfile() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth); // logged-in user info

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 text-lg font-medium">{error}</p>
            </div>
        );

    // Filter products by current user
    const userProducts = products.filter((product) => product.userId === user?.id);

    // Example stats (you can enhance with real data)
    const totalAdverts = userProducts.length;
    const totalSales = userProducts.reduce((acc, item) => acc + (item.sales || 6), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* ================= PROFILE HEADER ================= */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <User size={48} className="text-blue-600" />
                        <div>
                            <h2 className="text-4xl font-extrabold">{user?.name || "Profile"}</h2>
                            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <Link
                        to="/CreateAdvert"
                        className="mt-4 md:mt-0 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                        Create New Advert
                    </Link>
                </div>

                {/* ================= STATS ================= */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-blue-600">{totalAdverts}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Total Adverts</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-green-600">{totalSales}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Total Sales</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-purple-600">{user?.followers || 0}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Followers</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-yellow-600">{user?.following || 0}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Following</p>
                    </div>
                </div>

                {/* ================= USER ADVERTS ================= */}
                {userProducts.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        You haven’t posted any adverts yet. Start by creating a new advert!
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition flex flex-col"
                            >
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-56 object-cover rounded-2xl mb-4"
                                />
                                <h3 className="text-xl font-bold text-blue-600 mb-2">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    {product.description.slice(0, 60)}...
                                </p>
                                <span className="text-2xl font-semibold text-green-600">
                                    ₦{product.price.toLocaleString()}
                                </span>

                                {/* Action Buttons */}
                                <div className="mt-4 flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
