import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import replyService from "../services/replyService";
import ReplyComposer from "./ReplyComposer";
import ProfilePicture from "./ProfilePicture";
import Button from "./Button";
import "./ReplyCard.css";

export default function ReplyCard({
    reply,
    onLike,
    onUpdate,
    onCreateReply
}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReplyClick = () => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        setIsReplying(true);
    };

    const handleCancelReply = () => {
        setReplyContent("");
        setIsReplying(false);
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return;

        try {
            await onCreateReply(reply._id, replyContent.trim());
            setReplyContent("");
            setIsReplying(false);
        } catch (error) {
            console.log("CREATE REPLY ERROR", error);
        }
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;

        try {
            await replyService.updateReply(
                reply._id,
                editContent.trim()
            );
            await onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.log("UPDATE REPLY ERROR", error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this reply?"
        );

        if (!confirmed) return;

        try {
            await replyService.deleteReply(reply._id);
            await onUpdate();
        } catch (error) {
            console.log("DELETE REPLY ERROR", error);
        }
    };

    const canManageReply =
        user &&
        (user.id === reply.authorId?._id || user.role === "admin");

    return (
        <div className="reply-card">
            <div className="reply-card__header">
                <ProfilePicture
                    src={reply.authorId?.profilePicture}
                    alt={`${reply.authorId?.username || "User"}'s profile picture`}
                    size={40}
                />

                <div className="reply-card__author">
                    {reply.authorId?._id ? (
                        <button
                            type="button"
                            className="reply-card__author-link"
                            onClick={() =>
                                navigate(`/profile/${reply.authorId._id}`)
                            }
                        >
                            {reply.authorId.username}
                        </button>
                    ) : (
                        <span className="reply-card__unknown-author">
                            Unknown user
                        </span>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="reply-card__edit">
                    <label
                        className="reply-card__edit-label"
                        htmlFor={`edit-reply-${reply._id}`}
                    >
                        Edit reply
                    </label>

                    <textarea
                        id={`edit-reply-${reply._id}`}
                        className="reply-card__edit-textarea"
                        value={editContent}
                        onChange={(event) =>
                            setEditContent(event.target.value)
                        }
                        rows={4}
                    />

                    <div className="reply-card__edit-actions">
                        <Button onClick={handleSaveEdit}>
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditContent(reply.content);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="reply-card__content">
                    {reply.content}
                </p>
            )}

            <div className="reply-card__metadata">
                <span>
                    {new Date(reply.createdAt).toLocaleDateString()}
                </span>
                <span className="reply-card__metadata-separator">
                    ·
                </span>
                <span>Likes: {reply.likedByCount}</span>
            </div>

            <div className="reply-card__actions">
                <Button variant="secondary" onClick={handleReplyClick}>
                    Reply
                </Button>

                <Button variant="secondary" onClick={() => onLike(reply)}>
                    {reply.likedBy?.includes(user?.id) ? "Unlike" : "Like"}
                </Button>

                {canManageReply && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditContent(reply.content);
                                setIsEditing(true);
                            }}
                        >
                            Edit
                        </Button>

                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </div>

            {isReplying && (
                <ReplyComposer
                    content={replyContent}
                    setContent={setReplyContent}
                    onCancel={handleCancelReply}
                    onSubmit={handleSubmitReply}
                />
            )}
        </div>
    );
}
