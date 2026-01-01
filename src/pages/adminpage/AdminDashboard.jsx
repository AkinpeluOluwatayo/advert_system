import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../services/AdminDashboardService.js";
import {
    Users, Search, Edit2, Trash2, X, RefreshCw, Menu,
    Shield, LayoutGrid, Plus, LogOut, Loader2,
    ShieldAlert, UserCheck
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Responsive State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const adminToken = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(localStorage.getItem("admin"));

    useEffect(() => {
        if (!adminToken || adminUser?.roles !== "ADMIN") {
            navigate("/admin/login", { replace: true });
        }
    }, [adminToken, adminUser, navigate]);

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
        if (!window.confirm(`Are you sure?`)) return;
        try {
            const res = activeTab === "users" ? await AdminService.deleteUser(id) : await AdminService.deleteCategory(id);
            if (res.data.success) fetchData();
        } catch (err) { setError("Delete failed."); }
    };

    const filteredData = data.filter(item => {
        const query = searchTerm.toLowerCase();
        return activeTab === "users" ? item.email?.toLowerCase().includes(query) : item.name?.toLowerCase().includes(query);
    });

    return (
        <div className="flex min-h-screen bg-[#030712] text-gray-100 font-sans overflow-x-hidden">

            {/* MOBILE SIDEBAR OVERLAY */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR (Desktop Fixed, Mobile Animated) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#030712] border-r border-gray-800/50 p-6 
                transform transition-transform duration-300 md:translate-x-0 md:static md:flex flex-col
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Shield size={22} /></div>
                            <span className="font-bold text-xl tracking-tight text-white">DealBridge</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 p-2"><X size={24}/></button>
                    </div>
                    <nav className="space-y-2">
                        <SidebarLink
                            icon={<Users size={20} />} label="Users" active={activeTab === "users"}
                            onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}
                        />
                        <SidebarLink
                            icon={<LayoutGrid size={20} />} label="Categories" active={activeTab === "categories"}
                            onClick={() => { setActiveTab("categories"); setIsSidebarOpen(false); }}
                        />
                    </nav>
                </div>
                <div className="pt-6 border-t border-gray-800/50">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut size={20} />
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col w-full min-w-0">
                {/* HEADER */}
                <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-4 md:px-8 bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white"><Menu size={24} /></button>
                        <div className="flex items-center gap-2 bg-gray-900/40 px-3 py-2 rounded-xl border border-gray-800 w-40 sm:w-64 md:w-96">
                            <Search size={16} className="text-gray-500 shrink-0" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={fetchData} className="p-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
                        {activeTab === "categories" && (
                            <button onClick={() => openCategoryModal("create")} className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-bold transition-all text-xs sm:text-sm"><Plus size={18} /> New Category</button>
                        )}
                        {/* Mobile New Category Button */}
                        {activeTab === "categories" && (
                            <button onClick={() => openCategoryModal("create")} className="sm:hidden p-2 bg-blue-600 rounded-xl text-white"><Plus size={20} /></button>
                        )}
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <StatCard title={`Total ${activeTab}`} value={data.length} icon={activeTab === "users" ? <Users size={20}/> : <LayoutGrid size={20}/>} color="blue" />
                        <StatCard title="System Mode" value={activeTab.toUpperCase()} icon={<Shield size={20}/>} color="purple" />
                        <StatCard title="Status" value="Online" icon={<UserCheck size={20}/>} color="green" />
                    </div>

                    {/* TABLE WITH SCROLL WRAPPER */}
                    <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto scrollbar-hide">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4 text-white"><Loader2 className="animate-spin text-blue-500" size={40} /> Loading...</div>
                            ) : (
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-gray-800/30 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-800/50">
                                    <tr><th className="px-6 py-4">Identity</th><th className="px-6 py-4">Status / Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-400 font-bold border border-gray-700/50 uppercase">{(item.email || item.name || "?").charAt(0)}</div>
                                                    <div className="max-w-[150px] truncate"><p className="font-semibold truncate">{item.email || item.name}</p><p className="text-[10px] text-gray-500 font-mono">ID: {item.id}</p></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {activeTab === "users" ? (
                                                        <>
                                                            {item.isBlocked && <span className="bg-red-500/10 text-red-500 border border-red-500/10 px-2 py-0.5 rounded text-[10px] font-bold">BLOCKED</span>}
                                                            {item.isSuspended && <span className="bg-orange-500/10 text-orange-500 border border-orange-500/10 px-2 py-0.5 rounded text-[10px] font-bold">SUSPENDED</span>}
                                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded text-[10px] font-bold">{item.roles}</span>
                                                        </>
                                                    ) : (
                                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2 justify-end md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ActionButton icon={<Edit2 size={16}/>} onClick={() => activeTab === "users" ? openUserEdit(item) : openCategoryModal("edit", item)} />
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
                </div>
            </main>

            {/* MODALS - Added full-screen mobile sizing */}
            <AnimatePresence>
                {(isUserEditOpen || isCategoryModalOpen) && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => { setIsUserEditOpen(false); setIsCategoryModalOpen(false); }} className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md" />

                        <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl w-full max-w-xl relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                            {isUserEditOpen ? (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3 text-white"><ShieldAlert className="text-blue-500" /> Account Settings</h2>
                                    <form onSubmit={handleUserUpdate} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Role</label>
                                                <select value={userForm.roles} onChange={(e) => setUserForm({...userForm, roles: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-white outline-none">
                                                    <option value="USER">USER</option><option value="ADMIN">ADMIN</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Phone</label>
                                                <input value={userForm.phoneNumber} onChange={(e) => setUserForm({...userForm, phoneNumber: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-white outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Address</label>
                                            <textarea value={userForm.address} onChange={(e) => setUserForm({...userForm, address: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 h-20 text-sm text-white outline-none" />
                                        </div>
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 space-y-4">
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div><p className="text-sm font-bold text-white">Suspend Account</p><p className="text-[10px] text-gray-500">Temporary lock</p></div>
                                                <input type="checkbox" checked={userForm.isSuspended} onChange={(e) => setUserForm({...userForm, isSuspended: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div><p className="text-sm font-bold text-white">Block Permanently</p><p className="text-[10px] text-gray-500">Prevent access</p></div>
                                                <input type="checkbox" checked={userForm.isBlocked} onChange={(e) => setUserForm({...userForm, isBlocked: e.target.checked})} className="w-5 h-5 accent-red-500" />
                                            </label>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm">Apply Security Updates</button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3 text-white"><LayoutGrid className="text-blue-500" /> {modalMode === "create" ? "New Category" : "Edit Category"}</h2>
                                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Name</label>
                                            <input required value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-white outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description</label>
                                            <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 h-32 text-sm text-white outline-none" />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all text-sm uppercase tracking-widest">{modalMode === "create" ? "Create" : "Update"}</button>
                                    </form>
                                </>
                            )}
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
    return <div className="p-4 sm:p-6 bg-gray-900/40 border border-gray-800/50 rounded-2xl md:rounded-3xl shrink-0"><div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 border border-gray-800 ${colors[color]}`}>{icon}</div><p className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{title}</p><p className="text-xl sm:text-2xl font-bold mt-1 text-white">{value}</p></div>;
}

// Action Button Component
function ActionButton({ icon, color = "blue", onClick }) {
    const colorClass = color === "red" ? "hover:bg-red-500/20 text-red-500" : "hover:bg-blue-500/20 text-blue-500";
    return <button onClick={onClick} className={`p-2 rounded-xl transition-all ${colorClass}`}>{icon}</button>;
}

export default AdminDashboard;