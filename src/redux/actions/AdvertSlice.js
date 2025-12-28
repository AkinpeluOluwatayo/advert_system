import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { advertServices } from "../../services/AdvertService.js";

// Thunks
export const createAd = createAsyncThunk(
    "ads/createAd",
    async ({ adData, token }, thunkAPI) => {
        try {
            return await advertServices.createAd(adData, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const getAdById = createAsyncThunk(
    "ads/getAdById",
    async ({ adId, token }, thunkAPI) => {
        try {
            return await advertServices.getAdById(adId, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const getAdsByUser = createAsyncThunk(
    "ads/getAdsByUser",
    async (token, thunkAPI) => {
        try {
            return await advertServices.getAdsByUser(token);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const deleteAd = createAsyncThunk(
    "ads/deleteAd",
    async ({ adId, token }, thunkAPI) => {
        try {
            return await advertServices.deleteAd(adId, token);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const getAllAds = createAsyncThunk(
    "ads/getAllAds",
    async (filters = {}, thunkAPI) => {
        try {
            return await advertServices.getAllAds(filters);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

const initialState = {
    ads: [],
    currentAd: null,
    loading: false,
    error: null,
    isSuccess: false,
};

const adsSlice = createSlice({
    name: "ads",
    initialState,
    reducers: {
        resetAdsState: (state) => {
            state.ads = [];
            state.currentAd = null;
            state.loading = false;
            state.error = null;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAd.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
            })
            .addCase(createAd.fulfilled, (state, action) => {
                state.loading = false;
                state.ads.unshift(action.payload);
                state.isSuccess = true;
            })
            .addCase(createAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAdById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAd = action.payload;
            })
            .addCase(getAdsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = action.payload;
            })
            .addCase(deleteAd.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = state.ads.filter(
                    (ad) => ad.id !== action.payload.id
                );
            })
            .addCase(getAllAds.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = action.payload.ads || action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { resetAdsState } = adsSlice.actions;
export default adsSlice.reducer;
