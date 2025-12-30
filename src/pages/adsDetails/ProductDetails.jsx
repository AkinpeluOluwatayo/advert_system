import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, resetSingleAd } from "../../redux/actions/ProductSlice"; // Added reset
import { MapPin, MessageSquare, CreditCard, ArrowLeft } from "lucide-react";
import { authService } from "../../services/AuthServices";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const reduxAuth = useSelector(state => state.auth);
    const token = reduxAuth.token || authService.getCurrentAuth()?.token;

    const { singleAd, loading, error } = useSelector(state => state.product);

    const [paying, setPaying] = useState(false);

    useEffect(() => {
        if (id) {
            // Trim and ensure the ID is clean before sending to Spring Boot
            const cleanId = id.trim().replace(/[^0-9a-fA-F]/g, "");
            dispatch(fetchSingleAd({ id: cleanId, token }));
        }

        // Cleanup when leaving the page
        return () => {
            dispatch(resetSingleAd());
        };
    }, [dispatch, id, token]);

    const handlePayment = () => {
        if (!window.FlutterwaveCheckout) {
            alert("Payment system not loaded. Please refresh.");
            return;
        }

        setPaying(true);

        window.FlutterwaveCheckout({
            public_key: "FLWPUBK_TEST-ff661d19142b8333ebd1c440ade53f4a-X",
            tx_ref: `tx-${Date.now()}`,
            amount: singleAd?.price,
            currency: "NGN",
            payment_options: "card,ussd,banktransfer",
            customer: {
                email: reduxAuth.user?.email || "test@gmail.com",
                phone_number: reduxAuth.user?.phoneNumber || "08012345678",
                name: reduxAuth.user?.name || "Test User",
            },
            customizations: {
                title: "Advert System",
                description: singleAd?.title,
                logo: singleAd?.images?.[0],
            },
            callback: function (response) {
                console.log("Payment response:", response);
                if (response.status === "successful") {
                    alert("Payment successful!");
                }
                setPaying(false);
            },
            onclose: function () {
                setPaying(false);
            },
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                Go Back
            </button>
        </div>
    );

    if (!singleAd) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <p className="text-gray-400 text-xl mb-4">Advert not found</p>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{singleAd.title}</h1>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
                        {singleAd.images?.[0] ? (
                            <img src={singleAd.images[0]} alt={singleAd.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <p className="text-gray-500">No Image</p>
                            </div>
                        )}
                    </div>

                    {singleAd.images?.length > 1 && (
                        <div className="mt-6 flex gap-4 overflow-x-auto">
                            {singleAd.images.slice(1).map((img, idx) => (
                                <img key={idx} src={img} alt={`${singleAd.title}-${idx + 1}`} className="w-32 h-32 object-cover rounded-2xl hover:scale-105 transition-transform cursor-pointer" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{singleAd.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{singleAd.description}</p>
                    <p className="text-3xl font-bold text-blue-600">₦{singleAd.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin size={18} />
                        <span>{singleAd.location || "Nigeria"}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: <span className="font-semibold text-green-600">{singleAd.status || "Available"}</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        {/* Changed to use singleAd.id which your Java Mapper provides */}
                        <button onClick={() => navigate(`/chat/${singleAd.id || id}`)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow justify-center">
                            <MessageSquare size={20} />
                            Chat with Seller
                        </button>

                        <button onClick={handlePayment} disabled={paying} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition shadow justify-center ${paying ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                            <CreditCard size={20} />
                            {paying ? "Processing..." : "Purchase"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;