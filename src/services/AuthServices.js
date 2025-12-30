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
        window.location.href = "/login"; // Force redirect and clear memory
    },

    adminLogout: () => {
        localStorage.removeItem("adminAuth");
        window.location.href = "/adminAuth";
    },
};