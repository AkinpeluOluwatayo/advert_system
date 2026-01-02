import axios from "axios";


const API_URL = "https://dealbridgeconnect-zvjn.onrender.com/auth";

export const authService = {
    signup: async (data) => {
        const response = await axios.post(`${API_URL}/register`, data);

        if (response.data?.data) {
            const { user, token } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }

        return response.data.data;
    },

    login: async (data) => {
        const response = await axios.post(`${API_URL}/login`, data);

        if (response.data?.data) {
            const { user, token } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }

        return response.data.data;
    },

    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Server Error";
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password?token=${token}`, {
                newPassword: newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Reset failed";
        }
    },

    adminLogin: async (data) => {
        const response = await axios.post(`${API_URL}/admin/login`, data);

        if (response.data?.data) {
            const { admin, token, user } = response.data.data;
            localStorage.setItem("adminToken", token);
            localStorage.setItem("admin", JSON.stringify(admin || user));
        }

        return response.data.data;
    },

    getCurrentAuth: () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (token && user) {
                return { token, user };
            }
            return null;
        } catch {
            return null;
        }
    },

    getCurrentAdminAuth: () => {
        try {
            const token = localStorage.getItem("adminToken");
            const admin = JSON.parse(localStorage.getItem("admin"));

            if (token && admin) {
                return { token, user: admin };
            }
            return null;
        } catch {
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    adminLogout: () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
    },
};