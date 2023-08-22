import axios from "axios";

const instance = axios.create({
    // baseURL: `${process.env.API_BASE_URL}/api/v1`,
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const { response } = error;
        if (response?.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
        }
        console.error(error);
        return error.response.data;
    }
);

export default instance;
