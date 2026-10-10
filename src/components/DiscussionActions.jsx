import { useAuth } from "../context/AuthContext";

export default function DiscussionActions({
    discussion,
    onLike,
    onEdit,
    onDelete
}) {
    const { user } = useAuth();

    const isLiked =
        user &&
        discussion.likedBy.includes(user.id);

    const canManage =
        user &&
        (
            user.id === discussion.authorId._id ||
            user.role === "admin"
        );

    return (
        <div>
            <button onClick={onLike}>
                {isLiked ? "Unlike" : "Like"}
            </button>

            {canManage && (
                <>
                    <button onClick={onEdit}>
                        Edit
                    </button>

                    <button onClick={onDelete}>
                        Delete
                    </button>
                </>
            )}
        </div>
    );
}