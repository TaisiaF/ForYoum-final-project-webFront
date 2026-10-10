export default function Button({
    children,
    onClick,
    loading
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
        >
            {loading
                ? "Loading..."
                : children}
        </button>
    );
}