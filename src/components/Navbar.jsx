
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="site-navbar">
            <div className="site-navbar__inner">
                <div className="site-navbar__brand">
                    <span className="site-navbar__logo" aria-hidden="true">
                       🗩
                    </span>

                    <span className="site-navbar__brand-name">
                        ForYoum
                    </span>
                </div>

                <div className="site-navbar__links">
                    <Link to="/" className="site-navbar__link">
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={`/profile/${user.id}`}
                                className="site-navbar__link"
                            >
                                Profile
                            </Link>

                            <span className="site-navbar__username">
                                Hi, {user.username}
                            </span>

                            <button
                                type="button"
                                className="site-navbar__logout"
                                onClick={logout}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="site-navbar__link"
                            >
                                Log in
                            </Link>

                            <Link
                                to="/auth/register"
                                className="site-navbar__link site-navbar__link--primary"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
