"use client"

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ firstName: "John" });
    const [token, _setToken] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        if (storedToken) _setToken(storedToken);
        setLoaded(true);
}, []);

const setToken = (token) => {
    _setToken(token);
    if (token) {
        localStorage.setItem("ACCESS_TOKEN", token);
    } else {
        localStorage.removeItem("ACCESS_TOKEN");
    }
};

    if (!loaded) return null;

return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuthContext = () => useContext(AuthContext);
