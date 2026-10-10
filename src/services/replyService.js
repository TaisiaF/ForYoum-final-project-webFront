import api from "./api";

const getRepliesByDiscussion = async (discussionId) => {
    const response = await api.get(
        `/replies/discussion/${discussionId}`
    );

    return response.data;
};

const createReply = async (data) => {
    const response = await api.post(
        "/replies",
        data
    );

    return response.data;
};

const updateReply = async (id, content) => {
    const response = await api.patch(
        `/replies/${id}`,
        { content }
    );

    return response.data;
};

const deleteReply = async (id) => {
    const response = await api.delete(
        `/replies/${id}`
    );

    return response.data;
};

const likeReply = async (id) => {
    const response = await api.post(
        `/replies/${id}/like`
    );

    return response.data;
};

const unlikeReply = async (id) => {
    const response = await api.delete(
        `/replies/${id}/like`
    );

    return response.data;
};

export default {
    getRepliesByDiscussion,
    createReply,
    updateReply,
    deleteReply,
    likeReply,
    unlikeReply
};