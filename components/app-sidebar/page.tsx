import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Image from "next/image";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Exploit", url: "/exploit", icon: Inbox },
    { title: "Mail Generator", url: "/mail", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
];

export function AppSidebar({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <div className="flex flex-col bg-gray-900 border-r border-gray-800 shadow-lg h-full">
            <SidebarContent className="bg-gray-900 text-gray-100">
                <div className="flex flex-col items-center gap-2 p-6 border-b border-gray-800">
                    <Image
                        src="/profile.jpg"
                        alt="Profile"
                        width={90}
                        height={90}
                        className="rounded-full border-2 border-gray-700 shadow-md hover:scale-105 transition-transform duration-300"
                    />
                    <div className="text-center">
                        <h2 className="text-lg font-semibold tracking-wide">Kakang Kasyaf</h2>
                        <p className="text-sm text-gray-400">Administrator</p>
                    </div>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent className="gap-2 px-3 pt-4">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-gray-800/60 transition-colors rounded-lg px-3 py-2 flex items-center gap-3 group"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-3 w-full"
                                            onClick={onItemClick}
                                        >
                                            <item.icon className="text-gray-400 group-hover:text-white transition-colors" />
                                            <span className="text-gray-200 group-hover:text-white transition-colors">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <a className="cursor-pointer rounded-lg flex items-center gap-3 hover:bg-gray-800/60 transition-colors text-gray-200 px-3 py-2 group">
                                        <Settings className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                                        <span>Setting</span>
                                    </a>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-gray-800 text-gray-200 border border-gray-700" align="start">
                                    <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="hover:bg-gray-700">Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-gray-700">Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-gray-700">Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-gray-700">Keyboard shortcuts <DropdownMenuShortcut>⌘K</DropdownMenuShortcut></DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="hover:bg-gray-700">Team</DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="bg-gray-800 border border-gray-700">
                                                    <DropdownMenuItem className="hover:bg-gray-700">Email</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-gray-700">Message</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-700" />
                                                    <DropdownMenuItem className="hover:bg-gray-700">More...</DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem className="hover:bg-gray-700">New Team <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut></DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem className="hover:bg-gray-700">GitHub</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-700">Support</DropdownMenuItem>
                                    <DropdownMenuItem disabled>API</DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem className="hover:bg-gray-700">Log out <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </div>
    );
}
