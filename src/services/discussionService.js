import api from "./api";


const createDiscussion = async ({ title, content, category, image }) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (image) {
        formData.append("image", image);
    }

    const response = await api.post(
        "/discussions",
        formData
    );

    return response.data;
};


const getDiscussions = async ({
    page = 1,
    limit = 10,
    category = "",
    search = "",
    sort = "newest",
    after = "",
    before = ""
}) => {

    const response = await api.get(
        "/discussions",
        {
            params: {
                page,
                limit,
                category: category || undefined,
                search: search || undefined,
                sort,
                after: after || undefined,
                before: before || undefined
            }
        }
    );

    return response.data;
};


const getDiscussionById = async (id) => {

    const response = await api.get(
        `/discussions/${id}`
    );

    return response.data;
};


const updateDiscussion = async (id, data) => {
    const response = await api.patch(
        `/discussions/${id}`,
        data
    );

    return response.data;
};

const deleteDiscussion = async (id) => {
    const response = await api.delete(
        `/discussions/${id}`
    );

    return response.data;
};


const likeDiscussion = async (id) => {
    const response = await api.post(
        `/discussions/${id}/like`
    );

    return response.data;
};

const unlikeDiscussion = async (id) => {
    const response = await api.delete(
        `/discussions/${id}/like`
    );

    return response.data;
};



export default {
    createDiscussion,
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,
    likeDiscussion,
    unlikeDiscussion
};