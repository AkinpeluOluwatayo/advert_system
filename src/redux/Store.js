import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./actions/AuthSlice";          // 👈 import auth slice
import adsReducer from "./actions/AdvertSlice";         // your adverts slice
import productReducer from "./actions/ProductSlice";    // single product slice

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ads: adsReducer,
        product: productReducer,
    },
});

export default store;
