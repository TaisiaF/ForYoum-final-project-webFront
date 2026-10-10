export default function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    success
}) {
    return (
        <div>
            <label>
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

            {error && (
                <p>{error}</p>
            )}

            {success && (
                <p>✓</p>
            )}
        </div>
    );
}