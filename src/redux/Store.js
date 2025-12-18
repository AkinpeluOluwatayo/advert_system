import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./actions/UserLoginSlice";
import productsReducer from "./actions/ViewAllAdvertSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer, // 👈 adverts/products slice
    },
});

export default store;
