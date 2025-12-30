import axios from "axios";

const API_URL = "http://localhost:8080/ads";

export const advertServices = {

    createAd: async (data, token) => {
        const response = await axios.post(`${API_URL}/create`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data.ad;
    },

    getAdById: async (adId, token) => {
        const response = await axios.get(`${API_URL}/${adId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data.ad;
    },

    getAdsByUser: async (token) => {
        const response = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data.ads;
    },

    deleteAd: async (adId, token) => {
        const response = await axios.delete(`${API_URL}/delete/${adId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data.ad;
    },

    getAllAds: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.location) params.append('location', filters.location);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        const response = await axios.get(`${API_URL}/all?${params.toString()}`);
        return response.data.data.ads;
    },
};