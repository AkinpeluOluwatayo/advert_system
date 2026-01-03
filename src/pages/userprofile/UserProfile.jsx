import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, Edit2, Trash2, Plus, Package, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { getAdsByUser, deleteAd } from "../../redux/actions/AdvertSlice.js";
import { authService } from "../../services/AuthServices.js";
import { motion, AnimatePresence } from "framer-motion";

function UserProfile() {
    const dispatch = useDispatch();
    const reduxAuth = useSelector((state) => state.auth);
    const reduxAds = useSelector((state) => state.ads);

    const token = reduxAuth.token || authService.getCurrentAuth()?.token;
    const user = reduxAuth.user || authService.getCurrentAuth()?.user;

    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);


    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchAds = async () => {
            setLoading(true);
            try {
                await dispatch(getAdsByUser(token)).unwrap();
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [dispatch, token]);


    const userAds = useMemo(() => reduxAds.ads || [], [reduxAds.ads]);

    const handleDelete = async (adId) => {
        if (window.confirm("Are you sure you want to delete this advert?")) {
            setDeletingId(adId);
            try {
                await dispatch(deleteAd({ adId, token })).unwrap();
            } catch (err) {
                alert("Failed to delete the advert.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-950">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-4 sm:px-6 py-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">


                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-800 mb-12 flex flex-col md:flex-row justify-between items-center gap-8"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/50">
                                <User size={48} className="text-blue-500" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-950" title="Online" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">{user?.name || "User"}</h2>
                            <p className="text-blue-400 font-medium">{user?.email}</p>
                            <div className="flex gap-4 mt-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{userAds.length} Adverts</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Verified Seller</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/CreateAdvert"
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Create New Ad
                    </Link>
                </motion.div>


                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Package size={24} className="text-blue-500" /> Your Marketplace Items
                </h3>

                {userAds.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-800"
                    >
                        <Package size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 text-xl font-medium">You haven't posted any adverts yet.</p>
                        <Link to="/CreateAdvert" className="text-blue-500 font-bold mt-2 inline-block hover:underline">Start selling today</Link>
                    </motion.div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {userAds.map((ad) => (
                                <motion.div
                                    layout
                                    key={ad.id || ad._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    className="group bg-gray-900 rounded-[2rem] border border-gray-800 hover:border-blue-600/50 transition-all duration-300 flex flex-col overflow-hidden"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={ad.images?.[0] || "/fallback-image.png"}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={ad.title}
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">
                                            ₦{ad.price?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-bold text-xl mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{ad.title}</h3>
                                        <p className="text-gray-400 mb-6 text-sm line-clamp-2 leading-relaxed flex-1">{ad.description}</p>

                                        <div className="flex gap-3 mt-auto">
                                            <Link
                                                to={`/edit-ad/${ad.id}`}
                                                className="flex-1 bg-gray-800 hover:bg-gray-700 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
                                            >
                                                <Edit2 size={16} className="text-blue-500" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ad.id)}
                                                disabled={deletingId === ad.id}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all disabled:opacity-50"
                                            >
                                                {deletingId === ad.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                                Delete
                                            </button>
                                        </div>

                                        <Link to={`/ProductDetails/${ad.id}`} className="mt-4 flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                            View Public Listing <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;