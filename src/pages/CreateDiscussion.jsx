
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import discussionService from "../services/discussionService";

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
        <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
            <h1>Create Discussion</h1>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Title"
                    value={title}
                    placeholder="Enter a title"
                    onChange={(event) => setTitle(event.target.value)}
                />

                <label
                    htmlFor="discussion-content"
                    style={{ display: "block", marginTop: "16px" }}
                >
                    Content
                </label>
                <textarea
                    id="discussion-content"
                    value={content}
                    placeholder="What would you like to discuss?"
                    onChange={(event) => setContent(event.target.value)}
                    required
                    rows={7}
                    style={{ width: "100%", boxSizing: "border-box" }}
                />

                <label
                    htmlFor="discussion-category"
                    style={{ display: "block", marginTop: "16px" }}
                >
                    Category
                </label>
                <select
                    id="discussion-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                    style={{ width: "100%", padding: "10px" }}
                >
                    <option value="">Choose a category</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Movies">Movies</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Food">Food</option>
                    <option value="Education">Education</option>
                    <option value="Art">Art</option>
                    <option value="Other">Other</option>
                </select>

                <label
                    htmlFor="discussion-image"
                    style={{ display: "block", marginTop: "16px" }}
                >
                    Image (optional)
                </label>
                <input
                    id="discussion-image"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                        setImage(event.target.files?.[0] || null)
                    }
                />

                {image && (
                    <p>Selected image: {image.name}</p>
                )}

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button type="submit" loading={loading}>
                        Publish Discussion
                    </Button>

                    <Button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}