import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async () => {
        const res = await axios.get("https://dummyjson.com/products");
        return res.data.products;
    }
);

// Fetch single product
export const fetchSingleProduct = createAsyncThunk(
    "products/fetchOne",
    async (id) => {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        return res.data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        singleProduct: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // All products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Single product
            .addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default productSlice.reducer;
