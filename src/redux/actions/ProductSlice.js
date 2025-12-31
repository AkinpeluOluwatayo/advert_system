import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSingleAd = createAsyncThunk(
    "product/fetchSingleAd",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            if (!id) return rejectWithValue("Product ID is missing");

            // 1. Convert to string and strip anything after a colon (fixes :1 issues)
            let sanitizedId = id.toString().split(':')[0];

            // 2. Remove any characters that are not Hexadecimal (fixes %20 or hidden symbols)
            sanitizedId = sanitizedId.replace(/[^a-fA-F0-9]/g, "").trim();

            console.log("DEBUG: FINAL CLEAN ID ->", sanitizedId);

            const config = {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    "Content-Type": "application/json"
                }
            };

            // 3. Ensure no trailing slashes or colons in the final URL string
            const url = `http://localhost:8080/ads/${sanitizedId}`;
            const res = await axios.get(url, config);

            if (res.data && res.data.data && res.data.data.ad) {
                return res.data.data.ad;
            } else {
                return rejectWithValue("Advert data missing in server response");
            }
        } catch (err) {
            // Handle different error structures from your ApiResponse
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