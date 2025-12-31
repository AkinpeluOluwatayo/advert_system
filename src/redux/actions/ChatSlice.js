import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../../services/ChatService";

// 1. Create a New Chat (Added this for ProductDetails)
export const createChat = createAsyncThunk(
    "chat/createChat",
    async ({ chatRequest, userId }, { rejectWithValue }) => {
        try {
            const response = await chatService.createChat(chatRequest, userId);
            return response.data; // This is the ChatsResponse object
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 2. Fetch User's Conversation List
export const fetchUserChats = createAsyncThunk(
    "chat/fetchUserChats",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await chatService.getUserChats(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 3. Fetch Messages for a specific chat
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await chatService.getChatMessages(chatId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// 4. Send a new message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ request, senderId }, { rejectWithValue }) => {
        try {
            const response = await chatService.sendMessage(request, senderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        activeMessages: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearChatState: (state) => {
            state.activeMessages = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Chat
            .addCase(createChat.pending, (state) => { state.loading = true; })
            .addCase(createChat.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new chat to the top of the list if it's not already there
                const exists = state.chats.find(c => (c.id || c._id) === (action.payload.id || action.payload._id));
                if (!exists) {
                    state.chats.unshift(action.payload);
                }
            })
            .addCase(createChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Chats
            .addCase(fetchUserChats.pending, (state) => { state.loading = true; })
            .addCase(fetchUserChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload || [];
            })
            .addCase(fetchUserChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Messages
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.activeMessages = action.payload || [];
            })
            // Send Message
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.activeMessages.push(action.payload);
            });
    }
});

export const { clearChatState } = chatSlice.actions;
export default chatSlice.reducer;