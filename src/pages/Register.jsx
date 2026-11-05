
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

import "./Register.css";

export default function Register() {
    const navigate = useNavigate();

    const {
        setPendingEmail,
        setVerificationMode
    } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateUsername = (value) => {
        if (value.trim().length < 3) {
            return "Username must be at least 3 characters.";
        }

        return "";
    };

    const validateEmail = (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            return "Enter a valid email address.";
        }

        return "";
    };

    const validatePassword = (value) => {
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

    const validateConfirmPassword = (
        value,
        originalPassword = password
    ) => {
        if (value !== originalPassword) {
            return "Passwords do not match.";
        }

        return "";
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");

        const usernameValidation = validateUsername(username);
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);
        const confirmPasswordValidation =
            validateConfirmPassword(confirmPassword);

        setUsernameError(usernameValidation);
        setEmailError(emailValidation);
        setPasswordError(passwordValidation);
        setConfirmPasswordError(confirmPasswordValidation);

        if (
            usernameValidation ||
            emailValidation ||
            passwordValidation ||
            confirmPasswordValidation
        ) {
            return;
        }

        try {
            setLoading(true);

            const response = await authService.register({
                username: username.trim(),
                email: email.trim(),
                password
            });

            setPendingEmail(response.email);
            setVerificationMode("register");

            navigate("/auth/verify");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <section className="register-card">
                <header className="register-header">
                    <span className="register-eyebrow">
                        JOIN THE COMMUNITY
                    </span>

                    <h1>Create your ForYoum account</h1>

                </header>

                <form
                    className="register-form"
                    onSubmit={handleRegister}
                >
                    <Input
                        label="Username"
                        value={username}
                        placeholder="Choose a username"
                        onChange={(event) => {
                            const value = event.target.value;

                            setUsername(value);
                            setUsernameError(validateUsername(value));
                            setError("");
                        }}
                        error={usernameError}
                        success={
                            username.trim().length > 0 &&
                            !usernameError
                        }
                    />

                    <Input
                        label="Email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(event) => {
                            const value = event.target.value;

                            setEmail(value);
                            setEmailError(validateEmail(value));
                            setError("");
                        }}
                        error={emailError}
                        success={
                            email.trim().length > 0 &&
                            !emailError
                        }
                    />

                    <div className="register-password-field">
                        <Input
                            label="Password"
                            value={password}
                            placeholder="Create a password"
                            type="password"
                            onChange={(event) => {
                                const value = event.target.value;

                                setPassword(value);
                                setPasswordError(
                                    validatePassword(value)
                                );
                                setConfirmPasswordError(
                                    validateConfirmPassword(
                                        confirmPassword,
                                        value
                                    )
                                );
                                setError("");
                            }}
                            error={passwordError}
                            success={
                                password.length > 0 &&
                                !passwordError
                            }
                        />

                        <p className="register-password-hint">
                            Use at least 8 characters, including an
                            uppercase letter, a lowercase letter,
                            and a special character.
                        </p>
                    </div>

                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        placeholder="Enter your password again"
                        type="password"
                        onChange={(event) => {
                            const value = event.target.value;

                            setConfirmPassword(value);
                            setConfirmPasswordError(
                                validateConfirmPassword(value)
                            );
                            setError("");
                        }}
                        error={confirmPasswordError}
                        success={
                            confirmPassword.length > 0 &&
                            !confirmPasswordError
                        }
                    />

                    {error && (
                        <div
                            className="register-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="register-submit"
                    >
                        Create Account
                    </Button>
                </form>

                <footer className="register-footer">
                    <span>Already have an account?</span>

                    <button
                        type="button"
                        className="register-login-link"
                        onClick={() => navigate("/auth/login")}
                    >
                        Log in
                    </button>
                </footer>
            </section>

        </main>
    );
}
