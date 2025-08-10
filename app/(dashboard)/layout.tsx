
'use client';

import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/page";

export default function Layout({ children }: { children: React.ReactNode }) {
    // useEffect(() => {
    //     const handleContextMenu = (e: { preventDefault: () => void; }) => {
    //         e.preventDefault();
    //     };
    //     const handleKeyDown = (e: { keyCode: number; ctrlKey: any; shiftKey: any; preventDefault: () => void; }) => {
    //         if (
    //             e.keyCode === 123 || // F12
    //             (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I or Ctrl+Shift+J
    //             (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    //         ) {
    //             e.preventDefault();
    //         }
    //     };
    //     document.addEventListener("contextmenu", handleContextMenu);
    //     document.addEventListener("keydown", handleKeyDown);
    //     return () => {
    //         document.removeEventListener("contextmenu", handleContextMenu);
    //         document.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, []);

    return (
        <SidebarProvider className="bg-gray-800">
            <AppSidebar />
            <main className="bg-gray-800 w-full">
                {children}
            </main>
        </SidebarProvider>
    );
}
