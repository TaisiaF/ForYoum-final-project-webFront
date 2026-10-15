export default function ProfilePicture({
    src,
    alt = "Profile picture",
    size = 40
}) {
    return (
        <img
            src={src || "/default-avatar.png"}
            alt={alt}
            width={size}
            height={size}
            style={{
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                backgroundColor: "#ddd"
            }}
        />
    );
}