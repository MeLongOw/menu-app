import axios from "../axios";

export const apiGetCategoriesByUserId = (id) =>
    axios({
        url: "/product-categories/",
        method: "get",
        params: { userId: id },
    });

export const apiAddCategory = (data) =>
    axios({
        url: "/product-categories/",
        method: "post",
        data,
    });
export const apiEditCategory = (data, id) =>
    axios({
        url: `/product-categories/${id}`,
        method: "put",
        data,
    });

export const apiSortCategory = (data) =>
    axios({
        url: "/product-categories/sort",
        method: "put",
        data,
    });

export const apiDeleteCategory = (id) =>
    axios({
        url: `/product-categories/${id}`,
        method: "delete",
    });
