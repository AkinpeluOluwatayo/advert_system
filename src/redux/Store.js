import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./actions/AuthSlice";
import adsReducer from "./actions/AdvertSlice";
import productReducer from "./actions/ProductSlice";
import chatReducer from "./actions/ChatSlice"; // 👈 Add this

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ads: adsReducer,
        product: productReducer,
        chat: chatReducer, // 👈 Register it here
    },
});

export default store;