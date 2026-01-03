import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../services/AdminDashboardService.js";
import {
    Users, Search, Edit2, Trash2, X, RefreshCw, Menu,
    Shield, LayoutGrid, Plus, LogOut, Loader2,
    ShieldAlert, UserCheck, Activity, Database
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserEditOpen, setIsUserEditOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");

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


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = activeTab === "users"
                ? await AdminService.getAllUsers()
                : await AdminService.getAllCategories();

            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            setError(`Failed to fetch ${activeTab}`);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const filteredData = useMemo(() => {
        const query = searchTerm.toLowerCase();
        return data.filter(item =>
            activeTab === "users"
                ? item.email?.toLowerCase().includes(query)
                : item.name?.toLowerCase().includes(query)
        );
    }, [data, searchTerm, activeTab]);

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
        setLoading(true);
        try {
            const res = await AdminService.updateUser(selectedId, userForm);
            if (res.data.success) {
                setIsUserEditOpen(false);
                fetchData();
            }
        } catch (err) { setError("User update failed."); }
        finally { setLoading(false); }
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
        setLoading(true);
        try {
            const res = modalMode === "create"
                ? await AdminService.createCategory(categoryForm)
                : await AdminService.updateCategory(selectedId, categoryForm);

            if (res.data.success) {
                setIsCategoryModalOpen(false);
                fetchData();
            }
        } catch (err) { setError("Category operation failed."); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Critical: Are you sure you want to delete this record?`)) return;
        try {
            const res = activeTab === "users" ? await AdminService.deleteUser(id) : await AdminService.deleteCategory(id);
            if (res.data.success) fetchData();
        } catch (err) { setError("Delete failed."); }
    };

    return (
        <div className="flex min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-blue-500/30">


            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
                    />
                )}
            </AnimatePresence>


            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#030712] border-r border-gray-800/40 p-6 
                transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static md:flex flex-col
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:rotate-12 transition-transform duration-500">
                                <Shield size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-black text-xl tracking-tighter text-white">CORE ADMIN</h1>
                                <p className="text-[10px] text-blue-500 font-bold tracking-[0.2em]">DEALBRIDGE v2.0</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 p-2"><X size={24}/></button>
                    </div>

                    <nav className="space-y-2">
                        <SidebarLink
                            icon={<Users size={20} />} label="Manage Users" active={activeTab === "users"}
                            onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}
                        />
                        <SidebarLink
                            icon={<LayoutGrid size={20} />} label="Categories" active={activeTab === "categories"}
                            onClick={() => { setActiveTab("categories"); setIsSidebarOpen(false); }}
                        />
                        <SidebarLink
                            icon={<Activity size={20} />} label="System Logs" active={activeTab === "logs"}
                            onClick={() => { setActiveTab("logs"); setIsSidebarOpen(false); }}
                        />
                    </nav>
                </div>

                <div className="pt-6 border-t border-gray-800/50">
                    <div className="flex items-center gap-3 p-4 mb-4 bg-gray-900/40 rounded-2xl border border-gray-800">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">A</div>
                        <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{adminUser?.email}</p>
                            <p className="text-[9px] text-gray-500 uppercase font-black">Super Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all font-black text-xs uppercase tracking-widest">
                        <LogOut size={18} /> Sign Out Session
                    </button>
                </div>
            </aside>


            <main className="flex-1 flex flex-col w-full min-w-0 bg-[#030712]">


                <header className="h-24 border-b border-gray-800/40 flex items-center justify-between px-6 md:px-10 bg-[#030712]/80 backdrop-blur-2xl sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-900 rounded-xl"><Menu size={24} /></button>
                        <div className="flex items-center gap-3 bg-gray-900/60 px-5 py-3 rounded-2xl border border-gray-800 w-48 sm:w-80 md:w-[400px] focus-within:border-blue-500/50 transition-all shadow-inner">
                            <Search size={18} className="text-gray-600 shrink-0" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-600 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={fetchData} className="p-3 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 hover:border-blue-500/30 transition-all active:scale-95 shadow-lg">
                            <RefreshCw size={20} className={`text-blue-500 ${loading ? "animate-spin" : ""}`} />
                        </button>
                        {activeTab === "categories" && (
                            <button onClick={() => openCategoryModal("create")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-black transition-all text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">
                                <Plus size={18} /> New Category
                            </button>
                        )}
                    </div>
                </header>

                <div className="p-6 md:p-10">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard title="Total Entries" value={data.length} icon={<Database size={20}/>} color="blue" />
                        <StatCard title="Security Status" value="Locked" icon={<Shield size={20}/>} color="purple" />
                        <StatCard title="Server Uptime" value="99.9%" icon={<Activity size={20}/>} color="green" />
                        <StatCard title="Active Root" value="ADMIN" icon={<UserCheck size={20}/>} color="orange" />
                    </div>


                    <div className="bg-gray-900/20 border border-gray-800/40 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[700px] border-collapse">
                                <thead className="bg-gray-900/40 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-800/50">
                                <tr>
                                    <th className="px-8 py-6">Record Identity</th>
                                    <th className="px-8 py-6">Permission / Level</th>
                                    <th className="px-8 py-6 text-right">System Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/30">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="animate-spin text-blue-500" size={48} />
                                                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Accessing Database...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.map((item) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={item.id}
                                        className="group hover:bg-blue-600/[0.03] transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-blue-500 font-black border border-gray-700/50 text-lg">
                                                    {(item.email || item.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="max-w-[200px] truncate">
                                                    <p className="font-bold text-white truncate text-sm">{item.email || item.name}</p>
                                                    <p className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">UUID: {item.id?.substring(0,18)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {activeTab === "users" ? (
                                                    <>
                                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{item.roles}</span>
                                                        {item.isBlocked && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Blocked</span>}
                                                        {item.isSuspended && <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Suspended</span>}
                                                    </>
                                                ) : (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">System Active</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <ActionButton icon={<Edit2 size={18}/>} onClick={() => activeTab === "users" ? openUserEdit(item) : openCategoryModal("edit", item)} />
                                                <ActionButton icon={<Trash2 size={18}/>} color="red" onClick={() => handleDelete(item.id)} />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>


            <AnimatePresence>
                {(isUserEditOpen || isCategoryModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => { setIsUserEditOpen(false); setIsCategoryModalOpen(false); }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                        <motion.div initial={{scale:0.9, opacity:0, y:20}} animate={{scale:1, opacity:1, y:0}} exit={{scale:0.9, opacity:0, y:20}} className="bg-gray-900 border border-gray-800 p-8 rounded-[3rem] w-full max-w-xl relative z-10 shadow-[0_0_100px_rgba(37,99,235,0.1)]">
                            {isUserEditOpen ? (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500"><ShieldAlert size={32} /></div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter">Security Protocols</h2>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Adjust user authorization tiers</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleUserUpdate} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Role</label>
                                                <select value={userForm.roles} onChange={(e) => setUserForm({...userForm, roles: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-blue-500">
                                                    <option value="USER">Standard User</option><option value="ADMIN">System Admin</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Terminal Phone</label>
                                                <input value={userForm.phoneNumber} onChange={(e) => setUserForm({...userForm, phoneNumber: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-blue-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Physical Location</label>
                                            <textarea value={userForm.address} onChange={(e) => setUserForm({...userForm, address: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 h-24 text-sm text-white font-medium outline-none resize-none focus:border-blue-500" />
                                        </div>
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 space-y-4">
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <div><p className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">Suspend Traffic</p><p className="text-[10px] text-gray-500 uppercase font-bold">Temporary Account Freeze</p></div>
                                                <input type="checkbox" checked={userForm.isSuspended} onChange={(e) => setUserForm({...userForm, isSuspended: e.target.checked})} className="w-6 h-6 rounded-lg accent-orange-500" />
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <div><p className="text-sm font-black text-white group-hover:text-red-500 transition-colors">Permanent Block</p><p className="text-[10px] text-gray-500 uppercase font-bold">Revoke All System Access</p></div>
                                                <input type="checkbox" checked={userForm.isBlocked} onChange={(e) => setUserForm({...userForm, isBlocked: e.target.checked})} className="w-6 h-6 rounded-lg accent-red-600" />
                                            </label>
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20">
                                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Commit Security Updates"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-500"><LayoutGrid size={32} /></div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter">{modalMode === "create" ? "Add Category" : "Modify Category"}</h2>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Organize marketplace taxonomy</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleCategorySubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Classification Name</label>
                                            <input required value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-white font-bold outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brief Overview</label>
                                            <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 h-40 text-sm text-white font-medium outline-none resize-none focus:border-emerald-500" />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20">
                                            {loading ? <Loader2 className="animate-spin mx-auto" /> : (modalMode === "create" ? "Deploy Category" : "Save Changes")}
                                        </button>
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



function SidebarLink({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${
                active
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 font-black"
                    : "text-gray-500 hover:bg-gray-800/40 hover:text-gray-300 font-bold"
            }`}
        >
            <span className={`${active ? "text-white" : "text-gray-600 group-hover:text-blue-500"} transition-colors`}>{icon}</span>
            <span className="text-xs uppercase tracking-widest">{label}</span>
        </button>
    );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
        green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        orange: "text-orange-400 bg-orange-400/10 border-orange-400/20"
    };
    return (
        <div className="p-6 bg-gray-900/40 border border-gray-800/50 rounded-3xl group hover:border-gray-700 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]} group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        </div>
    );
}

function ActionButton({ icon, color = "blue", onClick }) {
    const colorClass = color === "red"
        ? "hover:bg-red-500 hover:text-white text-red-500 border-red-500/20"
        : "hover:bg-blue-600 hover:text-white text-blue-500 border-blue-600/20";
    return (
        <button onClick={onClick} className={`p-3 rounded-xl transition-all border bg-gray-900 shadow-lg ${colorClass} active:scale-90`}>
            {icon}
        </button>
    );
}

export default AdminDashboard;