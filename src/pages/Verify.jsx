import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Verify() {

    const navigate = useNavigate();

    const {
        pendingEmail,
        verificationMode,
        login
    } = useAuth();

    const [code, setCode] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleVerify = async () => {

        try {

            setError("");
            setLoading(true);

            if (
                verificationMode ===
                "register"
            ) {

                await authService
                    .verifyRegistration({
                        email: pendingEmail,
                        code
                    });

                navigate("/auth/login");

                return;
            }

            const response =
                await authService
                    .verifyLogin({
                        email: pendingEmail,
                        code
                    });

            login(
                response.token,
                response.user
            );

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
        <div>

            <h1>Verification</h1>

            <p>
                Enter the code sent to
            </p>

            <p>
                {pendingEmail}
            </p>

            <Input
                label="Verification Code"
                value={code}
                onChange={(event) =>
                    setCode(event.target.value)
                }
                placeholder="Enter code"
            />

            {error && (
                <p>{error}</p>
            )}

            <Button
                onClick={handleVerify}
                loading={loading}
            >
                Verify
            </Button>

        </div>
    );
}