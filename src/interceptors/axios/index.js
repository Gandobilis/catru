import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,

    headers: {
        "ngrok-skip-browser-warning": "true",

    },
});

export default axiosInstance;
