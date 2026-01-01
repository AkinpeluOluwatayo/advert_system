import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/AuthServices.js";


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

export const forgotPasswordUser = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            return await authService.forgotPassword(email);
        } catch (error) {
            return rejectWithValue(error.message || "Request Failed");
        }
    }
);

export const resetPasswordUser = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            return await authService.resetPassword(token, newPassword);
        } catch (error) {
            return rejectWithValue(error.message || "Reset Failed");
        }
    }
);


export const logoutUser = createAsyncThunk("auth/logout", async () => {
    authService.logout();
});


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
        message: null,
    },
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.isSuccess = false;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder

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

            .addCase(forgotPasswordUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPasswordUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.message = "Password reset instructions sent to your email.";
            })
            .addCase(forgotPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(resetPasswordUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.message = "Password has been reset successfully!";
            })
            .addCase(resetPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = false;
            })

            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.adminToken = null;
                state.isSuccess = false;
            });
    }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;