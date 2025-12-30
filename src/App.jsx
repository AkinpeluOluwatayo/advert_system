import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLogin from "./components/adminAuth/AdminLogin.jsx";
import AdminDashboard from "./pages/adminpage/AdminDashboard.jsx";
import ChatPage from "./pages/chatpage/Chat.jsx";
import UserProfile from "./pages/userprofile/UserProfile.jsx";
import CreateAdvert from "./pages/createAdPage/CreateAdvert.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ProductDetails from "./pages/adsDetails/ProductDetails.jsx";
import ViewAllAds from "./pages/viewAllAdPage/ViewAllAds.jsx";
import Signup from "./components/auth/signup/Signup.jsx";
import LandingPage from "./pages/landingpage/Landing.jsx";
import Login from "./components/auth/login/Login.jsx";
// ... (your other imports)

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/ViewAllAds" element={<ViewAllAds />} />
                <Route path="/ProductDetails/:id" element={<ProductDetails />} />

                {/* Protected Routes - User must be logged in */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/CreateAdvert" element={<PrivateRoute><CreateAdvert /></PrivateRoute>} />
                <Route path="/userprofile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/chat/:id" element={<PrivateRoute><ChatPage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/adminAuth" element={<AdminLogin />} />
                <Route path="/adminPage" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}
export default App