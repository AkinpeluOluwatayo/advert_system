import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAd } from "../../redux/actions/AdvertSlice";
import { authService } from "../../services/AuthServices.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAdvert = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reduxAuth = useSelector((state) => state.auth);
    const token = reduxAuth.token || authService.getCurrentAuth()?.token || null;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(""); // store base64 string
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        status: "AVAILABLE",
        images: [],
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        setImagePreview(URL.createObjectURL(file));

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result); // "data:image/png;base64,..."
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                ...formData,
                images: imageBase64 ? [imageBase64] : [],
            };

            await dispatch(createAd({ adData: payload, token })).unwrap();

            toast.success("Advert created successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Navigate to UserProfile after short delay
            setTimeout(() => navigate("/UserProfile"), 1500);
        } catch (err) {
            console.error("Create advert failed:", err);
            toast.error("Failed to create advert. You may not be logged in.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Create Advert
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 && (
                        <>
                            <input
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 p-3 rounded"
                            >
                                Next →
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <input
                                name="price"
                                type="number"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                required
                            />
                            <input
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                required
                            />

                            <div className="border-2 border-dashed border-blue-600 p-4 rounded text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="imageUpload"
                                    onChange={handleImageChange}
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="cursor-pointer text-blue-400"
                                >
                                    Upload Image
                                </label>

                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        onError={(e) =>
                                            (e.target.src = "/fallback-image.png")
                                        }
                                        className="mt-4 rounded max-h-40 mx-auto"
                                    />
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-600 p-3 rounded"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 p-3 rounded"
                                >
                                    {loading ? "Creating..." : "Create Advert"}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default CreateAdvert;
