import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const authService = {
    signup: async (data) => {
        const response = await axios.post(`${API_URL}/register`, data);
        if (response.data?.data) {
            localStorage.setItem("auth", JSON.stringify(response.data.data));
        }
        return response.data.data;
    },

    login: async (data) => {
        const response = await axios.post(`${API_URL}/login`, data);
        if (response.data?.data) {
            localStorage.setItem("auth", JSON.stringify(response.data.data));
        }
        return response.data.data;
    },

    // AuthServices.js


        forgotPassword: async (email) => {
            try {
                // We wrap 'email' in an object to match the Map<String, String> on backend
                const response = await axios.post(`${API_URL}/forgot-password`, { email });
                return response.data;
            } catch (error) {
                // Throw the message so the Redux Thunk can catch it
                throw error.response?.data?.message || "Server Error";
            }
        },

        resetPassword: async (token, newPassword) => {
            try {
                // token goes in query param, newPassword goes in body
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
            localStorage.setItem("adminAuth", JSON.stringify(response.data.data));
        }
        return response.data.data;
    },

    getCurrentAuth: () => {
        try {
            return JSON.parse(localStorage.getItem("auth"));
        } catch {
            return null;
        }
    },

    getCurrentAdminAuth: () => {
        try {
            return JSON.parse(localStorage.getItem("adminAuth"));
        } catch {
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem("auth");
        window.location.href = "/login";
    },

    adminLogout: () => {
        localStorage.removeItem("adminAuth");
        window.location.href = "/adminAuth";
    },
};