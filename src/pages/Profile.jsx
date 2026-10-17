import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import userService from "../services/userService";
import DiscussionCard from "../components/DiscussionCard";
import ProfilePicture from "../components/ProfilePicture";
import { useAuth } from "../context/AuthContext";


export default function Profile() {
    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [banLoading, setBanLoading] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);


    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

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

            const result =
                await userService.updateProfilePicture(file);

            setProfile(previous => ({
                ...previous,
                profilePicture: result.profilePicture
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


    const handleToggleBan = async () => {
        if (!profile || user?.role !== "admin" || user?.id === profile._id) {
            return;
        }

        try {
            setBanLoading(true);
            setError("");

            if (profile.banned) {
                await userService.unbanUser(profile._id);
                setProfile(previous => ({
                    ...previous,
                    banned: false
                }));
            } else {
                await userService.banUser(profile._id);
                setProfile(previous => ({
                    ...previous,
                    banned: true
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

        if (!confirmed) {
            return;
        }

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


    const handleDeleteMyAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?\n\nThis action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await userService.deleteMyAccount();

            logout();
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete your account."
            );
        }
    };



    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const [profileData, discussionsData] =
                    await Promise.all([
                        userService.getUserById(id),
                        userService.getUserDiscussions(id)
                    ]);

                setProfile(profileData);
                setDiscussions(discussionsData);

            } catch (error) {
                console.error(
                    "LOAD PROFILE ERROR",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>User not found.</p>;
    }


    return (
        <div>
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfilePictureUpload}
                />

                <ProfilePicture
                    src={profile.profilePicture}
                    alt={`${profile.username}'s profile`}
                    size={150}
                />

                <h1>{profile.username}</h1>
                <p>Role: {profile.role}</p>

                {user?.role === "admin" && user?.id !== profile._id && (
                    <div>
                        <p>
                            Status: {profile.banned ? "Banned" : "Active"}
                        </p>

                        <button
                            onClick={handleToggleBan}
                            disabled={banLoading}
                        >
                            {banLoading
                                ? "Please wait..."
                                : profile.banned
                                    ? "Unban User"
                                    : "Ban User"}
                        </button>
                    </div>
                )}

                {user?.id === profile._id && (
                    <button onClick={() => navigate("/account-settings")}>
                        Account Settings
                    </button>
                )}

                {user?.role === "admin" &&
                    user?.id !== profile._id && (
                        <button onClick={handleDeleteUser}>
                            Delete User
                        </button>
                )}

                {user?.id === profile._id && (
                    <button onClick={handleDeleteMyAccount}>
                        Delete My Account
                    </button>
                )}

                {user?.id === profile._id && (
                    <>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Change profile picture"}
                        </button>

                        {uploadError && (
                            <p style={{ color: "red" }}>
                                {uploadError}
                            </p>
                        )}
                    </>
                )}
            </div>

            <h2>Discussions by {profile.username}</h2>

            {discussions.length === 0 ? (
                <p>This user hasn't created any discussions yet.</p>
            ) : (
                discussions.map(discussion => (
                    <DiscussionCard
                        key={discussion._id}
                        discussion={discussion}
                    />
                ))
            )}
        </div>
    );
}