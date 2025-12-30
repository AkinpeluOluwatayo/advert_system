import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, Edit2, Trash2 } from "lucide-react";
import { getAdsByUser } from "../../redux/actions/AdvertSlice";
import { authService } from "../../services/AuthServices.js";

function UserProfile() {
    const location = useLocation();
    const dispatch = useDispatch();

    const reduxAuth = useSelector((state) => state.auth);
    const reduxAds = useSelector((state) => state.ads);

    // Get token from Redux or LocalStorage to survive refresh
    const token = reduxAuth.token || authService.getCurrentAuth()?.token;
    const user = reduxAuth.user || authService.getCurrentAuth()?.user;

    const [userAds, setUserAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user ads logic
    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("User not authenticated.");
            return;
        }

        const fetchAds = async () => {
            setLoading(true);
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

    // Sync Redux ads to local state
    useEffect(() => {
        if (reduxAds.ads) {
            setUserAds(reduxAds.ads);
        }
    }, [reduxAds.ads]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-950">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <User size={48} className="text-blue-500" />
                        <div>
                            <h2 className="text-4xl font-bold">{user?.name || "User"}</h2>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <Link to="/CreateAdvert" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
                        Create Advert
                    </Link>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {userAds.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-xl">No adverts yet.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userAds.map((ad, index) => (
                            <div key={ad.id || index} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-600 transition">
                                <img
                                    src={ad.images?.[0] || "/fallback-image.png"}
                                    className="h-48 w-full object-cover rounded mb-4"
                                    alt={ad.title}
                                />
                                <h3 className="font-bold text-xl mb-2">{ad.title}</h3>
                                <p className="text-gray-300 mb-3 text-sm">{ad.description?.substring(0, 100)}...</p>
                                <p className="font-bold text-green-500 text-xl mb-2">₦{ad.price?.toLocaleString()}</p>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-600 p-2 rounded flex items-center justify-center gap-2"><Edit2 size={16}/> Edit</button>
                                    <button className="flex-1 bg-red-600 p-2 rounded flex items-center justify-center gap-2"><Trash2 size={16}/> Delete</button>
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