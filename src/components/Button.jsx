
export default function Button({
    children,
    onClick,
    loading = false,
    type = "button"
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
        >
            {loading
                ? "Loading..."
                : children}
        </button>
    );
}