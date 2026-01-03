import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, resetSingleAd } from "../../redux/actions/ProductSlice";
import { createChat } from "../../redux/actions/ChatSlice";
import { MapPin, MessageSquare, CreditCard, ArrowLeft, Loader2, AlertCircle, ShieldCheck, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token } = useSelector(state => state.auth);
    const { singleAd, loading, error } = useSelector(state => state.product);

    const currentUserId = user?.id || user?._id;
    const [paying, setPaying] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

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

        if (currentUserId === singleAd?.sellerId) {
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
            alert("Payment system is still initializing. Please wait a moment.");
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
                if (response.status === "successful") alert("Payment Successful!");
                setPaying(false);
            },
            onclose: () => setPaying(false),
        });
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-gray-950">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-400 font-medium animate-pulse">Loading item details...</p>
        </div>
    );

    if (error || !singleAd) return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-white dark:bg-gray-950">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
                <p className="text-gray-500 font-bold text-lg">{error || "Product not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 transition-colors duration-300">


            <header className="border-b dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-700 dark:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em]">Product Details</span>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-700 dark:text-white">
                        <Share2 size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">


                    <div className="relative group">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-800 shadow-2xl"
                        >

                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer"
                                     style={{ backgroundSize: '200% 100%' }} />
                            )}

                            <img
                                src={singleAd.images?.[0] || "https://via.placeholder.com/600"}
                                alt={singleAd.title}
                                loading="eager"
                                decoding="async"
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-xl'}`}
                            />
                        </motion.div>


                        <div className="absolute -bottom-4 right-8 bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Price</p>
                            <p className="text-2xl font-black">₦{singleAd.price?.toLocaleString()}</p>
                        </div>
                    </div>


                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col py-4"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    New Arrival
                                </span>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck size={12} /> Verified
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-[1.1] tracking-tight">
                                {singleAd.title}
                            </h1>

                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                                    <MapPin size={18} className="text-blue-500" />
                                </div>
                                <span>{singleAd.location || "Lagos, Nigeria"}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Item Description</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
                                    {singleAd.description}
                                </p>
                            </div>
                        </div>


                        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleStartChat}
                                className="flex items-center justify-center gap-3 px-8 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98] shadow-sm"
                            >
                                <MessageSquare size={20} className="text-blue-600" />
                                Chat Seller
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={paying}
                                className="flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-base hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {paying ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <CreditCard size={20} />
                                )}
                                {paying ? "Processing..." : "Secure Purchase"}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
                            Secure payment powered by Flutterwave
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default ProductDetails;