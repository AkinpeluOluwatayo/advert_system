import axios from "axios";

// Base URLs matching your Spring Boot @RequestMapping
const CHAT_URL = "http://localhost:8080/chat";
const MSG_URL = "http://localhost:8080/messages";

/**
 * AXIOS INTERCEPTOR
 * This automatically injects the JWT token from localStorage into the
 * Authorization header of every request sent via axios.
 */
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
    /**
     * Creates a new chat room between buyer and seller for a product
     * Matches Java: @PostMapping("/create") @RequestParam("userId")
     */
    createChat: async (chatRequest, userId) => {
        try {
            const response = await axios.post(`${CHAT_URL}/create?userId=${userId}`, chatRequest);
            return response.data; // Returns ApiResponse<ChatsResponse>
        } catch (error) {
            throw error.response?.data?.message || "Failed to create chat";
        }
    },

    /**
     * Gets all conversations for the logged-in user
     * Matches Java: @GetMapping("/user/{userId}")
     */
    getUserChats: async (userId) => {
        try {
            const response = await axios.get(`${CHAT_URL}/user/${userId}`);
            return response.data; // Returns ApiResponse<List<ChatsResponse>>
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch chats";
        }
    },

    /**
     * Gets a specific chat by ID
     * Matches Java: @GetMapping("/{chatId}")
     */
    getChatById: async (chatId) => {
        try {
            const response = await axios.get(`${CHAT_URL}/${chatId}`);
            return response.data; // Returns ApiResponse<ChatsResponse>
        } catch (error) {
            throw error.response?.data?.message || "Chat not found";
        }
    },

    /**
     * Fetches all message bubbles for a specific chat room
     * Matches Java: @GetMapping("/chat/{chatId}")
     */
    getChatMessages: async (chatId) => {
        try {
            const response = await axios.get(`${MSG_URL}/chat/${chatId}`);
            return response.data; // Returns ApiResponse<List<MessagesResponse>>
        } catch (error) {
            throw error.response?.data?.message || "Failed to load messages";
        }
    },

    /**
     * Sends a new message to a chat
     * Matches Java: @PostMapping("/send") @RequestParam("senderId")
     */
    sendMessage: async (messageRequest, senderId) => {
        try {
            const response = await axios.post(`${MSG_URL}/send?senderId=${senderId}`, messageRequest);
            return response.data; // Returns ApiResponse<MessagesResponse>
        } catch (error) {
            throw error.response?.data?.message || "Message failed to send";
        }
    },

    /**
     * Deletes all chats for a user
     * Matches Java: @DeleteMapping("/delete") @RequestParam("userId")
     */
    deleteUserChats: async (userId) => {
        try {
            const response = await axios.delete(`${CHAT_URL}/delete?userId=${userId}`);
            return response.data; // Returns ApiResponse<String>
        } catch (error) {
            throw error.response?.data?.message || "Delete failed";
        }
    }
};