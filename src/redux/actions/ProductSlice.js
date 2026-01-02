import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const RENDER_BASE_URL = "https://dealbridges-connect-yy4x.onrender.com";

export const fetchSingleAd = createAsyncThunk(
    "product/fetchSingleAd",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            if (!id) return rejectWithValue("Product ID is missing");


            let sanitizedId = id.toString().split(':')[0];
            sanitizedId = sanitizedId.replace(/[^a-fA-F0-9]/g, "").trim();

            console.log("DEBUG: FINAL CLEAN ID ->", sanitizedId);

            const config = {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    "Content-Type": "application/json"
                }
            };


            const url = `${RENDER_BASE_URL}/ads/${sanitizedId}`;
            const res = await axios.get(url, config);

            if (res.data && res.data.data && res.data.data.ad) {
                return res.data.data.ad;
            } else {
                return rejectWithValue("Advert data missing in server response");
            }
        } catch (err) {
            const message = err.response?.data?.data?.message ||
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch product";
            return rejectWithValue(message);
        }
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
                state.error = null;
            })
            .addCase(fetchSingleAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetSingleAd } = productSlice.actions;
export default productSlice.reducer;