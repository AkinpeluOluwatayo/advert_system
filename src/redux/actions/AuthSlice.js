import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_URL = "http://localhost:8080/auth";

// 1. SIGNUP ACTION
export const signupUser = createAsyncThunk(
    "auth/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${AUTH_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Signup Failed");
        }
    }
);

// 2. LOGIN ACTION
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${AUTH_URL}/login`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login Failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        isSuccess: false,
    },
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.isSuccess = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            // SIGNUP
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
                state.isSuccess = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // LOGIN
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;

                const userData = action.payload.data?.user || action.payload.user;
                const tokenData = action.payload.data?.token || action.payload.token;

                if (tokenData) {
                    state.user = userData;
                    state.token = tokenData;
                    localStorage.setItem("token", tokenData);
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;