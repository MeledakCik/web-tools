"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/page";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <SidebarProvider>

            {isMobile && (
                <div className="fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="p-2 rounded-full bg-gray-800/80 backdrop-blur-md text-white shadow-lg hover:bg-gray-700 transition"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            )}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                className={`${isMobile
                        ? `fixed top-0 left-0 h-full w-[250px] bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`
                        : "w-[250px] bg-gray-900 h-full fixed left-0 top-0 z-50"
                    }`}
            >
                <AppSidebar onItemClick={() => isMobile && setIsOpen(false)} />
            </div>
            <main className="min-h-screen bg-white w-full lg:pl-[250px]">
                {children}
            </main>
        </SidebarProvider>
    );
}
