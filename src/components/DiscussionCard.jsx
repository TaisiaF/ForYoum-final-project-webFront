import { useNavigate } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

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

    return (
        <div
            onClick={() =>
                navigate(`/discussion/${discussion._id}`)
            }
            style={{
                cursor: "pointer"
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
                    src={profilePicture}
                    alt={`${username}'s profile picture`}
                    size={40}
                />

                <div>
                    <h2>{discussion.title}</h2>
                    <p>Category: {discussion.category}</p>
                    <p>Author: {username}</p>
                </div>
            </div>

            <p>
                Created: {new Date( discussion.createdAt).toLocaleDateString()}
            </p>

            <p>
                Likes: {
                    discussion.likedByCount ??
                    discussion.likedBy?.length ??
                    0
                }
            </p>
        </div>
    );
}