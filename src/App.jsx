import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/Landing.jsx";
import Login from "./components/auth/login/Login.jsx";
import Signup from "./components/auth/signup/Signup.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ViewAllAds from "./pages/viewAllAdPage/ViewAllAds.jsx";
import ProductDetails from "./pages/adsDetails/ProductDetails.jsx";
import ChatPage from "./pages/chatpage/Chat.jsx";

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
            </Routes>
        </Router>
    );
}

export default App;
