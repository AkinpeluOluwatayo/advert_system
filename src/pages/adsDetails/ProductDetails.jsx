import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, resetSingleAd } from "../../redux/actions/ProductSlice";
import { MapPin, MessageSquare, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
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
        // Ensure id exists and isn't the literal string "undefined"
        if (id && id !== "undefined") {
            dispatch(fetchSingleAd({ id, token }));
        }

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
                logo: singleAd?.images?.[0] || "",
            },
            callback: function (response) {
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
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-6 text-center">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl max-w-md border border-red-100">
                <p className="text-red-500 text-lg font-bold mb-4">Failed to Load Product</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!singleAd) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <p className="text-gray-400 text-xl mb-4">Advert not found</p>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">
                        {singleAd.title}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border dark:border-gray-700">
                        {singleAd.images?.[0] ? (
                            <img src={singleAd.images[0]} alt={singleAd.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{singleAd.title}</h2>
                        <p className="text-3xl font-black text-blue-600 mt-2">₦{singleAd.price?.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin size={20} className="text-blue-500" />
                        <span className="text-lg">{singleAd.location || "Nigeria"}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h4 className="font-bold mb-2 uppercase text-xs tracking-widest text-blue-600">Product Description</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{singleAd.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => navigate(`/chat/${singleAd.id}`)}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition shadow-xl"
                        >
                            <MessageSquare size={20} />
                            Chat with Seller
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={paying}
                            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition shadow-xl ${
                                paying ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            <CreditCard size={20} />
                            {paying ? "Processing..." : "Buy Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;