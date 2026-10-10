import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const [pendingEmail, setPendingEmail] = useState(null);
    const [verificationMode, setVerificationMode] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => { restoreSession(); }, []);

    const restoreSession = () => {
        try {
            const storedToken =
                localStorage.getItem("token");

            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) 
            {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }
        catch (error) {
            console.log
            (
                "Session restore failed",
                error
            );
        } 
        finally 
        { setLoading(false);}
    };


    const login = (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)
        );

        setToken(token);
        setUser(user);
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        setPendingEmail(null);
        setVerificationMode(null);
    };


    return (
        <AuthContext.Provider
            value={{
                token,
                user,

                pendingEmail,
                setPendingEmail,

                verificationMode,
                setVerificationMode,

                loading,

                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);