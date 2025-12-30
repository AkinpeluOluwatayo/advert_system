import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";

export const signupUser = createAsyncThunk("auth/signup", async (data, thunkAPI) => {
    try { return await authService.signup(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try { return await authService.login(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const loginAdmin = createAsyncThunk("auth/adminLogin", async (data, thunkAPI) => {
    try { return await authService.adminLogin(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
    authService.logout();
    thunkAPI.dispatch(resetAuthState());
});

export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async (_, thunkAPI) => {
    authService.adminLogout();
    thunkAPI.dispatch(resetAuthState());
});

const currentUserAuth = authService.getCurrentAuth();
const currentAdminAuth = authService.getCurrentAdminAuth();

const initialState = {
    user: currentUserAuth?.user || null,
    token: currentUserAuth?.token || null,
    admin: currentAdminAuth?.admin || currentAdminAuth?.user || null,
    adminToken: currentAdminAuth?.token || null,
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
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* --- Login --- */
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isSuccess = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* --- Admin Login --- */
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.admin = action.payload.admin || action.payload.user;
                state.adminToken = action.payload.token;
                state.isSuccess = true;
            });
    },
});

export const { resetAuthState, fullLogout } = authSlice.actions;
export default authSlice.reducer;