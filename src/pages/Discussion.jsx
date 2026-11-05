
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
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";

import "./Discussion.css";

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
    const [isReplying, setIsReplying] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadReplies = async () => {
        const repliesResponse =
            await replyService.getRepliesByDiscussion(id);

        setReplies(repliesResponse);
    };

    const handleLikeDiscussion = async () => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        try {
            if (discussion.likedBy.includes(user.id)) {
                await discussionService.unlikeDiscussion(discussion._id);
            } else {
                await discussionService.likeDiscussion(discussion._id);
            }

            const updatedDiscussion =
                await discussionService.getDiscussionById(id);

            setDiscussion(updatedDiscussion);
        } catch (error) {
            console.log("LIKE DISCUSSION ERROR", error);
        }
    };

     const handleReplyClick = () => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        setIsReplying(true);
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
                await discussionService.unbookmarkDiscussion(discussion._id);
                setIsBookmarked(false);
            } else {
                await discussionService.bookmarkDiscussion(discussion._id);
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
        if (!editTitle.trim() || !editContent.trim()) {
            return;
        }

        try {
            await discussionService.updateDiscussion(discussion._id, {
                title: editTitle.trim(),
                category: editCategory,
                content: editContent.trim()
            });

            const updatedDiscussion =
                await discussionService.getDiscussionById(id);

            setDiscussion(updatedDiscussion);
            setIsEditing(false);
        } catch (error) {
            console.log("UPDATE DISCUSSION ERROR", error);
        }
    };

    const handleDeleteDiscussion = async () => {
        if (!window.confirm("Are you sure you want to delete this discussion?")) {
            return;
        }

        try {
            await discussionService.deleteDiscussion(discussion._id);
            navigate("/");
        } catch (error) {
            console.log("DELETE DISCUSSION ERROR", error);
        }
    };

    const handleCreateReply = async (parentId, content) => {
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
            console.log("CREATE REPLY ERROR", error);
        }
    };

    const handleLikeReply = async (reply) => {
        if (!user) {
            navigate("/auth/login");
            return;
        }

        try {
            if (reply.likedBy.includes(user.id)) {
                await replyService.unlikeReply(reply._id);
            } else {
                await replyService.likeReply(reply._id);
            }

            await loadReplies();
        } catch (error) {
            console.log("LIKE REPLY ERROR", error);
        }
    };

    const handleUpdateReply = async () => {
        try {
            await loadReplies();
        } catch (error) {
            console.log("REFRESH REPLIES ERROR", error);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadDiscussion = async () => {
            setLoading(true);

            try {
                const response =
                    await discussionService.getDiscussionById(id);

                if (cancelled) return;

                setDiscussion(response);

                if (user) {
                    const bookmarks = await userService.getMyBookmarks();

                    if (cancelled) return;

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
                if (!cancelled) {
                    console.log("LOAD DISCUSSION ERROR", error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDiscussion();

        return () => {
            cancelled = true;
        };
    }, [id, user?.id]);

    if (loading) {
        return (
            <p className="discussion-page__loading">
                Loading discussion...
            </p>
        );
    }

    if (!discussion) {
        return (
            <p className="discussion-page__not-found">
                Discussion not found.
            </p>
        );
    }

    const author = discussion.authorId;

    const publishDate = discussion.createdAt
        ? new Date(discussion.createdAt)
        : null;

    return (
        <main className="discussion-page">
            <article className="discussion-post">
                <header className="discussion-post__header">
                    <div className="discussion-post__author">
                        <ProfilePicture
                            src={author?.profilePicture}
                            alt={`${author?.username || "Author"}'s profile picture`}
                            size={40}
                        />

                        <div className="discussion-post__author-details">
                            {author?._id ? (
                                <button
                                    type="button"
                                    className="discussion-post__author-link"
                                    onClick={() =>
                                        navigate(`/profile/${author._id}`)
                                    }
                                >
                                    {author.username}
                                </button>
                            ) : (
                                <span className="discussion-post__author-link">
                                    Unknown user
                                </span>
                            )}

                            {publishDate && (
                                <time
                                    className="discussion-post__date"
                                    dateTime={publishDate.toISOString()}
                                >
                                    {publishDate.toLocaleDateString()}
                                </time>
                            )}
                        </div>
                    </div>

                    <span className="discussion-post__category">
                        {discussion.category}
                    </span>
                </header>

                {isEditing ? (
                    <div className="discussion-post__edit-form">
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
                    </div>
                ) : (
                    <>
                        <h1 className="discussion-post__title">
                            {discussion.title}
                        </h1>

                        {discussion.image && (
                            <img
                                className="discussion-post__image"
                                src={discussion.image}
                                alt={`Image attached to ${discussion.title}`}
                            />
                        )}

                        <p className="discussion-post__content">
                            {discussion.content}
                        </p>
                    </>
                )}

                <footer className="discussion-post__footer">
                    <div className="discussion-post__like-count">
                        <span
                            className="discussion-post__heart"
                            aria-hidden="true"
                        >
                            ♥
                        </span>
                        <span>
                            {discussion.likedBy?.length ?? 0} likes
                        </span>
                    </div>

                    <Button variant="secondary" onClick={handleReplyClick}>
                        Reply
                    </Button>

                    <DiscussionActions
                        discussion={discussion}
                        onLike={handleLikeDiscussion}
                        onEdit={handleEditDiscussion}
                        onDelete={handleDeleteDiscussion}
                    />
                    
                    <Button
                        variant={isBookmarked ? "secondary" : "outline"}
                        onClick={handleToggleBookmark}
                        disabled={bookmarkLoading}
                        aria-pressed={isBookmarked}
                    >
                        {bookmarkLoading
                            ? "Updating..."
                            : isBookmarked
                                ? "✓ Bookmarked"
                                : "＋ Bookmark"}
                    </Button>

                </footer>
            </article>

            <section className="discussion-replies">
                <h2 className="discussion-replies__title">
                    Replies
                </h2>


                <div className="discussion-replies__composer">
                    {isReplying &&
                        <ReplyComposer
                            content={replyContent}
                            setContent={setReplyContent}
                            onCancel={() => {
                                setReplyContent("");
                                setIsReplying(false);
                            }}
                            onSubmit={async () => {
                                if (!replyContent.trim()) return;

                                await handleCreateReply(null, replyContent);
                                setReplyContent("");
                                setIsReplying(false);
                            }}
                        />
                    }
                </div>


                <ReplyThread
                    replies={replies}
                    onLike={handleLikeReply}
                    onUpdate={handleUpdateReply}
                    onCreateReply={handleCreateReply}
                />
            </section>
        </main>
    );
}
