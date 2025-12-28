import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, Edit2, Trash2 } from "lucide-react";
import { getAdsByUser } from "../../redux/actions/AdvertSlice";

function UserProfile() {
    const location = useLocation();
    const dispatch = useDispatch();

    const reduxAuth = useSelector((state) => state.auth);
    const reduxAds = useSelector((state) => state.ads);

    const [user, setUser] = useState(reduxAuth.user || null);
    const token = reduxAuth.token || null;

    const [userAds, setUserAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set user from Redux state (no login redirect)
    useEffect(() => {
        setUser(reduxAuth.user);
    }, [reduxAuth.user]);

    // Fetch user ads if token exists
    useEffect(() => {
        if (!token) {
            setLoading(false); // Stop loading if no token
            setError("Cannot fetch adverts: user not authenticated.");
            return;
        }

        setLoading(true);
        setError(null);

        const fetchAds = async () => {
            try {
                await dispatch(getAdsByUser(token)).unwrap();
            } catch (err) {
                console.error("Error fetching ads:", err);
                setError("Failed to load adverts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [dispatch, token]);

    // Update local ads when Redux changes
    useEffect(() => {
        if (reduxAds.ads) setUserAds(reduxAds.ads);
        if (reduxAds.error) setError(reduxAds.error);
        setLoading(reduxAds.loading);
    }, [reduxAds.ads, reduxAds.error, reduxAds.loading]);

    // Add newly created ad from navigation state
    useEffect(() => {
        if (location.state?.newAd && !loading) {
            setUserAds((prev) => {
                const adExists = prev.some(ad =>
                    (ad.id && ad.id === location.state.newAd.id) ||
                    (ad._id && ad._id === location.state.newAd._id)
                );
                if (adExists) return prev;
                return [location.state.newAd, ...prev];
            });
            // Clear navigation state
            location.state = {};
        }
    }, [location.state?.newAd, loading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-white mt-4">Loading your adverts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <User size={48} className="text-blue-500" />
                        <div>
                            <h2 className="text-4xl font-bold">{user?.name || "Guest User"}</h2>
                            <p className="text-gray-400">{user?.email || "No email"}</p>
                        </div>
                    </div>

                    <Link
                        to="/CreateAdvert"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                    >
                        Create Advert
                    </Link>
                </div>

                {/* Ads Grid */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {userAds.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-xl mb-4">No adverts yet.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userAds.map((ad, index) => (
                            <div
                                key={ad.id || ad._id || index}
                                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-600 transition"
                            >
                                {ad.images?.[0] ? (
                                    <img
                                        src={ad.images[0]}
                                        alt={ad.title || 'Product'}
                                        onError={(e) => e.target.src = "/fallback-image.png"}
                                        className="h-48 w-full object-cover rounded mb-4"
                                    />
                                ) : (
                                    <div className="h-48 w-full bg-gray-800 rounded mb-4 flex items-center justify-center">
                                        <p className="text-gray-500">No Image</p>
                                    </div>
                                )}

                                <h3 className="font-bold text-xl mb-2">{ad.title || 'Untitled'}</h3>

                                <p className="text-gray-300 mb-3">
                                    {ad.description ?
                                        `${ad.description.slice(0, 60)}${ad.description.length > 60 ? '...' : ''}`
                                        : 'No description'}
                                </p>

                                <p className="font-bold text-green-500 text-xl mb-2">
                                    ₦{ad.price ? ad.price.toLocaleString() : '0'}
                                </p>

                                <p className="text-gray-400 text-sm mb-4">
                                    📍 {ad.location || 'Location not specified'}
                                </p>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition">
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
