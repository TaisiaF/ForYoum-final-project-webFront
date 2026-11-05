
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import userService from "../services/userService";
import discussionService from "../services/discussionService";

import DiscussionCard from "../components/DiscussionCard";
import ProfilePicture from "../components/ProfilePicture";

import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [banLoading, setBanLoading] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);

    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState("");
    const [descriptionLoading, setDescriptionLoading] = useState(false);
    const [descriptionError, setDescriptionError] = useState("");

    const [privacyLoading, setPrivacyLoading] = useState(false);
    const [privacyError, setPrivacyError] = useState("");

    const [bookmarks, setBookmarks] = useState([]);
    const [bookmarksLoading, setBookmarksLoading] = useState(false);
    const [bookmarksError, setBookmarksError] = useState("");

    const isOwnProfile = Boolean(user?.id && profile?._id === user.id);
    const isAdminViewingOther =
        user?.role === "admin" && profile?._id !== user?.id;

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadError("Please select an image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError("The image must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        try {
            setUploading(true);
            setUploadError("");

            const result = await userService.updateProfilePicture(file);

            setProfile((previous) => ({
                ...previous,
                profilePicture: result.profilePicture,
            }));
        } catch (error) {
            setUploadError(
                error.response?.data?.message ||
                "Failed to upload profile picture."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };


    const handleSaveDescription = async () => {
        if (!profile) return;

        if (descriptionDraft.length > 300) {
            setDescriptionError("Description cannot exceed 300 characters.");
            return;
        }

        try {
            setDescriptionLoading(true);
            setDescriptionError("");

            const result = await userService.updateDescription(
                descriptionDraft
            );

            setProfile((previous) => ({
                ...previous,
                description: result.description,
            }));

            setEditingDescription(false);
        } catch (error) {
            setDescriptionError(
                error.response?.data?.message ||
                "Failed to update description."
            );
        } finally {
            setDescriptionLoading(false);
        }
    };


    const handleTogglePrivacy = async () => {
        if (!profile || !isOwnProfile) return;

        const newValue = !profile.isPrivate;

        try {
            setPrivacyLoading(true);
            setPrivacyError("");

            await userService.updateProfilePrivacy(newValue);

            setProfile((previous) => ({
                ...previous,
                isPrivate: newValue,
            }));
        } catch (error) {
            setPrivacyError(
                error.response?.data?.message ||
                "Failed to update profile privacy."
            );
        } finally {
            setPrivacyLoading(false);
        }
    };


    const handleToggleBan = async () => {
        if (!profile || !isAdminViewingOther) return;

        try {
            setBanLoading(true);
            setError("");

            if (profile.banned) {
                await userService.unbanUser(profile._id);
                setProfile((previous) => ({
                    ...previous,
                    banned: false,
                }));
            } else {
                await userService.banUser(profile._id);
                setProfile((previous) => ({
                    ...previous,
                    banned: true,
                }));
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update user's ban status."
            );
        } finally {
            setBanLoading(false);
        }
    };


    const handleDeleteUser = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${profile.username}?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setError("");
            await userService.deleteUserById(profile._id);
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete user."
            );
        }
    };


    const handleRemoveBookmark = async (discussionId) => {
        try {
            setBookmarksError("");

            await discussionService.unbookmarkDiscussion(discussionId);

            setBookmarks((previousBookmarks) =>
                previousBookmarks.filter(
                    (bookmark) => bookmark._id !== discussionId
                )
            );
        } catch (error) {
            console.error("REMOVE BOOKMARK ERROR", error);

            setBookmarksError(
                error.response?.data?.message ||
                "Failed to remove bookmark."
            );
        }
    };


    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const [profileData, discussionsData] = await Promise.all([
                    userService.getUserById(id),
                    userService.getUserDiscussions(id),
                ]);

                if (cancelled) return;

                setProfile(profileData);
                setDiscussions(discussionsData);

                if (user?.id === profileData._id) {
                    setBookmarksLoading(true);
                    setBookmarksError("");

                    try {
                        const bookmarksData =
                            await userService.getMyBookmarks();

                        if (!cancelled) {
                            setBookmarks(bookmarksData);
                        }
                    } catch (error) {
                        if (!cancelled) {
                            setBookmarksError(
                                error.response?.data?.message ||
                                "Failed to load bookmarks."
                            );
                        }
                    } finally {
                        if (!cancelled) {
                            setBookmarksLoading(false);
                        }
                    }
                } else {
                    setBookmarks([]);
                    setBookmarksError("");
                    setBookmarksLoading(false);
                }
            } catch (error) {
                if (cancelled) return;

                console.error("LOAD PROFILE ERROR", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [id, user?.id]);

    if (loading) {
        return (
            <main className="profile-page">
                <p className="profile-state">Loading profile...</p>
            </main>
        );
    }

    if (error && !profile) {
        return (
            <main className="profile-page">
                <p className="profile-message profile-message--error" role="alert">
                    {error}
                </p>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <p className="profile-state">User not found.</p>
            </main>
        );
    }


    return (
        <main className="profile-page">
            <div className="profile-content">
                {error && (
                    <p
                        className="profile-message profile-message--error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}












<section className="profile-header">
    {/* Left: profile description */}
    <div className="profile-header__description-area">
        {!profile.isPrivate && (
            <div className="profile-description">
                {editingDescription && isOwnProfile ? (
                    <>
                        <textarea
                            className="profile-description__input"
                            value={descriptionDraft}
                            onChange={(event) =>
                                setDescriptionDraft(event.target.value)
                            }
                            maxLength={300}
                            rows={4}
                            placeholder="Tell people a little about yourself..."
                            aria-label="Profile description"
                            disabled={descriptionLoading}
                        />

                        <div className="profile-description__counter">
                            {descriptionDraft.length}/300
                        </div>

                        <div className="profile-description__actions">
                            <button
                                type="button"
                                className="profile-button profile-button--primary"
                                onClick={handleSaveDescription}
                                disabled={descriptionLoading}
                            >
                                {descriptionLoading ? "Saving..." : "Save"}
                            </button>

                            <button
                                type="button"
                                className="profile-button profile-button--secondary"
                                onClick={() => {
                                    setDescriptionDraft(profile.description || "");
                                    setDescriptionError("");
                                    setEditingDescription(false);
                                }}
                                disabled={descriptionLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {profile.description?.trim() && (
                            <p className="profile-description__text">
                                {profile.description}
                            </p>
                        )}

                        {isOwnProfile && (
                            <button
                                type="button"
                                className="profile-button profile-button--secondary"
                                onClick={() => {
                                    setDescriptionDraft(profile.description || "");
                                    setDescriptionError("");
                                    setEditingDescription(true);
                                }}
                            >
                                {profile.description?.trim()
                                    ? "Edit Description"
                                    : "Add Description"}
                            </button>
                        )}
                    </>
                )}

                {descriptionError && (
                    <p
                        className="profile-message profile-message--error"
                        role="alert"
                    >
                        {descriptionError}
                    </p>
                )}
            </div>
        )}
    </div>

    {/* Center: profile picture, username, role and status */}
    <div className="profile-header__identity">
        <div className="profile-header__picture">
            <ProfilePicture
                src={profile.profilePicture}
                alt={`${profile.username}'s profile`}
                size={150}
            />
        </div>

        <h1 className="profile-header__username">
            {profile.username}
        </h1>

        <span className="profile-role">
            {profile.role === "admin" ? "Administrator" : "Member"}
        </span>

        {isAdminViewingOther && (
            <span
                className={`profile-status ${
                    profile.banned
                        ? "profile-status--banned"
                        : "profile-status--active"
                }`}
            >
                {profile.banned ? "Banned account" : "Active account"}
            </span>
        )}
    </div>

    {/* Right: existing profile actions */}
    {isOwnProfile && (
        <div className="profile-header__actions">
            <button
                type="button"
                className="profile-button profile-button--primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
            >
                {uploading
                    ? "Uploading..."
                    : "Change Profile Picture"}
            </button>

            <button
                type="button"
                className="profile-button profile-button--secondary"
                onClick={() => navigate("/account-settings")}
            >
                Account Settings
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfilePictureUpload}
            />
        </div>
    )}

    {uploadError && (
        <p
            className="profile-message profile-message--error"
            role="alert"
        >
            {uploadError}
        </p>
    )}
</section>













                {isOwnProfile && (
                    <section className="profile-settings-panel">
                        <div className="profile-section-heading">
                            <span className="profile-section-heading__icon">
                                <span aria-hidden="true">🔒</span>
                            </span>
                            <div>
                                <h2>Profile Privacy</h2>
                                <p>Choose who can view your profile.</p>
                            </div>
                        </div>

                        <label className="profile-privacy-toggle">
                            <span className="profile-privacy-toggle__text">
                                <strong>Make profile private?</strong>
                                <span>
                                    {profile.isPrivate
                                        ? "Only you can view your profile."
                                        : "Your profile is visible to everyone."}
                                </span>
                            </span>

                            <input
                                type="checkbox"
                                checked={Boolean(profile.isPrivate)}
                                onChange={handleTogglePrivacy}
                                disabled={privacyLoading}
                            />
                        </label>

                        {privacyLoading && (
                            <p className="profile-message">
                                Saving privacy settings...
                            </p>
                        )}

                        {privacyError && (
                            <p
                                className="profile-message profile-message--error"
                                role="alert"
                            >
                                {privacyError}
                            </p>
                        )}
                    </section>
                )}

                {isAdminViewingOther && (
                    <section className="profile-admin-panel">
                        <h2>Administrator Controls</h2>
                        <p>
                            Account status:{" "}
                            <strong>{profile.banned ? "Banned" : "Active"}</strong>
                        </p>

                        <div className="profile-admin-panel__actions">
                            <button
                                type="button"
                                className="profile-button profile-button--secondary"
                                onClick={handleToggleBan}
                                disabled={banLoading}
                            >
                                {banLoading
                                    ? "Please wait..."
                                    : profile.banned
                                        ? "Unban User"
                                        : "Ban User"}
                            </button>

                            <button
                                type="button"
                                className="profile-button profile-button--danger"
                                onClick={handleDeleteUser}
                            >
                                Delete User
                            </button>
                        </div>
                    </section>
                )}

                <section className="profile-section">
                    <div className="profile-section-heading">
                        <span className="profile-section-heading__icon profile-section-heading__icon--teal">
                            <span aria-hidden="true">✎</span>
                        </span>
                        <div>
                            <h2>Discussions by {profile.username}</h2>
                        </div>
                    </div>

                    {discussions.length === 0 ? (
                        <div className="profile-empty-state">
                            <p>This user hasn't created any discussions yet.</p>
                        </div>
                    ) : (
                        <div className="profile-card-list">
                            {discussions.map((discussion) => (
                                <DiscussionCard
                                    key={discussion._id}
                                    discussion={discussion}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {isOwnProfile && (
                    <section className="profile-section profile-bookmarks">
                        <div className="profile-section-heading">
                            <span className="profile-section-heading__icon profile-section-heading__icon--coral">
                                <span aria-hidden="true">♡</span>
                            </span>
                            <div>
                                <h2>My Bookmarks</h2>
                            </div>
                        </div>

                        {bookmarksLoading ? (
                            <p className="profile-state">Loading bookmarks...</p>
                        ) : bookmarksError ? (
                            <p
                                className="profile-message profile-message--error"
                                role="alert"
                            >
                                {bookmarksError}
                            </p>
                        ) : bookmarks.length === 0 ? (
                            <div className="profile-empty-state">
                                <p>You haven't bookmarked any discussions yet.</p>
                            </div>
                        ) : (
                            <div className="profile-card-list">
                                {bookmarks.map((discussion) => (
                                    <div
                                        className="profile-bookmark-item"
                                        key={discussion._id}
                                    >
                                        <DiscussionCard discussion={discussion} />

                                        <div className="profile-bookmark-item__actions">
                                            <button
                                                type="button"
                                                className="profile-button profile-button--remove"
                                                onClick={() =>
                                                    handleRemoveBookmark(discussion._id)
                                                }
                                            >
                                                Remove Bookmark
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>

        </main>
    );
}
