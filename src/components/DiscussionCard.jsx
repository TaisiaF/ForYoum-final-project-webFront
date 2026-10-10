import { useNavigate } from "react-router-dom";

export default function DiscussionCard({
    discussion
}) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`/discussion/${discussion._id}`)
            }
        >
            <h2>
                {discussion.title}
            </h2>

            <p>
                {discussion.category}
            </p>

            <p>
                {discussion.username}
            </p>

            <p>
                {new Date(
                    discussion.createdAt
                ).toLocaleDateString()}
            </p>

            <p>
                Likes: {discussion.likedByCount}
            </p>
        </div>
    );
}