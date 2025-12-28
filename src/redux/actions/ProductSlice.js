import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch a single advert for ProductDetails page
export const fetchSingleAd = createAsyncThunk(
    "product/fetchSingleAd",
    async ({ id, token }) => {
        const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        const res = await axios.get(`http://localhost:8080/ads/${id}`, config);
        return res.data.data.ad;
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        singleAd: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetSingleAd: (state) => {
            state.singleAd = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingleAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleAd.fulfilled, (state, action) => {
                state.loading = false;
                state.singleAd = action.payload;
            })
            .addCase(fetchSingleAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetSingleAd } = productSlice.actions;
export default productSlice.reducer;