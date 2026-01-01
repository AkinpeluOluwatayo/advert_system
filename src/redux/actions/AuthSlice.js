import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";

// 1. SIGNUP ACTION
export const signupUser = createAsyncThunk(
    "auth/signup",
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.signup(userData);
        } catch (error) {
            return rejectWithValue(error.message || "Signup Failed");
        }
    }
);

// 2. LOGIN ACTION
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.login(userData);
        } catch (error) {
            return rejectWithValue(error.message || "Login Failed");
        }
    }
);

// 3. ADMIN LOGIN ACTION
export const loginAdmin = createAsyncThunk(
    "auth/adminLogin",
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.adminLogin(userData);
        } catch (error) {
            return rejectWithValue(error.message || "Admin Login Failed");
        }
    }
);

// 4. LOGOUT ACTION
export const logoutUser = createAsyncThunk("auth/logout", async () => {
    authService.logout();
});

// 5. ADMIN LOGOUT ACTION
export const logoutAdmin = createAsyncThunk("auth/adminLogout", async () => {
    authService.adminLogout();
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: authService.getCurrentAuth()?.user || null,
        token: authService.getCurrentAuth()?.token || null,
        admin: authService.getCurrentAdminAuth()?.user || null,
        adminToken: authService.getCurrentAdminAuth()?.token || null,
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
    },
    extraReducers: (builder) => {
        builder
            // SIGNUP
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ADMIN LOGIN
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.admin = action.payload.admin || action.payload.user;
                state.adminToken = action.payload.token;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = false;
            })
            // ADMIN LOGOUT
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.adminToken = null;
                state.isSuccess = false;
            });
    }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;