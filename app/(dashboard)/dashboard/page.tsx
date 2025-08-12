"use client";
import * as React from "react"
import { useEffect, useState } from "react";
import { DataTableDemo } from "@/components/tabel/page";
import { motion } from "framer-motion";
import { ShoppingBag, Users, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import StatCard from "@/components/card/page";

export default function Dashboard() {
    const [ipAddress, setIpAddress] = useState<string>("-");
    const [totalRequests, setTotalRequests] = useState<number>(0);
    const [deviceName, setDeviceName] = useState<string>("-");
    useEffect(() => {
        fetch("https://api.ipify.org?format=json")
            .then((res) => res.json())
            .then((data) => setIpAddress(data.ip))
            .catch(() => setIpAddress("Tidak diketahui"));
        fetch("/api/total-requests")
            .then((res) => res.json())
            .then((data) => setTotalRequests(data.total));
        setDeviceName(navigator.userAgent);
    }, []);

    const tags = [
        "Dump Facebook ID",
        "Graber Domain",
        "Dump Instagram Name",
        "Create Instagram Account",
        "Create Facebook Account",
        "Email Generator",
    ];



    return (
        <div className="relative ">
            <header className='bg-blue-400 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-blue-500 p-4'>
                <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
                    <h1 className='text-2xl font-semibold text-gray-100'>Dashboard</h1>
                </div>
            </header>
            <div className="gap-4 p-4">
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Device IP' icon={Zap} value={ipAddress} color='#6366F1' />
                    <StatCard name='Total Requests' icon={Users} value={totalRequests} color='#8B5CF6' />
                    <StatCard name='Device Name' icon={ShoppingBag} value={deviceName} color='#EC4899' />
                </motion.div>
            </div>
            <div className="p-4">
                <motion.div className="bg-gray-700 border border-gray-200 shadow p-4 rounded-[15px] shadow flex gap-2">
                    <DataTableDemo />
                    <ScrollArea className="h-98 w-68 rounded-md border border-gray-700 ">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium text-gray-100">Tools</h4>
                            {tags.map((tag) => (
                                <React.Fragment key={tag}>
                                    <div className="text-sm cursor-pointer text-gray-100">
                                        {tag}
                                    </div>
                                    <Separator className="my-2" />
                                </React.Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                </motion.div>
            </div>
        </div>
    );
}
