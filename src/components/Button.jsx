
import "./Button.css";

export default function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) {
    const buttonClassName = [
        "btn",
        `btn--${variant}`,
        className
    ].filter(Boolean).join(" ");

    return (
        <button
            {...props}
            type={type}
            className={buttonClassName}
            onClick={onClick}
            disabled={loading || disabled}
            aria-busy={loading || undefined}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}
