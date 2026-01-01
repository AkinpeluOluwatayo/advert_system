import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../../services/ChatService";


const getErrorMessage = (error) => error.response?.data?.message || error.message || "Something went wrong";

export const createChat = createAsyncThunk(
    "chat/createChat",
    async ({ chatRequest, userId }, { rejectWithValue }) => {
        try {
            const response = await chatService.createChat(chatRequest, userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchUserChats = createAsyncThunk(
    "chat/fetchUserChats",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await chatService.getUserChats(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await chatService.getChatMessages(chatId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ request, senderId }, { rejectWithValue }) => {
        try {
            const response = await chatService.sendMessage(request, senderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const deleteAllUserChats = createAsyncThunk(
    "chat/deleteAll",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await chatService.deleteUserChats(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
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
            .addCase(fetchUserChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload || [];
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.activeMessages = action.payload || [];
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.activeMessages.push(action.payload);
            })
            .addCase(deleteAllUserChats.fulfilled, (state) => {
                state.chats = [];
                state.activeMessages = [];
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { clearChatState } = chatSlice.actions;
export default chatSlice.reducer;