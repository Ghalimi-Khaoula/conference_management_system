
import { Bell, UserCircle,LogOut,MailWarning } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext"; // << use it directly
import { axiosClient } from "@/utils/axios-client";

const Navbar = ()=>{
    const { user, setUser, setToken } = useAuthContext();
    const router = useRouter();
    return (
        <div className="flex p-3 text-sm justify-between items-center">
            <button className="cursor-pointer flex items-center gap-3 h-full rounded-md bg-orange-100 border-2 border-orange-400 text-orange-700 dark:bg-orange-900/50 dark:border-orange-500 dark:text-orange-300 transition-opacity duration-300 p-2">
                <MailWarning size={22}/> <span className="hidden md:block">Vérifiez votre e‑mail</span>
            </button>
            <div className="flex gap-5 items-center">
                <div className="relative">
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-500 rounded-full flex justify-center items-center text-xs font-light text-gray-100">1</div>
                    <Bell size={22} />
                </div>
                <LogOut size={22} />
                <div className="flex flex-col justify-end">
                    <div className="font-bold text-end">John Doe</div>
                    <div className="text-end">Membre</div>
                </div>
            </div>
        </div>
    )
}
export default Navbar;