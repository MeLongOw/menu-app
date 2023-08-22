import axios from "../axios";
export const apiLogin = (data) =>
    axios({
        url: "/auth/login",
        method: "post",
        data,
    });

export const apiLogout = () =>
    axios({
        url: "/auth/logout  ",
        method: "put",
    });

export const apiRegister = (data) =>
    axios({
        url: "/auth/register",
        method: "post",
        data,
    });

export const apiGetUserBySlug = (slug) =>
    axios({
        url: "users/" + slug,
        method: "get",
    });
export const apiUpdateAvatar = (data) =>
    axios({
        url: "user/avatar",
        method: "put",
        data,
    });

export const apiUpdateBackground = (data) =>
    axios({
        url: "user/background",
        method: "put",
        data,
    });

export const apiUpdateAbout = (data) =>
    axios({
        url: "user/about",
        method: "put",
        data,
    });

export const apiCreatePost = (data) =>
    axios({
        url: "user/posts",
        method: "post",
        data,
    });

export const apiUpdatePost = (data, id) =>
    axios({
        url: "user/posts/" + id,
        method: "put",
        data,
    });

export const apiDeletPost = (id) =>
    axios({
        url: "user/posts/" + id,
        method: "delete",
    });

export const apiGetGuestData = () =>
    axios({
        url: "user/guests/",
        method: "get",
    });

export const apiUpdateGuestData = (data) =>
    axios({
        url: "user/guests/",
        method: "put",
        data,
    });

export const apiGetOrderData = (params) =>
    axios({
        url: "user/orders/",
        method: "get",
        params,
    });

export const apiUpdateReadStatusOrder = (id) =>
    axios({
        url: "user/orders/read/" + id,
        method: "put",
    });

export const apiUpdateOrderStatus = (id, data) =>
    axios({
        url: "user/orders/status/" + id,
        method: "put",
        data,
    });
