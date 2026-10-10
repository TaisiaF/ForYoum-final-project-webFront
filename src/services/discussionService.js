import api from "./api";


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
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,
    likeDiscussion,
    unlikeDiscussion
};