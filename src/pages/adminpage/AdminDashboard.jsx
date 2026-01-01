import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../services/AdminDashboardService.js";
import {
    Users, Search, Edit2, Trash2, X, RefreshCw,
    Shield, LayoutGrid, Plus, TrendingUp, LogOut, Loader2,
    AlertCircle, UserCheck, AlertTriangle, ShieldAlert, Phone, MapPin
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal Visibility States
    const [isUserEditOpen, setIsUserEditOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");

    // Form States
    const [selectedId, setSelectedId] = useState(null);
    const [userForm, setUserForm] = useState({
        roles: "", phoneNumber: "", address: "", isBlocked: false, isSuspended: false
    });
    const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

    // ✅ FIXED: Changed from adminAuth to adminToken and admin
    const adminToken = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(localStorage.getItem("admin"));

    useEffect(() => {
        if (!adminToken || adminUser?.roles !== "ADMIN") {
            navigate("/admin/login", { replace: true });
        }
    }, [adminToken, adminUser, navigate]);

    // ✅ FIXED: Logout Functionality
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/", { replace: true });
    };

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = activeTab === "users" ? await AdminService.getAllUsers() : await AdminService.getAllCategories();
            if (res.data.success) setData(res.data.data);
        } catch (err) { setError(`Failed to fetch ${activeTab}`); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [activeTab]);

    // User Edit Trigger
    const openUserEdit = (user) => {
        setSelectedId(user.id);
        setUserForm({
            roles: user.roles || "USER",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
            isBlocked: user.isBlocked || false,
            isSuspended: user.isSuspended || false
        });
        setIsUserEditOpen(true);
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await AdminService.updateUser(selectedId, userForm);
            if (res.data.success) {
                setIsUserEditOpen(false);
                fetchData();
            }
        } catch (err) { setError("User update failed."); }
    };

    // Category Modal Trigger
    const openCategoryModal = (mode, category = null) => {
        setModalMode(mode);
        if (mode === "edit" && category) {
            setSelectedId(category.id);
            setCategoryForm({ name: category.name, description: category.description });
        } else {
            setCategoryForm({ name: "", description: "" });
        }
        setIsCategoryModalOpen(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = modalMode === "create"
                ? await AdminService.createCategory(categoryForm)
                : await AdminService.updateCategory(selectedId, categoryForm);

            if (res.data.success) {
                setIsCategoryModalOpen(false);
                fetchData();
            }
        } catch (err) { setError("Category operation failed."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
        try {
            const res = activeTab === "users" ? await AdminService.deleteUser(id) : await AdminService.deleteCategory(id);
            if (res.data.success) fetchData();
        } catch (err) { setError("Delete operation failed."); }
    };

    const filteredData = data.filter(item => {
        const query = searchTerm.toLowerCase();
        return activeTab === "users" ? item.email?.toLowerCase().includes(query) : item.name?.toLowerCase().includes(query);
    });

    return (
        <div className="flex min-h-screen bg-[#030712] text-gray-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-800/50 bg-[#030712] hidden md:flex flex-col sticky top-0 h-screen p-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Shield size={22} /></div>
                        <span className="font-bold text-xl tracking-tight text-white">DealBridge</span>
                    </div>
                    <nav className="space-y-2">
                        <SidebarLink icon={<Users size={20} />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                        <SidebarLink icon={<LayoutGrid size={20} />} label="Categories" active={activeTab === "categories"} onClick={() => setActiveTab("categories")} />
                    </nav>
                </div>

                {/* LOGOUT BUTTON */}
                <div className="pt-6 border-t border-gray-800/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-4 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col">
                <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-8 bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-gray-900/40 px-4 py-2 rounded-2xl border border-gray-800 w-96">
                        <Search size={18} className="text-gray-500" />
                        <input type="text" placeholder={`Search ${activeTab}...`} className="bg-transparent border-none outline-none text-sm w-full text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
                        {activeTab === "categories" && (
                            <button onClick={() => openCategoryModal("create")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition-all"><Plus size={18} /> New Category</button>
                        )}
                    </div>
                </header>

                <div className="p-8">
                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title={`Total ${activeTab}`} value={data.length} icon={activeTab === "users" ? <Users size={20}/> : <LayoutGrid size={20}/>} color="blue" />
                        <StatCard title="System Mode" value={activeTab.toUpperCase()} icon={<Shield size={20}/>} color="purple" />
                        <StatCard title="Status" value="Online" icon={<UserCheck size={20}/>} color="green" />
                    </div>

                    {/* TABLE */}
                    <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-4 text-white"><Loader2 className="animate-spin text-blue-500" size={40} /> Loading...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-800/30 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-800/50">
                                <tr><th className="px-6 py-4">Identity</th><th className="px-6 py-4">Status / Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 text-white">
                                                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-400 font-bold border border-gray-700/50 uppercase">{(item.email || item.name || "?").charAt(0)}</div>
                                                <div><p className="font-semibold">{item.email || item.name}</p><p className="text-[10px] text-gray-500 font-mono">ID: {item.id}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {activeTab === "users" ? (
                                                    <>
                                                        {item.isBlocked && <span className="bg-red-500/10 text-red-500 border border-red-500/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">BLOCKED</span>}
                                                        {item.isSuspended && <span className="bg-orange-500/10 text-orange-500 border border-orange-500/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">SUSPENDED</span>}
                                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">{item.roles}</span>
                                                    </>
                                                ) : (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter">ACTIVE</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ActionButton
                                                    icon={<Edit2 size={16}/>}
                                                    onClick={() => activeTab === "users" ? openUserEdit(item) : openCategoryModal("edit", item)}
                                                />
                                                <ActionButton icon={<Trash2 size={16}/>} color="red" onClick={() => handleDelete(item.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {/* USER EDIT MODAL */}
            <AnimatePresence>
                {isUserEditOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setIsUserEditOpen(false)} className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md" />
                        <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] w-full max-w-xl relative z-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white"><ShieldAlert className="text-blue-500" /> Account Settings</h2>
                            <form onSubmit={handleUserUpdate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Role</label>
                                        <select value={userForm.roles} onChange={(e) => setUserForm({...userForm, roles: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                                            <option value="USER">USER</option><option value="ADMIN">ADMIN</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Phone</label>
                                        <input value={userForm.phoneNumber} onChange={(e) => setUserForm({...userForm, phoneNumber: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Address</label>
                                    <textarea value={userForm.address} onChange={(e) => setUserForm({...userForm, address: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 h-20 text-white outline-none" />
                                </div>
                                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-bold text-white">Suspend Account</p><p className="text-[10px] text-gray-500">Temporary lock</p></div>
                                        <input type="checkbox" checked={userForm.isSuspended} onChange={(e) => setUserForm({...userForm, isSuspended: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-bold text-white">Block Permanently</p><p className="text-[10px] text-gray-500">Prevent access (fraud flag)</p></div>
                                        <input type="checkbox" checked={userForm.isBlocked} onChange={(e) => setUserForm({...userForm, isBlocked: e.target.checked})} className="w-5 h-5 accent-red-500" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">Apply Security Updates</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CATEGORY MODAL */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md" />
                        <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white"><LayoutGrid className="text-blue-500" /> {modalMode === "create" ? "New Category" : "Edit Category"}</h2>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Name</label>
                                    <input required value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description</label>
                                    <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 h-32 text-white outline-none" />
                                </div>
                                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest">{modalMode === "create" ? "Create" : "Update"}</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sidebar Link Component
function SidebarLink({ icon, label, active, onClick }) {
    return <button onClick={onClick} className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-300 ${active ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800/50"}`}>{icon} <span className="font-semibold text-sm">{label}</span></button>;
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colors = { blue: "text-blue-400 bg-blue-400/10", purple: "text-purple-400 bg-purple-400/10", green: "text-emerald-400 bg-emerald-400/10" };
    return <div className="p-6 bg-gray-900/40 border border-gray-800/50 rounded-3xl"><div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-gray-800 ${colors[color]}`}>{icon}</div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{title}</p><p className="text-2xl font-bold mt-1 text-white">{value}</p></div>;
}

// Action Button Component
function ActionButton({ icon, color = "blue", onClick }) {
    const colorClass = color === "red" ? "hover:bg-red-500/20 text-red-500" : "hover:bg-blue-500/20 text-blue-500";
    return <button onClick={onClick} className={`p-2 rounded-xl transition-all ${colorClass}`}>{icon}</button>;
}

export default AdminDashboard;