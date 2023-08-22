import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { apiGetCategoriesByUserId, apiGetProducts } from "src/libs/axios/apis";

export const getCategories = createAsyncThunk(
    "menu/categories",
    async (id, { rejectWithValue }) => {
        const response = await apiGetCategoriesByUserId(id);
        if (!response.success) return rejectWithValue(response);
        return response;
    }
);

export const getProducts = createAsyncThunk(
    "menu/products",
    async (params, { rejectWithValue, getState }) => {
        const { id } = getState().user;
        if (id) {
            const response = await apiGetProducts({ id });
            if (!response.success) return rejectWithValue(response);
            return response;
        }
    }
);