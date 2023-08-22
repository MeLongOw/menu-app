import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetUserBySlug } from "src/libs/axios/apis";

export const getCurrentUser = createAsyncThunk(
    "user/current",
    async (slug, { rejectWithValue }) => {
        const response = await apiGetUserBySlug(slug);
        if (!response.success) return rejectWithValue(response);
        return response;
    }
);
