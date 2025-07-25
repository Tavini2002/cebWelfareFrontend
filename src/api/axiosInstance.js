import { BASE_URL } from "@/constants";
import axios from "axios";

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { api as API };
