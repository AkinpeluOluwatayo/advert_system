import axios from 'axios';

const apiClient = axios.create({

    baseURL: "https://dealbridges-connect-yy4x.onrender.com",
});

apiClient.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem("adminToken");
    const admin = JSON.parse(localStorage.getItem("admin"));

    console.log("🔑 Admin Token:", adminToken);
    console.log("👤 Admin User:", admin);

    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
});

export const AdminService = {

    getAllUsers: () => apiClient.get("/users/all"),
    deleteUser: (id) => apiClient.delete(`/users/delete/${id}`),
    updateUser: (id, data) => apiClient.put(`/users/update/${id}`, data),


    getAllCategories: () => apiClient.get("/category/all"),
    createCategory: (data) => apiClient.post("/category/create", data),
    deleteCategory: (id) => apiClient.delete(`/category/delete/${id}`),
    updateCategory: (id, data) => apiClient.put(`/category/update/${id}`, data),
};