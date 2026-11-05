import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./ProfilePicture.css";

export default function ProfilePicture({
    src,
    alt = "Profile picture",
    size = 40
}) {
    const [isOpen, setIsOpen] = useState(false);

    const imageSrc = src || "/default-avatar.png";

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                className="profile-picture-button"
                onClick={(event) => {
                    event.stopPropagation();
                    setIsOpen(true);
                }}
                aria-label={`View ${alt} in full size`}
            >
                <img
                    className="profile-picture"
                    src={imageSrc}
                    alt={alt}
                    width={size}
                    height={size}
                />
            </button>

            {isOpen && createPortal(
                <div
                    className="profile-picture-modal"
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen(false);
                    }}
                >
                    <button
                        type="button"
                        className="profile-picture-modal__close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close image preview"
                    >
                        ×
                    </button>

                    <img
                        className="profile-picture-modal__image"
                        src={imageSrc}
                        alt={alt}
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </>
    );
}