"use client"; // Required since AuthProvider uses useState, useContext, etc.

import { AuthProvider } from "./AuthContext";

export function Providers({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
