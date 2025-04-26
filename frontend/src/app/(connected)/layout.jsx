"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import { BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AuthLayout({ children }) {
    const { token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
        router.push("/login");
        }
    }, [token, router]);

    if (!token) return null;

    return <div className="w-full h-screen lg:h-screen flex">
        {/* Left */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] pt-2 dark:bg-gray-700">
            <Link href="/" className="flex items-center justify-center gap-2 p-3"><BookOpen /><span className="hidden lg:block">DocSub</span></Link>
            <Menu></Menu>
        </div>
        
        {/* Right */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-auto bg-gray-100 dark:bg-transparent">
            <Navbar/>
            {children}
        </div>
    </div>;
}
