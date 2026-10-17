
import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

let banRedirecting = false;

client.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

client.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (
            status === 403 &&
            typeof message === "string" &&
            message.toLowerCase() === "your account has been banned" &&
            !banRedirecting
        ) {
            banRedirecting = true;

            // Clear the stored authentication data.
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Inform the user, then return to the home page.
            window.alert("Your account is banned. You have been logged out.");
            window.location.assign("/");
        }

        return Promise.reject(error);
    }
);

export default client;
