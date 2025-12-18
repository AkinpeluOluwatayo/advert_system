import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/Landing.jsx";
import Login from "./components/auth/login/Login.jsx";
import Signup from "./components/auth/signup/Signup.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ViewAllAds from "./pages/viewAllAdPage/ViewAllAds.jsx";
import ProductDetails from "./pages/adsDetails/ProductDetails.jsx";
import ChatPage from "./pages/chatpage/Chat.jsx";
import CreateAdvert from "./pages/createAdPage/CreateAdvert.jsx";
import ForgotPassword from "./components/forgotpassword/ForgotPassword.jsx";
import UserProfile from "./pages/userprofile/UserProfile.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ViewAllAds" element={<ViewAllAds />} />
                <Route path="/ProductDetails/:id" element={<ProductDetails />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="/CreateAdvert" element={<CreateAdvert />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/UserProfile" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
