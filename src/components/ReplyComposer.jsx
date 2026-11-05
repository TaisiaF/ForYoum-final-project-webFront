
import Button from "./Button";
import "./ReplyComposer.css";

export default function ReplyComposer({
    content,
    setContent,
    onCancel,
    onSubmit
}) {
    return (
        <div className="reply-composer">
            <label className="reply-composer__label">
                Write a reply
            </label>

            <textarea
                className="reply-composer__textarea"
                value={content}
                onChange={(event) =>
                    setContent(event.target.value)
                }
                placeholder="Write a reply..."
            />

            <div className="reply-composer__actions">
                <Button onClick={onSubmit}>
                    Reply
                </Button>

                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
