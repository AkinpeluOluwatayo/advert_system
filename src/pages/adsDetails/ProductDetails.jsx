import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, resetSingleAd } from "../../redux/actions/ProductSlice";
import { createChat } from "../../redux/actions/ChatSlice";
import { MapPin, MessageSquare, CreditCard, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token } = useSelector(state => state.auth);
    const { singleAd, loading, error } = useSelector(state => state.product);

    const currentUserId = user?.id || user?._id;
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const cleanId = id?.split(':')[0].trim();
        if (cleanId && cleanId !== "undefined") {
            dispatch(fetchSingleAd({ id: cleanId, token }));
        }
        return () => dispatch(resetSingleAd());
    }, [dispatch, id, token]);

    const handleStartChat = async () => {
        if (!currentUserId) {
            alert("Please login to message the seller");
            navigate("/login");
            return;
        }

        if (currentUserId === singleAd.sellerId) {
            alert("This is your own advertisement!");
            return;
        }

        const chatRequest = {
            sellerId: singleAd.sellerId,
            buyerId: currentUserId,
            adId: singleAd.id || singleAd._id
        };

        try {

            const result = await dispatch(createChat({ chatRequest, userId: currentUserId })).unwrap();

            const newChatId = result.data?.id || result.id;
            navigate(`/chat/${newChatId}`);

        } catch (err) {
            console.error("Chat initiation failed:", err);

            navigate(`/chat`);
        }
    };

    const handlePayment = () => {
        if (!window.FlutterwaveCheckout) {
            alert("Payment system not loaded.");
            return;
        }
        setPaying(true);
        window.FlutterwaveCheckout({
            public_key: "FLWPUBK_TEST-ff661d19142b8333ebd1c440ade53f4a-X",
            tx_ref: `tx-${Date.now()}`,
            amount: singleAd?.price,
            currency: "NGN",
            customer: {
                email: user?.email || "customer@mail.com",
                name: user?.name || "User",
            },
            callback: (response) => {
                if (response.status === "successful") alert("Success!");
                setPaying(false);
            },
            onclose: () => setPaying(false),
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-950">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
    );

    if (error || !singleAd) return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-white dark:bg-gray-950">
            <AlertCircle size={40} className="text-red-500 mb-4" />
            <p className="text-gray-500">{error || "Product not found"}</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-12">

            <div className="border-b dark:border-gray-800 sticky top-0 bg-gray-900 z-30 shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <span className="text-sm font-semibold text-white uppercase tracking-widest">Details</span>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">


                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-800">
                        <img
                            src={singleAd.images?.[0] || "https://via.placeholder.com/500"}
                            alt={singleAd.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                {singleAd.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <MapPin size={16} className="text-blue-500" />
                                <span>{singleAd.location || "Nigeria"}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-3xl font-black text-gray-900 dark:text-white">
                                ₦{singleAd.price?.toLocaleString()}
                            </p>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-bold uppercase">
                                <ShieldCheck size={14} /> Verified Ad
                            </div>
                        </div>

                        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {singleAd.description}
                            </p>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-3">
                            <button
                                onClick={handleStartChat}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                            >
                                <MessageSquare size={18} /> Chat
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={paying}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 transition"
                            >
                                <CreditCard size={18} /> {paying ? "Wait..." : "Buy Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;