import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import DiscussionCard from "../components/DiscussionCard";

import discussionService from "../services/discussionService";
import { useAuth } from "../context/AuthContext";
import "./Home.css";


const categories = [
    "Gaming",
    "Movies",
    "Music",
    "Sports",
    "Food",
    "Education",
    "Art",
    "Other",
];

export default function Home() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [discussions, setDiscussions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("newest");
    const [after, setAfter] = useState("");
    const [before, setBefore] = useState("");
    const [loading, setLoading] = useState(false);

    const loadDiscussions = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const response = await discussionService.getDiscussions({
                page: pageNumber,
                category,
                search,
                sort,
                after,
                before,
            });

            setDiscussions(response.data);
            setTotalPages(response.totalPages);
            setPage(pageNumber);
        } catch (error) {
            console.error("LOAD DISCUSSIONS ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDiscussions(1);
    }, [category, sort, after, before]);

    const handleSearch = (event) => {
        event.preventDefault();
        loadDiscussions(1);
    };

    return (
        <main className="home-page">
            <section className="home-hero">
                <h1>Home Page</h1>
                <p>
                    Discover ideas, share your interests, and join the
                    discussion.
                </p>
            </section>

            {user && (
                <div className="home-create-action">
                    <Button
                        onClick={() => navigate("/discussion/create")}
                    >
                        + Create Discussion
                    </Button>
                </div>
            )}

            <form className="home-search" onSubmit={handleSearch}>
                <label
                    className="visually-hidden"
                    htmlFor="discussion-search"
                >
                    Search discussions
                </label>

                <Input
                    label=""
                    value={search}
                    placeholder="Search discussions..."
                    onChange={(event) => setSearch(event.target.value)}
                    id="discussion-search"
                />

                <Button type="submit" loading={loading}>
                    Search
                </Button>
            </form>

            <section className="home-categories">
                <h2 className="home-section-label">
                    Explore categories
                </h2>

                <div className="category-chips">
                    <button
                        type="button"
                        className={`category-chip category-chip--all ${
                            category === "" ? "is-active" : ""
                        }`}
                        aria-pressed={category === ""}
                        onClick={() => setCategory("")}
                    >
                        All topics
                    </button>

                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`category-chip category-chip--${item.toLowerCase()} ${
                                category === item ? "is-active" : ""
                            }`}
                            aria-pressed={category === item}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="home-discussions">
                <div className="home-discussions__heading">
                    <div>
                        <h2>Filter discussions</h2>
                    </div>
                </div>

                <div className="home-filters">
                    <label className="home-filter">
                        <span>Sort by</span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="likes">Most liked</option>
                        </select>
                    </label>

                    <label className="home-filter">
                        <span>From</span>
                        <input
                            type="date"
                            value={after}
                            onChange={(event) => setAfter(event.target.value)}
                        />
                    </label>

                    <label className="home-filter">
                        <span>To</span>
                        <input
                            type="date"
                            value={before}
                            onChange={(event) => setBefore(event.target.value)}
                        />
                    </label>
                </div>

                {loading && (
                    <p className="home-status" role="status">
                        Loading discussions...
                    </p>
                )}

                {!loading && discussions.length === 0 && (
                    <div className="home-empty">
                        <span className="home-empty__icon" aria-hidden="true">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
                            </svg>
                        </span>
                        <h3>No discussions found</h3>
                        <p>
                            Try another search or category to find a
                            conversation.
                        </p>
                    </div>
                )}

                {!loading && discussions.length > 0 && (
                    <div className="home-discussion-list">
                        {discussions.map((discussion) => (
                            <DiscussionCard
                                key={discussion._id}
                                discussion={discussion}
                            />
                        ))}
                    </div>
                )}

                <nav className="home-pagination" aria-label="Discussion pages">
                    <Button
                        onClick={() => loadDiscussions(page - 1)}
                        loading={loading}
                        disabled={loading || page <= 1}
                    >
                        ← Previous
                    </Button>

                    <span>
                        Page <strong>{page}</strong> of{" "}
                        <strong>{totalPages}</strong>
                    </span>

                    <Button
                        onClick={() => loadDiscussions(page + 1)}
                        loading={loading}
                        disabled={loading || page >= totalPages}
                    >
                        Next →
                    </Button>
                </nav>
            </section>
        </main>
    );
}
