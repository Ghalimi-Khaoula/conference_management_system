"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // 🛠️ Needed to detect current page
import { LayoutDashboard, User, CalendarDays, Settings, Send,Crown } from "lucide-react"; // Icons!
import { useEffect, useState } from "react";

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: LayoutDashboard,
                label: "Tableau De Bord",
                href: "/dashboard",
            },
            {
                icon: CalendarDays,
                label: "Conférences",
                href: "/my-conferences",
            },
            {
                icon: Send,
                label: "Soumissions",
                href: "/my-submissions",
            },
        ],
    },
    {
        title: "AUTRES",
        items: [
            {
                icon: User,
                label: "Profil",
                href: "/profil",
            },
            {
                icon: Settings,
                label: "Paramètres",
                href: "/settings",
            },
        ],
    },
];

const Menu = ({user}) => {
    const pathname = usePathname();
    const roles = user?.roles || [];

    const [menuItems, setMenuItems] = useState([
        {
            title: "MENU",
            items: [
                { icon: LayoutDashboard, label: "Tableau De Bord", href: "/dashboard" },
                { icon: CalendarDays, label: "Conférences", href: "/my-conferences" },
                { icon: Send, label: "Soumissions", href: "/my-submissions" },
            ],
        },
        {
            title: "AUTRES",
            items: [
                { icon: User, label: "Profil", href: "/profil" },
                { icon: Settings, label: "Paramètres", href: "/settings" },
            ],
        },
    ]);

    // 🛠️ If the user is admin, inject Admin Option into "AUTRES"
    useEffect(() => {
        if (roles.includes('admin')) {
            setMenuItems((prevItems) => {
                // Clone the array to not mutate directly
                const newItems = [...prevItems];
                
                // Find "AUTRES" section
                const autresSection = newItems.find(section => section.title === "AUTRES");
                
                if (autresSection) {
                    // Only add if it doesn't exist already
                    const alreadyExists = autresSection.items.some(item => item.href === "/admin");
                    
                    if (!alreadyExists) {
                        autresSection.items.push({
                            icon: Crown,
                            label: "Options Admin",
                            href: "/admin",
                        });
                    }
                }

                return newItems;
            });
        }
    }, [roles]);

    return (
        <div className="flex flex-col items-center lg:items-start lg:px-4 py-4 text-sm">
            {menuItems.map((section) => (
                <div key={section.title} className="mb-6 flex flex-col gap-2">
                    <span className="text-gray-500 dark:text-gray-400 uppercase text-sm font-bold hidden lg:block">
                        {section.title}
                    </span>
                    <div className="flex flex-col gap-5">
                        {section.items.map((item) => {
                            const isActive = pathname === item.href; // check if current page

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 text-sm font-medium transition-colors ${isActive
                                            ? "text-violet-600 dark:text-violet-400"
                                            : "text-gray-700 hover:text-violet-500 dark:text-gray-300 dark:hover:text-violet-400"
                                        }`}
                                >
                                    <item.icon size={22} />
                                    <p className="hidden xl:block lg:block">{item.label}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
