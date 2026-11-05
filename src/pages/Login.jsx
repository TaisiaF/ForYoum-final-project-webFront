
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

import "./Login.css";

export default function Login() {
    const navigate = useNavigate();

    const {
        setPendingEmail,
        setVerificationMode
    } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event?.preventDefault();
        setError("");

        const usernameValidation =
            username.trim() === ""
                ? "Username is required."
                : "";

        const passwordValidation =
            password === ""
                ? "Password is required."
                : "";

        setUsernameError(usernameValidation);
        setPasswordError(passwordValidation);

        if (usernameValidation || passwordValidation) {
            return;
        }

        try {
            setLoading(true);

            const response = await authService.login({
                username,
                password
            });

            setPendingEmail(response.email);
            setVerificationMode("login");

            navigate("/auth/verify");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">
                <header className="login-header">
                    <span className="login-eyebrow">
                        WELCOME BACK
                    </span>

                    <h1>Log in to ForYoum</h1>

                </header>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >
                    <Input
                        label="Username"
                        value={username}
                        placeholder="Enter username"
                        onChange={(event) => {
                            const value = event.target.value;
                            setUsername(value);

                            setUsernameError(
                                value.trim() === ""
                                    ? "Username is required."
                                    : ""
                            );
                        }}
                        error={usernameError}
                        success={
                            username.trim().length > 0 &&
                            !usernameError
                        }
                    />

                    <Input
                        label="Password"
                        value={password}
                        placeholder="Enter password"
                        type="password"
                        onChange={(event) => {
                            const value = event.target.value;
                            setPassword(value);

                            setPasswordError(
                                value === ""
                                    ? "Password is required."
                                    : ""
                            );
                        }}
                        error={passwordError}
                        success={
                            password.length > 0 &&
                            !passwordError
                        }
                    />

                    {error && (
                        <div
                            className="login-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="login-submit"
                    >
                        Log In
                    </Button>
                </form>

                <footer className="login-footer">
                    <span>New to ForYoum?</span>

                    <button
                        type="button"
                        className="login-register-link"
                        onClick={() => navigate("/auth/register")}
                    >
                        Create an account
                    </button>
                </footer>
            </section>

        </main>
    );
}
