import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Login() {

    const navigate = useNavigate();

    const {
        setPendingEmail,
        setVerificationMode
    } = useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [usernameError, setUsernameError] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const validateUsername = (value) => {
        if (value.length < 3) {
            return "Username must be at least 3 characters.";
        }

        return "";
    };

    const validatePassword = (value) => {
        if (value.length < 8) {
            return "Password must be at least 8 characters.";
        }

        return "";
    };

    const handleLogin = async () => {

        setError("");

        const usernameValidation =
            validateUsername(username);

        const passwordValidation =
            validatePassword(password);

        setUsernameError(usernameValidation);
        setPasswordError(passwordValidation);

        if (
            usernameValidation ||
            passwordValidation
        ) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await authService.login({
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
        <div>

            <h1>Login</h1>

            <Input
                label="Username"
                value={username}
                placeholder="Enter username"
                onChange={(event) => {
                    const value =
                        event.target.value;

                    setUsername(value);

                    setUsernameError(
                        validateUsername(value)
                    );
                }}
                error={usernameError}
                success={
                    username.length > 0 &&
                    !usernameError
                }
            />

            <Input
                label="Password"
                value={password}
                placeholder="Enter password"
                type="password"
                onChange={(event) => {
                    const value =
                        event.target.value;

                    setPassword(value);

                    setPasswordError(
                        validatePassword(value)
                    );
                }}
                error={passwordError}
                success={
                    password.length > 0 &&
                    !passwordError
                }
            />

            {error && (
                <p>{error}</p>
            )}

            <Button
                onClick={handleLogin}
                loading={loading}
            >
                Login
            </Button>

            <p
                onClick={() =>
                    navigate("/auth/register")
                }
            >
                Don't have an account? Register
            </p>

        </div>
    );
}