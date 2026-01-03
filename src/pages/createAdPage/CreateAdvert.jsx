import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAd } from "../../redux/actions/AdvertSlice";
import { authService } from "../../services/AuthServices.js";
import { resetAuthState } from "../../redux/actions/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Tag, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const CreateAdvert = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reduxAuth = useSelector((state) => state.auth);
    const token = reduxAuth.token || authService.getCurrentAuth()?.token;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState("");

    const [formData, setFormData] = useState({
        title: "", description: "", price: "", location: "",
        status: "AVAILABLE", images: [],
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;


        setImagePreview(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Please login to create an advert");
            navigate("/login");
            return;
        }
        setLoading(true);

        try {
            const payload = { ...formData, images: imageBase64 ? [imageBase64] : [] };
            await dispatch(createAd({ adData: payload, token })).unwrap();
            toast.success("Advert created successfully!");


            setTimeout(() => navigate("/userprofile"), 1200);
        } catch (err) {
            const errorStr = err?.toString() || "";
            if (errorStr.includes("401") || errorStr.includes("403")) {
                toast.error("Session expired. Please login again.");
                dispatch(resetAuthState());
                authService.logout();
            } else {
                toast.error("Failed to create advert. Check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800"
            >

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Post Advert</h2>
                        <p className="text-gray-500 text-sm font-medium">Step {step} of 2: {step === 1 ? 'Basic Info' : 'Pricing & Media'}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-2 w-8 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                        <div className={`h-2 w-8 rounded-full transition-all duration-500 ${step === 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Item Title</label>
                                    <input
                                        name="title"
                                        placeholder="e.g. iPhone 15 Pro Max"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe what you are selling..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all h-40 resize-none font-medium"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 py-5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Price (₦)</label>
                                        <div className="relative">
                                            <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold" required />
                                            <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Location</label>
                                        <div className="relative">
                                            <input name="location" placeholder="State/City" value={formData.location} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold" required />
                                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Product Photo</label>
                                    <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 rounded-[2rem] text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
                                        <input type="file" accept="image/*" hidden id="imageUpload" onChange={handleImageChange} />
                                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                                                <Camera size={32} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-500">Tap to upload photo</span>
                                        </label>

                                        <AnimatePresence>
                                            {imagePreview && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mt-4 relative inline-block"
                                                >
                                                    <img src={imagePreview} alt="preview" className="rounded-2xl max-h-48 shadow-lg border-4 border-white dark:border-gray-700" />
                                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] bg-green-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Publish Ad"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
            <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />
        </div>
    );
};

export default CreateAdvert;