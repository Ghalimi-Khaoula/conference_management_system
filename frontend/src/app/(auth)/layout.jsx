"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function AuthLayout({ children }) {
    const { token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push("/dashboard");
        }
    }, [token, router]);

    if (token) return null;

    return <div className="w-full h-screen lg:h-screen">{children}</div>;
}
