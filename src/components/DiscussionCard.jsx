
import { useNavigate } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import "./DiscussionCard.css";

export default function DiscussionCard({ discussion }) {
    const navigate = useNavigate();

    const username =
        discussion.authorId?.username ||
        discussion.author?.username ||
        discussion.username ||
        "Unknown user";

    const profilePicture =
        discussion.authorId?.profilePicture ||
        discussion.author?.profilePicture ||
        null;

    const likes =
        discussion.likedByCount ??
        discussion.likedBy?.length ??
        0;

    const publishDate = discussion.createdAt
        ? new Date(discussion.createdAt).toLocaleDateString()
        : "Date unavailable";

    return (
        <article
            className="discussion-card"
            role="link"
            tabIndex={0}
            onClick={() => navigate(`/discussion/${discussion._id}`)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/discussion/${discussion._id}`);
                }
            }}
            aria-label={`Open discussion: ${discussion.title}`}
        >
            <div className="discussion-card__picture">
                <ProfilePicture
                    src={profilePicture}
                    alt={`${username}'s profile picture`}
                    size={40}
                />
            </div>

            <div className="discussion-card__main">
                <h2 className="discussion-card__title">
                    {discussion.title}
                </h2>

                <p className="discussion-card__author">
                    by{" "}
                    <span className="discussion-card__author-name">
                        {username}
                    </span>
                </p>

                <div className="discussion-card__metadata">
                    <span className="discussion-card__category">
                        {discussion.category}
                    </span>

                    <time
                        className="discussion-card__date"
                        dateTime={discussion.createdAt || undefined}
                    >
                        {publishDate}
                    </time>
                </div>
            </div>

            <div className="discussion-card__likes" aria-label={`${likes} likes`}>
                <span className="discussion-card__heart" aria-hidden="true">
                    ♥
                </span>
                <span>{likes}</span>
                <span>likes</span>
            </div>
        </article>
    );
}
