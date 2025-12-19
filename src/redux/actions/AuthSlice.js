import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";

/* ------------------ THUNKS ------------------ */
export const signupUser = createAsyncThunk(
    "auth/signup",
    async (data, thunkAPI) => {
        try {
            return await authService.signup(data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            return await authService.login(data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async () => {
        await authService.logout();
    }
);

/* ------------------ INITIAL STATE ------------------ */
const initialState = {
    user: authService.getCurrentAuth()?.user || null,
    token: authService.getCurrentAuth()?.token || null,
    loading: false,
    error: null,
    isSuccess: false,
};

/* ------------------ SLICE ------------------ */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.isSuccess = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isSuccess = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isSuccess = false;
            })

            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isSuccess = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isSuccess = false;
            })

            // logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = false;
            });
    },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;