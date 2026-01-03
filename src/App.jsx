import React, { Suspense, lazy, Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/20 max-w-sm">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Load Failure</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
                            We couldn't retrieve the page. This is usually caused by a connection flicker.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            <RefreshCcw size={18} /> Reload Session
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}


const Login = lazy(() => import("./components/auth/login/Login.jsx"));
const Signup = lazy(() => import("./components/auth/signup/Signup.jsx"));
const ForgotPassword = lazy(() => import("./components/forgotpassword/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./components/resetpassword/ResetPassword.jsx"));

const LandingPage = lazy(() => import("./pages/landingpage/Landing.jsx"));
const AboutUs = lazy(() => import("./pages/aboutus/AboutUs.jsx"));
const ViewAllAds = lazy(() => import("./pages/viewAllAdPage/ViewAllAds.jsx"));
const ProductDetails = lazy(() => import("./pages/adsDetails/ProductDetails.jsx"));

const CreateAdvert = lazy(() => import("./pages/createAdPage/CreateAdvert.jsx"));
const UserProfile = lazy(() => import("./pages/userprofile/UserProfile.jsx"));
const ChatPage = lazy(() => import("./pages/chatpage/Chat.jsx"));

const AdminLogin = lazy(() => import("./components/adminAuth/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/adminpage/AdminDashboard.jsx"));


const PageLoader = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">
            Loading Terminal...
        </p>
    </div>
);


const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                    <Routes>

                        <Route path="/" element={<LandingPage />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/ViewAllAds" element={<ViewAllAds />} />
                        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
                        <Route path="/dashboard" element={<Navigate to="/ViewAllAds" replace />} />
                        <Route path="/viewAllAdPage" element={<Navigate to="/ViewAllAds" replace />} />
                        <Route path="/CreateAdvert" element={<PrivateRoute><CreateAdvert /></PrivateRoute>}/>
                        <Route path="/UserProfile" element={<PrivateRoute><UserProfile /></PrivateRoute>}/>
                        <Route path="/chat"
                            element={<PrivateRoute><ChatPage /></PrivateRoute>}/>
                        <Route path="/chat/:chatId" element={<PrivateRoute><ChatPage /></PrivateRoute>}/>


                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/adminAuth" element={<AdminLogin />} />
                        <Route path="/adminPage" element={<AdminDashboard />} />


                        <Route path="*" element={<Navigate to="/ViewAllAds" replace />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
}

export default App;