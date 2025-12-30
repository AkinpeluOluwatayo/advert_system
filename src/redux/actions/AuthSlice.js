import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";

// --- SIGNUP THUNK ---
export const signupUser = createAsyncThunk("auth/signup", async (data, thunkAPI) => {
    try {
        return await authService.signup(data);
    } catch (err) {
        // Handle specific registration errors
        const message = err.response?.data?.message || err.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// --- USER LOGIN THUNK ---
export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {
        return await authService.login(data);
    } catch (err) {
        // Intercept 401 Unauthorized for custom message
        if (err.response && err.response.status === 401) {
            return thunkAPI.rejectWithValue("Wrong Login details. Please try again.");
        }
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Connection failed.");
    }
});

// --- ADMIN LOGIN THUNK ---
export const loginAdmin = createAsyncThunk("auth/adminLogin", async (data, thunkAPI) => {
    try {
        return await authService.adminLogin(data);
    } catch (err) {
        if (err.response && err.response.status === 401) {
            return thunkAPI.rejectWithValue("Invalid Admin credentials.");
        }
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Admin login failed.");
    }
});

// --- LOGOUT ACTIONS ---
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
    authService.logout();
    thunkAPI.dispatch(fullLogout());
});

export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async (_, thunkAPI) => {
    authService.adminLogout();
    thunkAPI.dispatch(fullLogout());
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
            /* --- Signup --- */
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.user = action.payload?.user;
                state.token = action.payload?.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* --- User Login --- */
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user;
                state.token = action.payload?.token;
                state.isSuccess = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* --- Admin Login --- */
            .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload?.admin || action.payload?.user;
                state.adminToken = action.payload?.token;
                state.isSuccess = true;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAuthState, fullLogout } = authSlice.actions;
export default authSlice.reducer;