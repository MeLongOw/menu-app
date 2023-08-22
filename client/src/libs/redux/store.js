import { configureStore } from "@reduxjs/toolkit";
import { menuSlice } from "./menuSlice/menuSlice";
import storage from "redux-persist/lib/storage";
import { userSlice } from "./userSlice/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import { guestSlice } from "./guestSlice/guestSlice";

const userConfig = {
    key: "user",
    storage,
    whitelist: ["isLoggedIn", "loggedInId"],
};

const guestConfig = {
    key: "guest",
    storage,
    whitelist: ["cart", "cartOfStoreId", "name", "phone"],
};

export const store = configureStore({
    reducer: {
        menu: menuSlice.reducer,
        user: persistReducer(userConfig, userSlice.reducer),
        guest: persistReducer(guestConfig, guestSlice.reducer),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
