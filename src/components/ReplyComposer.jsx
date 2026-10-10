export default function ReplyComposer({
    content,
    setContent,
    onCancel,
    onSubmit
}) {
    return (
        <div>
            <textarea
                value={content}
                onChange={(event) =>
                    setContent(event.target.value)
                }
                placeholder="Write a reply..."
            />

            <button onClick={onSubmit}>
                Reply
            </button>

            <button onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}