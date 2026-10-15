import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import DiscussionCard from "../components/DiscussionCard";

import discussionService from "../services/discussionService";

import { useAuth } from "../context/AuthContext";


export default function Home() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [discussions, setDiscussions] =
        useState([]);

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [sort, setSort] =
        useState("newest");

    const [after, setAfter] =
        useState("");

    const [before, setBefore] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const loadDiscussions = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            const response =
                await discussionService
                    .getDiscussions({
                        page: pageNumber,
                        category,
                        search,
                        sort,
                        after,
                        before
                    });

            setDiscussions(response.data);

            setTotalPages(
                response.totalPages
            );

            setPage(pageNumber);

        } catch (error) {

            console.log(
                "LOAD DISCUSSIONS ERROR",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadDiscussions(1);
    }, [
        category,
        sort,
        after,
        before
    ]);

    return (
        <div>

            <h1>ForYoum -Home</h1>
            
            {user && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

                    <Button
                        onClick={() => navigate(`/profile/${user.id}`)}
                    >
                        My Profile
                    </Button>

                    <Button
                        onClick={() => navigate("/discussion/create")}
                    >
                        Create Discussion
                    </Button>
                </div>
            )}

            <Input
                label="Search"
                value={search}
                placeholder="Search discussions"
                onChange={(event) =>
                    setSearch(event.target.value)
                }
            />

            <Button
                onClick={() =>
                    loadDiscussions(1)
                }
                loading={loading}
            >
                Search
            </Button>

            <select
                value={category}
                onChange={(event) =>
                    setCategory(event.target.value)
                }
            >
                <option value="">
                    All
                </option>

                <option value="Gaming">
                    Gaming
                </option>

                <option value="Movies">
                    Movies
                </option>

                <option value="Music">
                    Music
                </option>

                <option value="Sports">
                    Sports
                </option>

                <option value="Food">
                    Food
                </option>

                <option value="Education">
                    Education
                </option>

                <option value="Art">
                    Art
                </option>

                <option value="Other">
                    Other
                </option>
            </select>

            <select
                value={sort}
                onChange={(event) =>
                    setSort(event.target.value)
                }
            >
                <option value="newest">
                    Newest
                </option>

                <option value="oldest">
                    Oldest
                </option>

                <option value="likes">
                    Most Liked
                </option>
            </select>

            <label>
                From
                <input
                    type="date"
                    value={after}
                    onChange={(event) =>
                        setAfter(event.target.value)
                    }
                />
            </label>

            <label>
                To
                <input
                    type="date"
                    value={before}
                    onChange={(event) =>
                        setBefore(event.target.value)
                    }
                />
            </label>

            {loading && (
                <p>Loading...</p>
            )}

            {!loading &&
                discussions.length === 0 && (
                    <p>
                        No discussions found.
                    </p>
                )}

           {!loading &&
                discussions.map((discussion) => (
                    <DiscussionCard
                        key={discussion._id}
                        discussion={discussion}
                    />
    ))}

            <div>

                <Button
                    onClick={() =>
                        loadDiscussions(page - 1)
                    }
                    loading={loading}
                >
                    Previous
                </Button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <Button
                    onClick={() =>
                        loadDiscussions(page + 1)
                    }
                    loading={loading}
                >
                    Next
                </Button>

            </div>

        </div>
    );
}