import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {ImagePlus, DollarSign, Tag, MapPin, ChevronRight, ChevronLeft,} from "lucide-react";

function CreateAdvert() {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreview(files.map((file) => URL.createObjectURL(file)));
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-12">
            {/* HERO GRID */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
                {/* LEFT SIDEBAR */}
                <div className="hidden lg:flex flex-col justify-center space-y-6">
                    <h1 className="text-4xl font-extrabold leading-tight">
                        Create a <span className="text-blue-500">Standout</span> Advert
                    </h1>
                    <p className="text-gray-300">
                        Post your product with beautiful visuals, clear pricing,
                        and accurate details to attract serious buyers faster.
                    </p>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <p className="text-sm text-gray-400">💡 Pro Tip</p>
                        <p className="mt-2 text-gray-200">
                            Adverts with 3+ images and good descriptions perform better.
                        </p>
                    </div>
                </div>

                {/* CENTER FORM */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-xl p-8">
                    {/* STEP INDICATOR */}
                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-2 w-10 rounded-full transition ${
                                    step >= s ? "bg-blue-500" : "bg-gray-700"
                                }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* STEP 1: IMAGES */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-center">
                                    Upload Product Images
                                </h2>

                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-2xl p-8 cursor-pointer hover:border-blue-500 transition">
                                    <ImagePlus size={40} className="text-gray-400" />
                                    <span className="mt-3 text-gray-300">
                                        Click to upload images
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>

                                {preview.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {preview.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="preview"
                                                className="h-24 w-full object-cover rounded-xl hover:scale-105 transition"
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-5"
                            >
                                <h2 className="text-2xl font-bold text-center">
                                    Product Details
                                </h2>

                                <div>
                                    <label className="text-gray-200 text-sm mb-1 block">
                                        Product Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. iPhone 13 Pro Max"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-200 text-sm mb-1 block">
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Describe your product clearly..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PRICE & LOCATION */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-5"
                            >
                                <h2 className="text-2xl font-bold text-center">
                                    Pricing & Location
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <DollarSign
                                            size={16}
                                            className="absolute left-3 top-3 text-gray-400"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price (₦)"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Tag
                                            size={16}
                                            className="absolute left-3 top-3 text-gray-400"
                                        />
                                        <select className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option className="bg-gray-900">
                                                Electronics
                                            </option>
                                            <option className="bg-gray-900">
                                                Fashion
                                            </option>
                                            <option className="bg-gray-900">
                                                Vehicles
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="relative">
                                    <MapPin
                                        size={16}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location (e.g. Lagos)"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* NAVIGATION */}
                    <div className="flex justify-between mt-10">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                            Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold">
                                Publish Advert
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:flex flex-col justify-center space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h4 className="font-semibold mb-3">Required Information</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                            <li>✔ Product images</li>
                            <li>✔ Clear description</li>
                            <li>✔ Realistic price</li>
                            <li>✔ Correct location</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
                        <p className="font-semibold">🚀 Boost Visibility</p>
                        <p className="text-sm opacity-90 mt-1">
                            Well-detailed ads get more clicks and messages.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAdvert;
