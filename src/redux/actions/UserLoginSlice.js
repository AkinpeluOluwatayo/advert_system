import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users");
            const users = response.data;

            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return thunkAPI.rejectWithValue("Wrong email or password");
            }

            return user;
        } catch (err) {
            return thunkAPI.rejectWithValue("Something went wrong. Please try again");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: { user: null, loading: false, error: null },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;
