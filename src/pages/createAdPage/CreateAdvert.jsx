import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAd } from "../../redux/actions/AdvertSlice";
import { authService } from "../../services/AuthServices.js";
import { resetAuthState } from "../../redux/actions/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
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
        reader.onloadend = () => setImageBase64(reader.result);
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
            setTimeout(() => navigate("/userprofile"), 1500);
        } catch (err) {
            const errorStr = err.toString();
            if (errorStr.includes("401") || errorStr.includes("403")) {
                toast.error("Session expired. Please login again.");
                dispatch(resetAuthState());
                authService.logout();
            } else {
                toast.error("Failed to create advert.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Create Advert (Step {step}/2)</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-4 rounded-xl bg-gray-700 text-white outline-none" required />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-4 rounded-xl bg-gray-700 text-white outline-none h-32" required />
                            <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 p-4 rounded-xl text-white font-bold hover:bg-blue-700 transition">Next →</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-4 rounded-xl bg-gray-700 text-white outline-none" required />
                                <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-4 rounded-xl bg-gray-700 text-white outline-none" required />
                            </div>
                            <div className="border-2 border-dashed border-gray-600 p-4 rounded-xl text-center">
                                <input type="file" accept="image/*" hidden id="imageUpload" onChange={handleImageChange} />
                                <label htmlFor="imageUpload" className="cursor-pointer text-blue-400">Upload Image</label>
                                {imagePreview && <img src={imagePreview} alt="preview" className="mt-4 rounded-lg max-h-40 mx-auto" />}
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-700 p-4 rounded-xl text-white">Back</button>
                                <button type="submit" disabled={loading} className="flex-1 bg-green-600 p-4 rounded-xl text-white font-bold">
                                    {loading ? "Posting..." : "Create Advert"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <ToastContainer theme="dark" />
        </div>
    );
};

export default CreateAdvert;