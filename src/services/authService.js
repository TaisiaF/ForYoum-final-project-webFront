import api from "./api";

const register = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

const login = async (data) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

const verifyRegistration = async (data) => {
    const response = await api.post(
        "/auth/verify-registration",
        data
    );

    return response.data;
};

const verifyLogin = async (data) => {
    const response = await api.post(
        "/auth/verify-login",
        data
    );

    return response.data;
};

export default {
    register,
    login,
    verifyRegistration,
    verifyLogin
};