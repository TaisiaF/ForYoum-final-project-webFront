export default function DiscussionEditForm({
    title,
    category,
    content,
    setTitle,
    setCategory,
    setContent,
    onSave,
    onCancel
}) {
    return (
        <div>
            <input
                id="edit-discussion-title"
                value={title}
                onChange={(event) =>
                    setTitle(event.target.value)
                }
            />

            <select
                id="edit-discussion-category"
                value={category}
                onChange={(event) =>
                    setCategory(event.target.value)
                }
            >
                <option value="Gaming">Gaming</option>
                <option value="Movies">Movies</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Education">Education</option>
                <option value="Art">Art</option>
                <option value="Other">Other</option>
            </select>

            <textarea
                id="edit-discussion-content"
                value={content}
                onChange={(event) =>
                    setContent(event.target.value)
                }
            />

            <button onClick={onSave}>
                Save
            </button>

            <button onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}