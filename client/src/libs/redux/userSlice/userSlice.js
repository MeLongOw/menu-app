import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "./asyncThunk";
const initialState = {
    id: null,
    name: "",
    phone: "",
    avatar: "",
    background: "",
    email: "",
    posts: [],
    about: "",
    slug: "",
    loggedInId: null,
    isLoading: false,
    isLoggedIn: false,
    isEditMode: false,
    isExistUser: true,
    isFindingUser: false,
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loggedIn: (state, action) => {
            state.isLoggedIn = true;
            state.loggedInId = action.payload;
        },
        logOut: (state, action) => {
            state.id = null;
            state.isLoggedIn = false;
            state.loggedInId = null;
        },
        toggleEditMode: (state) => {
            state.isEditMode = !state.isEditMode;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCurrentUser.pending, (state) => {
            state.isFindingUser = true;
            state.isLoading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.isFindingUser = false;
            state.isLoading = false;
            const { id, name, phone, avatar, background, about, posts } =
                action.payload.data;
            state.id = id;
            state.name = name;
            state.phone = phone;
            state.avatar = avatar;
            state.background = background;
            state.about = about;
            state.posts = posts;
        });
        builder.addCase(getCurrentUser.rejected, (state, action) => {
            state.isFindingUser = false;
            state.isLoading = false;
            state.isExistUser = false;
        });
    },
});
