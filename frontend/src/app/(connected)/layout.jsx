"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function AuthLayout({ children }) {
    const { token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
        router.push("/login");
        }
    }, [token, router]);

    if (!token) return null;

    return <div className="w-full h-[100svh]">{children}</div>;
}
