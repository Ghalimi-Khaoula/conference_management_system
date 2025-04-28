"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "@/utils/axios-client"; // Assuming you have an axios instance

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // initially null
    const [token, _setToken] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        if (storedToken) {
            _setToken(storedToken);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (token && !user) {
            // If token exists but user info is missing, fetch the user
            fetchUser();
        }
    }, [token]);
    useEffect(() => {
        if (token && !user) {
            fetchUser();
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            console.log("🧠 User after reload:", user);
        }
    }, [user]);

    const fetchUser = async () => {
        try {
            const { data } = await axiosClient.get("/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setToken(null); // If invalid token, clear it
        }
    };

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
