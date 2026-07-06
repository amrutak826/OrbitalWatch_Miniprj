import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils/createPageUrl";
import { Satellite, Globe, AlertTriangle, BarChart3 } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
    {
        title: "Mission Control",
        url: createPageUrl("Home"),
        icon: Globe,
    },
    {
        title: "Satellite Tracking",
        url: createPageUrl("Visualization"),
        icon: Satellite,
    },
    {
        title: "Collision Alerts",
        url: createPageUrl("Alerts"),
        icon: AlertTriangle,
    },
];

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-900">

                {/* Theme Colors */}
                <style>{`
                    :root {
                        --bg-primary: #0f172a;
                        --bg-secondary: #1e293b;
                        --accent-blue: #3b82f6;
                        --accent-cyan: #06b6d4;
                        --text-primary: #f8fafc;
                        --text-secondary: #cbd5e1;
                    }
                `}</style>

                {/* Sidebar */}
                <Sidebar className="border-r border-gray-800 bg-gray-900">

                    {/* Header */}
                    <SidebarHeader className="border-b border-gray-800 p-4 bg-gradient-to-r from-blue-900 to-cyan-900">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Satellite className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-lg">SpaceGuard</h2>
                                <p className="text-xs text-cyan-300">Space Traffic Control</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    {/* Navigation */}
                    <SidebarContent className="p-3 bg-gray-900">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                                Navigation
                            </SidebarGroupLabel>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className={`hover:bg-blue-900/50 hover:text-blue-300 
                                                    transition-all duration-200 rounded-lg mb-1 
                                                    ${
                                                    location.pathname === item.url
                                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                                        : "text-gray-300"
                                                }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* System Status */}
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                                System Status
                            </SidebarGroupLabel>

                            <SidebarGroupContent>
                                <div className="px-3 space-y-3">

                                    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm text-gray-300">System Online</span>
                                        </div>
                                        <p className="text-xs text-gray-500">All systems operational</p>
                                    </div>

                                    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BarChart3 className="w-4 h-4 text-cyan-500" />
                                            <span className="text-sm text-gray-300">Tracking Active</span>
                                        </div>
                                        <p className="text-xs text-gray-500">~2,000 objects monitored</p>
                                    </div>

                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* Footer */}
                    <SidebarFooter className="border-t border-gray-800 p-4 bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">SC</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm truncate">Space Command</p>
                                <p className="text-xs text-gray-400 truncate">Mission Control Officer</p>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-gray-900">

                    {/* Mobile Header */}
                    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 md:hidden">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 text-white" />
                            <h1 className="text-xl font-semibold text-white">SpaceGuard</h1>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-gray-800">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
