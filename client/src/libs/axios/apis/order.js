import axios from "../axios";
export const apiCreateOrder = (data) =>
    axios({
        url: "/orders",
        method: "post",
        data,
    });

export const apiCheckOrderStatus = (id) =>
    axios({
        url: "/orders/status/" + id,
        method: "get",
    });
