
import { useState } from "react";
import "./Input.css";

export default function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    success
}) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType =
        isPassword && showPassword
            ? "text"
            : type;

    const inputId = label
        ? `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : undefined;

    return (
        <div
            className={[
                "form-field",
                error ? "form-field--error" : "",
                success && !error ? "form-field--success" : ""
            ].filter(Boolean).join(" ")}
        >
            {label && (
                <label
                    className="form-field__label"
                    htmlFor={inputId}
                >
                    {label}
                </label>
            )}

            <div className="form-field__control">
                <input
                    id={inputId}
                    className="form-field__input"
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? `${inputId}-error` : undefined
                    }
                />

                {isPassword && (
                    <button
                        className="form-field__password-toggle"
                        type="button"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="form-field__message form-field__message--error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {success && !error && (
                <p className="form-field__message form-field__message--success">
                    ✓ Looks good
                </p>
            )}
        </div>
    );
}
