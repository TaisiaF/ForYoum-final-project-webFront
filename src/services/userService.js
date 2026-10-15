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

const updateProfilePicture = async (imageFile) => {
    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    const response = await api.patch(
        "/users/me/profile-picture",
        formData
    );

    return response.data;
};


export default {
    getUserById,
    getUserDiscussions,
    updateProfilePicture
};