import api from "./api";


const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

const getUserDiscussions = async (id) => {
    const response = await api.get(
        `/users/${id}/discussions`
    );
    return response.data;
};


const updateUsername = async (username) => {
    const response = await api.patch("/users/me/username", {
        username
    });

    return response.data;
};

const updateEmail = async (email, password) => {
    const response = await api.patch("/users/me/email", {
        email,
        password
    });

    return response.data;
};

const updatePassword = async (oldPassword, newPassword) => {
    const response = await api.patch("/users/me/password", {
        oldPassword,
        newPassword
    });

    return response.data;
};

const updateProfilePicture = async (imageFile) => {
    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    const response = await api.patch(
        "/users/me/profile-picture",
        formData
    );
    return response.data;
};


const banUser = async (id) => {
    const response = await api.patch(`/users/${id}/ban`);
    return response.data;
};

const unbanUser = async (id) => {
    const response = await api.patch(`/users/${id}/unban`);
    return response.data;
};


const deleteUserById = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
    };

const deleteMyAccount = async () => {
    const response = await api.delete("/users/me");
    return response.data;
    };




export default {
    getUserById,
    getUserDiscussions,
    updateProfilePicture,
    updateUsername,
    updateEmail,
    updatePassword,
    banUser,
    unbanUser,
    deleteUserById,
    deleteMyAccount
};