import Button from "./Button";
import "./DiscussionEditForm.css";

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
        <div className="discussion-edit-form">
            <div className="discussion-edit-form__field">
                <label htmlFor="edit-discussion-title">
                    Title
                </label>
                <input
                    id="edit-discussion-title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />
            </div>

            <div className="discussion-edit-form__field">
                <label htmlFor="edit-discussion-category">
                    Category
                </label>
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
            </div>

            <div className="discussion-edit-form__field">
                <label htmlFor="edit-discussion-content">
                    Content
                </label>
                <textarea
                    id="edit-discussion-content"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    rows={6}
                />
            </div>

            <div className="discussion-edit-form__actions">
                <Button onClick={onSave}>
                    Save changes
                </Button>

                <Button
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
