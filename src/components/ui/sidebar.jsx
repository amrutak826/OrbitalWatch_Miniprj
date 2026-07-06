import React, { createContext, useContext, useState } from "react";
import { cn } from "@/utils/cn";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(true);
    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function Sidebar({ className, children }) {
    const { open } = useContext(SidebarContext);
    return (
        <div
            className={cn(
                "h-screen w-64 bg-gray-900 border-r border-gray-800 transition-all",
                open ? "translate-x-0" : "-translate-x-full",
                className
            )}
        >
            {children}
        </div>
    );
}

export const SidebarHeader = ({ children, className }) => (
    <div className={cn("p-4", className)}>{children}</div>
);

export const SidebarContent = ({ children, className }) => (
    <div className={cn("p-2 space-y-2", className)}>{children}</div>
);

export const SidebarGroup = ({ children }) => <div>{children}</div>;
export const SidebarGroupLabel = ({ children }) => (
    <div className="text-gray-400 px-2 text-xs uppercase">{children}</div>
);

export const SidebarGroupContent = ({ children }) => (
    <div className="mt-2">{children}</div>
);

export const SidebarMenu = ({ children }) => (
    <ul className="space-y-1">{children}</ul>
);

export const SidebarMenuItem = ({ children }) => <li>{children}</li>;

export const SidebarMenuButton = ({ children, active }) => (
    <button
        className={cn(
            "w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition",
            active
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
        )}
    >
        {children}
    </button>
);

export const SidebarFooter = ({ children }) => (
    <div className="p-3 border-t border-gray-800">{children}</div>
);

export const SidebarTrigger = () => {
    const { setOpen, open } = useContext(SidebarContext);
    return (
        <button
            onClick={() => setOpen(!open)}
            className="absolute top-4 left-4 bg-gray-700 text-gray-200 px-2 py-1 rounded"
        >
            ☰
        </button>
    );
};
