import axios from "axios";

export const axiosClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

export const rawAxios = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// 🔐 Add Authorization if token exists (only on client)
if (typeof window !== "undefined") {
    axiosClient.interceptors.request.use((config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== "undefined") {
        try {
            const { response } = error;
            if (response?.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            }
        } catch (err) {
            console.error("Token cleanup error:", err);
        }
        }
        throw error;
    }
);
