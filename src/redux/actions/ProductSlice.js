import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch a single advert for ProductDetails page
export const fetchSingleAd = createAsyncThunk(
    "product/fetchSingleAd",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            // Ensure ID has no hidden whitespace before hitting the API
            const sanitizedId = id.toString().trim();
            const res = await axios.get(`http://localhost:8080/ads/${sanitizedId}`, config);

            // Backend: res.data (Axios) -> .data (Java ApiResponse) -> .ad (Map key)
            if (res.data && res.data.data && res.data.data.ad) {
                return res.data.data.ad;
            } else {
                return rejectWithValue("Advert data missing in server response");
            }
        } catch (err) {
            // Return the specific error message from the backend (like "Invalid ID format")
            return rejectWithValue(err.response?.data?.message || err.message);
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
            })
            .addCase(fetchSingleAd.rejected, (state, action) => {
                state.loading = false;
                // Using action.payload because we used rejectWithValue
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetSingleAd } = productSlice.actions;
export default productSlice.reducer;