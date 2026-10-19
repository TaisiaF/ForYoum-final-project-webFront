
import ReplyCard from "./ReplyCard";
import "./ReplyThread.css";

export default function ReplyThread({
    replies,
    onLike,
    onUpdate,
    onCreateReply
}) {
    return (
        <div className="reply-thread">
            {replies.map((reply) => (
                <div
                    className="reply-node"
                    key={reply._id}
                >
                    <div className="reply-row">
                        <ReplyCard
                            reply={{
                                ...reply,
                                level: 0
                            }}
                            onLike={onLike}
                            onUpdate={onUpdate}
                            onCreateReply={onCreateReply}
                        />
                    </div>

                    {reply.children?.length > 0 && (
                        <ReplyThread
                            replies={reply.children}
                            onLike={onLike}
                            onUpdate={onUpdate}
                            onCreateReply={onCreateReply}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
