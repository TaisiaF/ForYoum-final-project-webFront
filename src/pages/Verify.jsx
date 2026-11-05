
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

import "./Verify.css";

export default function Verify() {
    const navigate = useNavigate();

    const {
        pendingEmail,
        verificationMode,
        login
    } = useAuth();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        try {
            setError("");
            setLoading(true);

            if (verificationMode === "register") {
                await authService.verifyRegistration({
                    email: pendingEmail,
                    code
                });

                navigate("/auth/login");
                return;
            }

            const response = await authService.verifyLogin({
                email: pendingEmail,
                code
            });

            login(response.token, response.user);
            navigate("/");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="verify-page">
            <section className="verify-card">
                <div className="verify-card__icon" aria-hidden="true">
                    <span>✉</span>
                </div>

                <p className="verify-card__eyebrow">
                    ONE MORE STEP
                </p>

                <h1 className="verify-card__title">
                    Check your email
                </h1>

                <p className="verify-card__description">
                    We've sent a verification code to
                </p>

                <p className="verify-card__email">
                    {pendingEmail || "your email address"}
                </p>

                <div className="verify-card__form">
                    <Input
                        label="Verification Code"
                        value={code}
                        onChange={(event) =>
                            setCode(event.target.value)
                        }
                        placeholder="Enter your code"
                    />

                    <p className="verify-card__hint">
                        Enter the code from your email to{" "}
                        {verificationMode === "register"
                            ? "complete your registration."
                            : "finish signing in."}
                    </p>

                    {error && (
                        <p
                            className="verify-card__error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <Button
                        onClick={handleVerify}
                        loading={loading}
                        disabled={loading}
                        className="verify-card__button"
                    >
                        Verify code
                    </Button>
                </div>

                <p className="verify-card__footer">
                    Make sure to check your spam folder if you
                    can't find the email.
                </p>
            </section>
        </main>
    );
}
