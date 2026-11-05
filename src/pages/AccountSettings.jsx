import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

import Input from "../components/Input"; 
import Button from "../components/Button"; 

import userService from "../services/userService"; 
import { useAuth } from "../context/AuthContext";
import "./AccountSettings.css";


export default function AccountSettings() {

const navigate = useNavigate();
const { user, login, token, logout } = useAuth();

const [username, setUsername] = useState(user?.username || "");
const [email, setEmail] = useState(user?.email || "");
const [emailPassword, setEmailPassword] = useState("");
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [usernameError, setUsernameError] = useState("");
const [emailError, setEmailError] = useState("");
const [emailPasswordError, setEmailPasswordError] = useState("");
const [oldPasswordError, setOldPasswordError] = useState("");
const [newPasswordError, setNewPasswordError] = useState("");
const [confirmPasswordError, setConfirmPasswordError] = useState("");

const [loading, setLoading] = useState("");
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const showResult = (text, isError = false) => {
    setMessage(isError ? "" : text);
    setError(isError ? text : "");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const clearResult = () => {
    setMessage("");
    setError("");
};

const validateUsername = (value) => {
    if (value.trim().length < 3) {
        return "Username must be at least 3 characters.";
    }

    return "";
};

const validateEmail = (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Please enter a valid email address.";
    }

    return "";
};

const validateEmailPassword = (value) => {
    if (!value) {
        return "Enter your current password to change your email.";
    }

    return "";
};

const validateNewPassword = (value) => {
    if (value.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
        return "Password must contain at least one special character.";
    }

    return "";
};

const validateOldPassword = (value) => {
    if (!value) {
        return "Please enter your current password.";
    }

    return "";
};

const validateConfirmPassword = (
    value,
    originalPassword = newPassword
) => {
    if (!value) {
        return "Please confirm your new password.";
    }

    if (value !== originalPassword) {
        return "The new passwords do not match.";
    }

    return "";
};

const handleDeleteMyAccount = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
        setError("");
        await userService.deleteMyAccount();

        logout();
        navigate("/");
    } catch (err) {
        showResult(
            err.response?.data?.message ||
            "Failed to delete your account.",
            true
        );
    }
};

