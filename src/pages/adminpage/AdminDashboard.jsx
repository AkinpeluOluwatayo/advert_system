import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Users, Search, Edit2, Trash2, Eye, X, Save, RefreshCw,
    Shield, Mail, Phone, MapPin, UserCheck, AlertCircle,
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();

    // ✅ Correct admin auth retrieval
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
    const adminToken = adminAuth?.token;
    const adminUser = adminAuth?.admin || adminAuth?.user;

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [editForm, setEditForm] = useState({
        email: "",
        phoneNumber: "",
        address: "",
        roles: "",
    });

    // 🔐 HARD GUARD — redirect immediately if not admin
    useEffect(() => {
        if (!adminToken || adminUser?.roles !== "ADMIN") {
            navigate("/admin/login", { replace: true });
        }
    }, [adminToken, adminUser, navigate]);

    // ✅ Axios instance ONLY when token exists
    const api = useMemo(() => {
        if (!adminToken) return null;

        return axios.create({
            baseURL: "http://localhost:8080",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
    }, [adminToken]);

    // ✅ Fetch users ONLY when api is ready
    useEffect(() => {
        if (!api) return;
        fetchUsers();
        // eslint-disable-next-line
    }, [api]);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/users");
            if (response.data.success) {
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
            }
        } catch (err) {
            setError("Failed to fetch users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phoneNumber?.includes(searchTerm) ||
                user.roles.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const viewUser = async (userId) => {
        if (!api) return;
        try {
            const response = await api.get(`/users/${userId}`);
            if (response.data.success) {
                setSelectedUser(response.data.data);
                setEditForm({
                    email: response.data.data.email,
                    phoneNumber: response.data.data.phoneNumber || "",
                    address: response.data.data.address || "",
                    roles: response.data.data.roles,
                });
            }
        } catch (err) {
            setError("Failed to fetch user details");
            console.error(err);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        if (!api || !selectedUser) return;

        setLoading(true);
        setError("");
        try {
            const response = await api.put(`/users/${selectedUser.id}`, editForm);
            if (response.data.success) {
                setIsEditing(false);
                setSelectedUser(null);
                fetchUsers();
            }
        } catch (err) {
            setError("Failed to update user");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!api) return;
        if (!window.confirm("Delete this user?")) return;

        setLoading(true);
        setError("");
        try {
            const response = await api.delete(`/users/${userId}`);
            if (response.data.success) {
                fetchUsers();
                setSelectedUser(null);
            }
        } catch (err) {
            setError("Failed to delete user");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-500" size={32} />
                        <div>
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">Manage users</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-800 rounded-xl"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* ERROR */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            <span>{error}</span>
                            <button onClick={() => setError("")} className="ml-auto">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* USERS LIST */}
                {!loading && (
                    <div className="space-y-3">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-gray-800 p-4 rounded-xl flex justify-between"
                            >
                                <span>{user.email}</span>
                                <div className="flex gap-3">
                                    <button onClick={() => viewUser(user.id)}>
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => deleteUser(user.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminDashboard;
