import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import userService from "../services/userService";
import DiscussionCard from "../components/DiscussionCard";
import ProfilePicture from "../components/ProfilePicture";
import { useAuth } from "../context/AuthContext";


export default function Profile() {
    const { id } = useParams();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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