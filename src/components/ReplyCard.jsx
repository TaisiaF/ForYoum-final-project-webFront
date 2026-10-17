import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import replyService from "../services/replyService";
import ReplyComposer from "./ReplyComposer";
import ProfilePicture from "./ProfilePicture";

export default function ReplyCard({
    reply,
    onLike,
    onUpdate,
    onCreateReply
}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] =
        useState(false);

    const [editContent, setEditContent] =
        useState(reply.content);

    const [isReplying, setIsReplying] =
        useState(false);

    const [replyContent, setReplyContent] =
        useState("");

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
        if (!replyContent.trim()) {
            return;
        }

        try {
            await onCreateReply(
                reply._id,
                replyContent.trim()
            );

            setReplyContent("");
            setIsReplying(false);

        } catch (error) {
            console.log(
                "CREATE REPLY ERROR",
                error
            );
        }
    };


    return (
        <div
            style={{
                marginLeft:
                    `${reply.level * 30}px`
            }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}
            >
                <ProfilePicture
                    src={reply.authorId?.profilePicture}
                    alt={`${reply.authorId?.username || "User"}'s profile picture`}
                    size={40}
                />
                
                <p>
                    {reply.authorId?._id ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/profile/${reply.authorId._id}`)
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
                            {reply.authorId.username}
                        </button>
                    ) : (
                        "Unknown user"
                    )}
                </p>
            </div>


            {isEditing ? (
                <div>
                    <textarea
                        id={`edit-reply-${reply._id}`}
                        value={editContent}
                        onChange={(event) =>
                            setEditContent(event.target.value)
                        }
                    />

                    <button
                        onClick={() =>
                            setIsEditing(false)
                        }
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            if (!editContent.trim()) {
                                return;
                            }

                            try {
                                await replyService.updateReply(
                                    reply._id,
                                    editContent.trim()
                                );

                                await onUpdate();

                                setIsEditing(false);

                            } catch (error) {
                                console.log(
                                    "UPDATE REPLY ERROR",
                                    error
                                );
                            }
                        }}
                    >
                        Save
                    </button>
                </div>
            ) : (
                <p>
                    {reply.content}
                </p>
            )}


            <p>
                {new Date(
                    reply.createdAt
                ).toLocaleDateString()}
            </p>

            <p>
                Likes: {reply.likedByCount}
            </p>

            <button
                onClick={handleReplyClick}
            >
                Reply
            </button>

            <button
                onClick={() => onLike(reply)}
            >
                Like
            </button>


            {user && (user.id === reply.authorId?._id || user.role === "admin") && (
                    <>
                        <button
                            onClick={() => {
                                setEditContent(
                                    reply.content
                                );
                                setIsEditing(true);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            onClick={async () => {
                                const confirmed =
                                    window.confirm(
                                        "Are you sure you want to delete this reply?"
                                    );

                                if (!confirmed) {
                                    return;
                                }

                                try {
                                    await replyService.deleteReply(
                                        reply._id
                                    );

                                    await onUpdate();

                                } catch (error) {
                                    console.log(
                                        "DELETE REPLY ERROR",
                                        error
                                    );
                                }
                            }}
                        >
                            Delete
                        </button>
                    </>)
            }


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