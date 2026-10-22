import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import discussionService from "../services/discussionService";
import replyService from "../services/replyService";
import userService from "../services/userService";

import DiscussionActions from "../components/DiscussionActions";
import DiscussionEditForm from "../components/DiscussionEditForm";
import ReplyComposer from "../components/ReplyComposer";
import ProfilePicture from "../components/ProfilePicture";
import ReplyThread from "../components/ReplyThread";

import { useAuth } from "../context/AuthContext";


export default function Discussion() {

    const { id } = useParams();

    const { user } = useAuth();

    const navigate = useNavigate();

    const [discussion, setDiscussion] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(false);

    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle] = useState("");

    const [editContent, setEditContent] = useState("");

    const [editCategory, setEditCategory] = useState("");

    const [replies, setReplies] = useState([]);

    const [replyContent, setReplyContent] = useState("");

    const [loading, setLoading] = useState(true);


    const loadReplies = async () => {
        const repliesResponse =
            await replyService.getRepliesByDiscussion(id);

        setReplies(repliesResponse);
    };;


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


    const handleToggleBookmark = async () => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        if (bookmarkLoading) return;

        setBookmarkLoading(true);

        try {
            if (isBookmarked) {
                await discussionService.unbookmarkDiscussion(
                    discussion._id
                );
                setIsBookmarked(false);
            } else {
                await discussionService.bookmarkDiscussion(
                    discussion._id
                );
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error("BOOKMARK DISCUSSION ERROR", error);
        } finally {
            setBookmarkLoading(false);
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

                if (user) {
                    const bookmarks = await userService.getMyBookmarks();

                    setIsBookmarked(
                        bookmarks.some(
                            (bookmark) => bookmark._id === response._id
                        )
                    );
                } else {
                    setIsBookmarked(false);
                }

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

    }, [id, user?.id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!discussion) {
        return <p>Discussion not found.</p>;
    }




    return (
        <div>
            
            <div 
                style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ProfilePicture
                    src={discussion.authorId?.profilePicture}
                    alt={`${discussion.authorId?.username || "Author"}'s profile picture`}
                    size={40}
            />

                <p>
                    Author:{" "}
                    {discussion.authorId?._id ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/profile/${discussion.authorId._id}`)
                            }
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                                font: "inherit"
                            }}
                        >
                            {discussion.authorId.username}
                        </button>
                    ) : (
                        "Unknown user"
                    )}
                </p>
            </div>

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

                    {discussion.image && (
                        <img
                            src={discussion.image}
                            alt={`Image attached to ${discussion.title}`}
                            style={{
                                display: "block",
                                maxWidth: "100%",
                                maxHeight: "600px",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                                margin: "16px 0"
                            }}
                        />
                    )}

                    <p>
                        {discussion.content}
                    </p>
                </>
            )}

            <p>
                Category: {discussion.category}
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

            <button
                type="button"
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
            >
                {bookmarkLoading
                    ? "Updating..."
                    : isBookmarked
                        ? "Remove Bookmark"
                        : "Bookmark"}
            </button>

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

            <ReplyThread
                replies={replies}
                onLike={handleLikeReply}
                onUpdate={handleUpdateReply}
                onCreateReply={handleCreateReply}
            />

        </div>
    );
}