import { createSlice } from "@reduxjs/toolkit";
import { getCategories, getProducts } from "./asyncThunk";
// import { getCategories } from "./asyncThunk";

const initialState = {
    categories: [],
    products: [],
    isCartOpen: false,
    isLoading: false,
    isOpenMenuForm: false,
    isOpenMenuDetail: false,
    edittingProduct: null,
};
export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        openMenuForm: (state) => {
            state.isOpenMenuForm = true;
        },
        closeMenuForm: (state) => {
            state.isOpenMenuForm = false;
        },
        openMenuDetailItem: (state) => {
            state.isOpenMenuDetail = true;
        },
        closeMenuDetailItem: (state) => {
            state.isOpenMenuDetail = false;
        },
        setEditProduct: (state, action) => {
            state.edittingProduct = action.payload;
        },
    },
    extraReducers: (builder) => {
        //category
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload.data;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.isLoading = false;
        });
        //product
        builder.addCase(getProducts.pending, (state) => {
            // state.isLoading = true;
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            // state.isLoading = false;
            state.products = action.payload.data;
        });
        builder.addCase(getProducts.rejected, (state, action) => {
            // state.isLoading = false;
        });
    },
});
