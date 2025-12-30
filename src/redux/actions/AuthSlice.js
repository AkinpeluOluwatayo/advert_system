import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";

// --- USER THUNKS ---
export const signupUser = createAsyncThunk("auth/signup", async (data, thunkAPI) => {
    try {
        return await authService.signup(data);
    } catch (err) {
        // Improved error catching to handle the "User already exists" message
        const message = err.response?.data?.data?.message || err.response?.data?.message || "Signup failed";
        return thunkAPI.rejectWithValue(message);
    }
});

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try { return await authService.login(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed"); }
});

export const loginAdmin = createAsyncThunk("auth/adminLogin", async (data, thunkAPI) => {
    try { return await authService.adminLogin(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || "Admin Login failed"); }
});

export const forgotPasswordUser = createAsyncThunk("auth/forgotPassword", async (email, thunkAPI) => {
    try { return await authService.forgotPassword(email); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send link"); }
});

export const resetPasswordUser = createAsyncThunk("auth/resetPassword", async ({ token, newPassword }, thunkAPI) => {
    try { return await authService.resetPassword(token, newPassword); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || "Reset failed"); }
});

const initialState = {
    user: authService.getCurrentAuth()?.user || null,
    token: authService.getCurrentAuth()?.token || null,
    admin: authService.getCurrentAdminAuth()?.admin || null,
    adminToken: authService.getCurrentAdminAuth()?.token || null,
    loading: false,
    error: null,
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.isSuccess = false;
            state.error = null;
            state.loading = false;
        },
        fullLogout: (state) => {
            state.user = null;
            state.token = null;
            state.admin = null;
            state.adminToken = null;
            state.isSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- SIGNUP CASES (FIXED: Added these to handle successful registration) ---
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true; // This will now trigger the redirect
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // User Login Cases
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false; state.isSuccess = true;
                state.user = action.payload?.user; state.token = action.payload?.token;
            })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Admin Login Cases
            .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false; state.isSuccess = true;
                state.admin = action.payload?.admin; state.adminToken = action.payload?.token;
            })
            .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Forgot Password Cases
            .addCase(forgotPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(forgotPasswordUser.fulfilled, (state) => { state.loading = false; state.isSuccess = true; })
            .addCase(forgotPasswordUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Reset Password Cases
            .addCase(resetPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPasswordUser.fulfilled, (state) => { state.loading = false; state.isSuccess = true; })
            .addCase(resetPasswordUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { resetAuthState, fullLogout } = authSlice.actions;
export default authSlice.reducer;