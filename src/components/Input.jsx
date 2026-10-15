import { useState } from "react";

export default function Input({
label,
value,
onChange,
placeholder,
type = "text",
error,
success
}) {
const [showPassword, setShowPassword] =
useState(false);


const isPassword = type === "password";

const inputType =
    isPassword && showPassword
        ? "text"
        : type;

return (
    <div>
        <label>
            {label}
        </label>

        <div>
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() =>
                        setShowPassword((previous) => !previous)
                    }
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            )}
        </div>

        {error && (
            <p>{error}</p>
        )}

        {success && (
            <p>✓</p>
        )}
    </div>
);


}
