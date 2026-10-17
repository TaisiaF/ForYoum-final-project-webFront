import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
    const { user, login, token } = useAuth();

    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [emailPassword, setEmailPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const showResult = (text, isError = false) => {
        setMessage(isError ? "" : text);
        setError(isError ? text : "");
    };

    const handleUsernameSubmit = async (event) => {
        event.preventDefault();
        showResult("");

        const trimmedUsername = username.trim();

        if (trimmedUsername.length < 2) {
            showResult("Username must be at least 2 characters.", true);
            return;
        }

        if (trimmedUsername === user?.username) {
            showResult("Your username hasn't changed.", true);
            return;
        }

        try {
            setLoading("username");
            await userService.updateUsername(trimmedUsername);

            const updatedUser = { ...user, username: trimmedUsername };
            login(token, updatedUser);
            showResult("Username updated successfully.");
        } catch (err) {
            showResult(
                err.response?.data?.message || "Failed to update username.",
                true
            );
        } finally {
            setLoading("");
        }
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        showResult("");

        const trimmedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            showResult("Please enter a valid email address.", true);
            return;
        }

        if (trimmedEmail === user?.email?.toLowerCase()) {
            showResult("Your email hasn't changed.", true);
            return;
        }

        if (!emailPassword) {
            showResult("Enter your current password to change your email.", true);
            return;
        }

        try {
            setLoading("email");
            await userService.updateEmail(trimmedEmail, emailPassword);

            const updatedUser = { ...user, email: trimmedEmail };
            login(token, updatedUser);
            setEmailPassword("");
            showResult("Email updated successfully.");
        } catch (err) {
            showResult(
                err.response?.data?.message || "Failed to update email.",
                true
            );
        } finally {
            setLoading("");
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        showResult("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            showResult("Please fill in all password fields.", true);
            return;
        }

        if (newPassword.length < 8) {
            showResult("Your new password must be at least 8 characters.", true);
            return;
        }

        if (newPassword !== confirmPassword) {
            showResult("The new passwords do not match.", true);
            return;
        }

        if (oldPassword === newPassword) {
            showResult("Your new password must differ from your current password.", true);
            return;
        }

        try {
            setLoading("password");
            await userService.updatePassword(oldPassword, newPassword);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showResult("Password updated successfully.");
        } catch (err) {
            showResult(
                err.response?.data?.message || "Failed to update password.",
                true
            );
        } finally {
            setLoading("");
        }
    };

    return (
        <div>
            <h1>Account Settings</h1>

            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}

            <section>
                <h2>Change Username</h2>
                <form onSubmit={handleUsernameSubmit}>
                    <Input
                        label="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="New username"
                    />
                    <Button type="submit" loading={loading === "username"}>
                        Save Username
                    </Button>
                </form>
            </section>

            <section>
                <h2>Change Email</h2>
                <form onSubmit={handleEmailSubmit}>
                    <Input
                        label="New Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="New email address"
                    />
                    <Input
                        label="Current Password"
                        type="password"
                        value={emailPassword}
                        onChange={(event) => setEmailPassword(event.target.value)}
                        placeholder="Enter current password"
                    />
                    <Button type="submit" loading={loading === "email"}>
                        Save Email
                    </Button>
                </form>
            </section>

            <section>
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <Input
                        label="Current Password"
                        type="password"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        placeholder="Current password"
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="At least 8 characters"
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat new password"
                    />
                    <Button type="submit" loading={loading === "password"}>
                        Update Password
                    </Button>
                </form>
            </section>
        </div>
    );
}