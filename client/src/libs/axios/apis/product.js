import axios from "../axios";

export const apiGetProducts = (params) =>
    axios({
        url: "/products/",
        method: "get",
        params,
    });
export const apiCreateProduct = (data) =>
    axios({
        url: "/products/",
        method: "post",
        data,
    });

export const apiToggleActiveProduct = (id) =>
    axios({
        url: "/products/toggle-active/" + id,
        method: "put",
    });

export const apiEditProduct = (data, id) =>
    axios({
        url: "/products/" + id,
        method: "put",
        data,
    });

export const apiDeleteProduct = (id) =>
    axios({
        url: `/products/${id}`,
        method: "delete",
    });
