"use client";

import { Bell, UserCircle, LogOut, MailWarning } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { axiosClient } from "@/utils/axios-client";

const Navbar = () => {
    const { user, setUser, setToken } = useAuthContext();
    const router = useRouter();

    const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Invité";
    const role = user?.roles?.[0] || "Membre"; 
    const isEmailNotVerified = user?.email_verified_at === null;

    // 🛠 Logout handler
    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
                },
            });
            setUser(null);
            setToken(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed (maybe already logged out)", error);
        } finally {
            
        }
    };

    return (
        <div className="flex p-3 text-sm justify-between items-center">
            {/* Verify Email Button */}
            <div>
                {isEmailNotVerified && (
                    <button className="cursor-pointer flex items-center gap-3 h-full rounded-md bg-orange-100 border-2 border-orange-400 text-orange-700 dark:bg-orange-900/50 dark:border-orange-500 dark:text-orange-300 transition-opacity duration-300 p-2">
                        <MailWarning size={22} />
                        <span className="hidden md:block">Vérifiez votre e‑mail</span>
                    </button>
                )}
            </div>

            {/* Right Section */}
            <div className="flex gap-5 items-center">
                {/* Notification Bell */}
                <div className="relative">
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-500 rounded-full flex justify-center items-center text-xs font-light text-gray-100">1</div>
                    <Bell size={22} />
                </div>

                {/* 🔥 Logout Icon with Click */}
                <button onClick={handleLogout}>
                    <LogOut size={22} className="cursor-pointer hover:text-violet-400" />
                </button>

                {/* User Info */}
                <div className="flex flex-col justify-end text-end">
                    <div className="font-bold">{fullName}</div>
                    <div className="text-xs capitalize">{role}</div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