const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    clearResult();

    const trimmedUsername = username.trim();
    const validation = validateUsername(trimmedUsername);

    setUsernameError(validation);

    if (validation) {
        showResult(validation, true);
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
        setUsername(trimmedUsername);
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
    clearResult();

    const trimmedEmail = email.trim().toLowerCase();
    const validation = validateEmail(trimmedEmail);
    const passwordValidation = validateEmailPassword(emailPassword);

    setEmailError(validation);
    setEmailPasswordError(passwordValidation);

    if (validation || passwordValidation) {
        showResult(validation || passwordValidation, true);
        return;
    }

    if (trimmedEmail === user?.email?.toLowerCase()) {
        showResult("Your email hasn't changed.", true);
        return;
    }

    try {
        setLoading("email");
        await userService.updateEmail(trimmedEmail, emailPassword);

        const updatedUser = { ...user, email: trimmedEmail };
        login(token, updatedUser);
        setEmail(trimmedEmail);
        setEmailPassword("");
        setEmailPasswordError("");
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
    clearResult();

    const oldValidation = validateOldPassword(oldPassword);
    const newValidation = validateNewPassword(newPassword);
    const confirmValidation = validateConfirmPassword(
        confirmPassword,
        newPassword
    );

    setOldPasswordError(oldValidation);
    setNewPasswordError(newValidation);
    setConfirmPasswordError(confirmValidation);

    if (oldValidation || newValidation || confirmValidation) {
        showResult(
            oldValidation || newValidation || confirmValidation,
            true
        );
        return;
    }

    if (oldPassword === newPassword) {
        showResult(
            "Your new password must differ from your current password.",
            true
        );
        return;
    }

    try {
        setLoading("password");
        await userService.updatePassword(oldPassword, newPassword);

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");

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
    <main className="account-settings">
        <header className="account-settings__header">
            <div>
                <span className="account-settings__eyebrow">
                    YOUR ACCOUNT
                </span>

                <h1>Account Settings</h1>

                <p>
                    Manage your username, email address, and password.
                </p>
            </div>

            <button
                type="button"
                className="account-settings__delete-button"
                onClick={handleDeleteMyAccount}
            >
                Delete My Account
            </button>
        </header>

        {message && (
            <p
                className="account-settings__notice account-settings__notice--success"
                role="status"
            >
                <span aria-hidden="true">✓</span>
                {message}
            </p>
        )}

        {error && (
            <p
                className="account-settings__notice account-settings__notice--error"
                role="alert"
            >
                {error}
            </p>
        )}

        <div className="account-settings__sections">
            <section className="account-settings__section account-settings__section--username">
                <div className="account-settings__section-heading">
                    <span className="account-settings__section-icon" aria-hidden="true">
                        U
                    </span>
                    <div>
                        <h2>Change Username</h2>
                        <p>Choose how other people see you on ForYoum.</p>
                    </div>
                </div>

                <form
                    className="account-settings__form"
                    onSubmit={handleUsernameSubmit}
                >
                    <Input
                        label="Username"
                        value={username}
                        onChange={(event) => {
                            const value = event.target.value;
                            setUsername(value);
                            setUsernameError(validateUsername(value));
                            clearResult();
                        }}
                        placeholder="New username"
                        error={usernameError}
                        success={
                            username.trim().length >= 3 &&
                            !usernameError &&
                            username.trim() !== user?.username
                        }
                    />

                    <div className="account-settings__form-actions">
                        <Button
                            type="submit"
                            loading={loading === "username"}
                        >
                            Save Username
                        </Button>
                    </div>
                </form>
            </section>

            <section className="account-settings__section account-settings__section--email">
                <div className="account-settings__section-heading">
                    <span className="account-settings__section-icon" aria-hidden="true">
                        ✉
                    </span>
                    <div>
                        <h2>Change Email</h2>
                        <p>Update your email address securely.</p>
                    </div>
                </div>

                <form
                    className="account-settings__form"
                    onSubmit={handleEmailSubmit}
                >
                    <Input
                        label="New Email"
                        value={email}
                        onChange={(event) => {
                            const value = event.target.value;
                            setEmail(value);
                            setEmailError(validateEmail(value));
                            clearResult();
                        }}
                        placeholder="New email address"
                        error={emailError}
                        success={
                            email.trim().length > 0 &&
                            !emailError &&
                            email.trim().toLowerCase() !==
                                user?.email?.toLowerCase()
                        }
                    />

                    <Input
                        label="Current Password"
                        type="password"
                        value={emailPassword}
                        onChange={(event) => {
                            const value = event.target.value;
                            setEmailPassword(value);
                            setEmailPasswordError(
                                validateEmailPassword(value)
                            );
                            clearResult();
                        }}
                        placeholder="Enter current password"
                        error={emailPasswordError}
                        success={emailPassword.length > 0}
                    />

                    <div className="account-settings__form-actions">
                        <Button
                            type="submit"
                            loading={loading === "email"}
                        >
                            Save Email
                        </Button>
                    </div>
                </form>
            </section>

            <section className="account-settings__section account-settings__section--password">
                <div className="account-settings__section-heading">
                    <span className="account-settings__section-icon" aria-hidden="true">
                        ***
                    </span>
                    <div>
                        <h2>Change Password</h2>
                        <p>
                            Use a strong password with uppercase and lowercase
                            letters and a special character.
                        </p>
                    </div>
                </div>

                <form
                    className="account-settings__form"
                    onSubmit={handlePasswordSubmit}
                >
                    <Input
                        label="Current Password"
                        type="password"
                        value={oldPassword}
                        onChange={(event) => {
                            const value = event.target.value;
                            setOldPassword(value);
                            setOldPasswordError(validateOldPassword(value));
                            clearResult();
                        }}
                        placeholder="Current password"
                        error={oldPasswordError}
                        success={oldPassword.length > 0 && !oldPasswordError}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => {
                            const value = event.target.value;
                            setNewPassword(value);
                            setNewPasswordError(validateNewPassword(value));
                            setConfirmPasswordError(
                                confirmPassword
                                    ? validateConfirmPassword(
                                          confirmPassword,
                                          value
                                      )
                                    : ""
                            );
                            clearResult();
                        }}
                        placeholder="Enter a new password"
                        error={newPasswordError}
                        success={
                            newPassword.length > 0 && !newPasswordError
                        }
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => {
                            const value = event.target.value;
                            setConfirmPassword(value);
                            setConfirmPasswordError(
                                validateConfirmPassword(value)
                            );
                            clearResult();
                        }}
                        placeholder="Repeat your new password"
                        error={confirmPasswordError}
                        success={
                            confirmPassword.length > 0 &&
                            !confirmPasswordError
                        }
                    />

                    <div className="account-settings__form-actions">
                        <Button
                            type="submit"
                            loading={loading === "password"}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    </main>
);


}