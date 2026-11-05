
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import "./DiscussionActions.css";

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
            user.id === discussion.authorId?._id ||
            user.role === "admin"
        );

    return (
        <div className="discussion-actions">
            <Button
                variant={isLiked ? "secondary" : "primary"}
                onClick={onLike}
            >
                {isLiked ? "Unlike" : "Like"}
            </Button>

            {canManage && (
                <>
                    <Button
                        variant="outline"
                        onClick={onEdit}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </>
            )}
        </div>
    );
}
