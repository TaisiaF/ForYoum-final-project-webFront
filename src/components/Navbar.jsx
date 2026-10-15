import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { user, logout } = useAuth();

    return (
        <nav>
            <div>

                <Link to="/">
                    Home
                </Link>

                {user ? (
                    <>
                        <span>
                            hello {user.username}
                        </span>

                        <button onClick={logout}>
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth/login">
                            Log in
                        </Link>

                        <Link to="/auth/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}