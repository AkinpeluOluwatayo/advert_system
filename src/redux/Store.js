import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/actions/AuthSlice.js";
import productsReducer from "./actions/ViewAllAdvertSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
    },
});

export default store;
