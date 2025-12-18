import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/actions/ViewAllAdvertSlice";
import { MapPin, MessageSquare, CreditCard } from "lucide-react";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { singleProduct, loading, error } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        dispatch(fetchSingleProduct(id));
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 text-lg font-medium">{error}</p>
            </div>
        );
    }

    if (!singleProduct) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {singleProduct.title}
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">
                {/* IMAGE SLIDER */}
                <div className="flex-1">
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
                        <img
                            src={singleProduct.thumbnail}
                            alt={singleProduct.title}
                            className="w-full h-full object-cover animate-fade-in"
                        />
                    </div>

                    <div className="mt-6 flex gap-4 overflow-x-auto">
                        {singleProduct.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${singleProduct.title}-${idx}`}
                                className="w-32 h-32 object-cover rounded-2xl hover:scale-105 transition-transform cursor-pointer"
                            />
                        ))}
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {singleProduct.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {singleProduct.description}
                    </p>
                    <p className="text-2xl font-semibold text-blue-600">
                        ₦{singleProduct.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin size={18} />
                        <span>{singleProduct.brand || "Nigeria"}</span>
                    </div>

                    {/* CHAT & PURCHASE BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate(`/chat/${singleProduct.id}`)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow w-full sm:w-auto justify-center"
                        >
                            <MessageSquare size={20} />
                            Chat with Seller
                        </button>

                        <button
                            onClick={() =>
                                window.open(
                                    "https://sandbox.flutterwave.com/pay/nh2puc7cjm6g",
                                    "_blank"
                                )
                            }
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow w-full sm:w-auto justify-center"
                        >
                            <CreditCard size={20} />
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
