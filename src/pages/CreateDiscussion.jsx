
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import discussionService from "../services/discussionService";

import "./CreateDiscussion.css";

export default function CreateDiscussion() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            setLoading(true);

            const discussion = await discussionService.createDiscussion({
                title,
                content,
                category,
                image
            });

            navigate(`/discussion/${discussion._id}`);
        } catch (error) {
            console.error("CREATE DISCUSSION ERROR", error);

            setError(
                error.response?.data?.message ||
                "Failed to create discussion. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="create-discussion-page">
            <header className="create-discussion-header">
                <h1>Create a Discussion</h1>
            </header>

            <section className="create-discussion-card">


                <form
                    className="create-discussion-form"
                    onSubmit={handleSubmit}
                >
                    <Input
                        label="Title"
                        value={title}
                        placeholder="Give your discussion a title"
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                    />

                    <div className="create-discussion-field">
                        <label htmlFor="discussion-content">
                            Content
                        </label>

                        <textarea
                            id="discussion-content"
                            className="create-discussion-textarea"
                            value={content}
                            placeholder="What would you like to discuss?"
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            required
                            rows={7}
                        />
                    </div>

                    <div className="create-discussion-field">
                        <label htmlFor="discussion-category">
                            Category
                        </label>

                        <select
                            id="discussion-category"
                            className="create-discussion-select"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                Choose a category
                            </option>
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

                    <div className="create-discussion-field">
                        <label htmlFor="discussion-image">
                            Add an image
                            <span className="create-discussion-optional">
                                Optional
                            </span>
                        </label>

                        <div className="create-discussion-upload">
                            <input
                                id="discussion-image"
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    setImage(
                                        event.target.files?.[0] || null
                                    )
                                }
                            />
                        </div>

                        {image && (
                            <div className="create-discussion-selected-file">
                                <span aria-hidden="true">▧</span>

                                <span className="create-discussion-file-name">
                                    {image.name}
                                </span>

                                <button
                                    type="button"
                                    className="create-discussion-remove-file"
                                    onClick={() => {
                                        setImage(null);

                                        const fileInput =
                                            document.getElementById(
                                                "discussion-image"
                                            );

                                        if (fileInput) {
                                            fileInput.value = "";
                                        }
                                    }}
                                    aria-label="Remove selected image"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div
                            className="create-discussion-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <div className="create-discussion-actions">
                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Publish Discussion
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
