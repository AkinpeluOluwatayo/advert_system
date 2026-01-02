import axios from "axios";


const CHAT_URL = "https://dealbridges-connect-yy4x.onrender.com/chat";
const MSG_URL = "https://dealbridges-connect-yy4x.onrender.com/messages";


axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const chatService = {
    createChat: async (chatRequest, userId) => {
        const response = await axios.post(`${CHAT_URL}/create?userId=${userId}`, chatRequest);
        return response.data;
    },
    getUserChats: async (userId) => {
        const response = await axios.get(`${CHAT_URL}/user/${userId}`);
        return response.data;
    },
    getChatMessages: async (chatId) => {
        const response = await axios.get(`${MSG_URL}/chat/${chatId}`);
        return response.data;
    },
    sendMessage: async (messageRequest, senderId) => {

        const response = await axios.post(`${MSG_URL}/send?senderId=${senderId}`, messageRequest);
        return response.data;
    },
    deleteUserChats: async (userId) => {
        const response = await axios.delete(`${CHAT_URL}/delete?userId=${userId}`);
        return response.data;
    }
};