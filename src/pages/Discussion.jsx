import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import discussionService from "../services/discussionService";
import replyService from "../services/replyService";

import flattenReplies from "../utils/flattenReplies";

import ReplyCard from "../components/ReplyCard";
import DiscussionActions from "../components/DiscussionActions";
import DiscussionEditForm from "../components/DiscussionEditForm";
import ReplyComposer from "../components/ReplyComposer";

import { useAuth } from "../context/AuthContext";


export default function Discussion() {

    const { id } = useParams();

    const { user } = useAuth();

    const navigate = useNavigate();

    const [discussion, setDiscussion] =
        useState(null);

    const [isEditing, setIsEditing] =
    useState(false);

    const [editTitle, setEditTitle] =
        useState("");

    const [editContent, setEditContent] =
        useState("");

    const [editCategory, setEditCategory] =
    useState("");

    const [replies, setReplies] =
        useState([]);

    const [replyContent, setReplyContent] = useState("");

    const [loading, setLoading] =
        useState(true);


    const loadReplies = async () => {
        const repliesResponse =
            await replyService.getRepliesByDiscussion(id);

        setReplies(
            flattenReplies(repliesResponse)
        );
    };


    const handleLikeDiscussion = async () => {

        if (!user) {
            navigate("/auth/login");
            return;
        }

        try {

            if (discussion.likedBy.includes(user.id)) {

                await discussionService
                    .unlikeDiscussion(discussion._id);

            } else {

                await discussionService
                    .likeDiscussion(discussion._id);
            }

            const updatedDiscussion =
                await discussionService
                    .getDiscussionById(id);

            setDiscussion(updatedDiscussion);

        } catch (error) {

            console.log(
                "LIKE DISCUSSION ERROR",
                error
            );
        }
    };


    const handleEditDiscussion = () => {
        setEditTitle(discussion.title);
        setEditCategory(discussion.category);
        setEditContent(discussion.content);
        setIsEditing(true);
    };


    const handleSaveDiscussion = async () => {
        if (
            !editTitle.trim() ||
            !editContent.trim()
        ) {
            return;
        }

        try {
            await discussionService.updateDiscussion(
                discussion._id,
                {
                    title: editTitle.trim(),
                    category: editCategory,
                    content: editContent.trim()
                }
            );

            const updatedDiscussion =
                await discussionService.getDiscussionById(id);

            setDiscussion(updatedDiscussion);
            setIsEditing(false);
        } catch (error) {
            console.log(
                "UPDATE DISCUSSION ERROR",
                error
            );
        }
    };


    const handleDeleteDiscussion = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this discussion?"
            )
        ) {
            return;
        }

        try {
            await discussionService.deleteDiscussion(
                discussion._id
            );

            navigate("/");
        } catch (error) {
            console.log(
                "DELETE DISCUSSION ERROR",
                error
            );
        }
    };


    const handleCreateReply = async (
        parentId,
        content
    ) => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        if (!content.trim()) {
            return;
        }

        try {
            await replyService.createReply({
                discussionId: id,
                content: content.trim(),
                parentId
            });

        await loadReplies();
        setReplyContent("");

        } catch (error) {
            console.log(
                "CREATE REPLY ERROR",
                error
            );
        }
    };


    const handleLikeReply = async (reply) => {

        if (!user) {
            navigate("/auth/login");
            return;
        }

        try {

            if (reply.likedBy.includes(user.id)) {

                await replyService
                    .unlikeReply(reply._id);

            } else {

                await replyService
                    .likeReply(reply._id);
            }

            await loadReplies();

        } catch (error) {

            console.log(
                "LIKE REPLY ERROR",
                error
            );
        }
    };


    const handleUpdateReply = async () => {
        try {
            await loadReplies();

        } catch (error) {
            console.log(
                "REFRESH REPLIES ERROR",
                error
            );
        }
    };


    useEffect(() => {

        const loadDiscussion = async () => {

            try {

                const response =
                    await discussionService
                        .getDiscussionById(id);

                setDiscussion(response);

                await loadReplies();

            } catch (error) {

                console.log(
                    "LOAD DISCUSSION ERROR",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadDiscussion();

    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!discussion) {
        return <p>Discussion not found.</p>;
    }

    


    return (
        <div>

            {isEditing ? (
                <DiscussionEditForm
                    title={editTitle}
                    category={editCategory}
                    content={editContent}
                    setTitle={setEditTitle}
                    setCategory={setEditCategory}
                    setContent={setEditContent}
                    onSave={handleSaveDiscussion}
                    onCancel={() => setIsEditing(false)}
                />

            ) : (
                <>
                    <h1>
                        {discussion.title}
                    </h1>

                    <p>
                        {discussion.content}
                    </p>
                </>
            )}

            <p>
                Category: {discussion.category}
            </p>

            <p>
                Author: {discussion.authorId.username}
            </p>

            <p>
                Date:{" "}
                {new Date(
                    discussion.createdAt
                ).toLocaleDateString()}
            </p>

            <DiscussionActions
                discussion={discussion}
                onLike={handleLikeDiscussion}
                onEdit={handleEditDiscussion}
                onDelete={handleDeleteDiscussion}
            />

            <p>
                Likes: {discussion.likedBy.length}
            </p>

            <ReplyComposer
                content={replyContent}
                setContent={setReplyContent}
                onCancel={() => setReplyContent("")}
                onSubmit={() =>
                    handleCreateReply(null, replyContent)
                }
            />

            <h2>
                Replies
            </h2>

            {replies.map((reply) => (
                <ReplyCard
                    key={reply._id}
                    reply={reply}
                    onLike={handleLikeReply}
                    onUpdate={handleUpdateReply}
                    onCreateReply={handleCreateReply}
                />
            ))}

        </div>
    );
}