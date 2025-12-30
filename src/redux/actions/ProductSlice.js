import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSingleAd = createAsyncThunk(
    "product/fetchSingleAd",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            if (!id) return rejectWithValue("Product ID is missing");

            // STRICTOR SANITIZATION:
            // 1. Convert to string and split at colon (removes :1)
            // 2. replace(/[^a-fA-F0-9]/g, "") keeps ONLY Hexadecimal characters
            const sanitizedId = id.toString().split(':')[0].replace(/[^a-fA-F0-9]/g, "").trim();

            console.log("DEBUG: FINAL CLEAN ID ->", sanitizedId);

            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            const res = await axios.get(`http://localhost:8080/ads/${sanitizedId}`, config);

            if (res.data && res.data.data && res.data.data.ad) {
                return res.data.data.ad;
            } else {
                return rejectWithValue("Advert data missing in server response");
            }
        } catch (err) {
            const message = err.response?.data?.data?.message || err.response?.data?.message || err.message;
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