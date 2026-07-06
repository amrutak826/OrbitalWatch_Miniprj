import React from "react";
import { cn } from "@/utils/cn";

export function Badge({ className, variant = "default", ...props }) {
    const variants = {
        default: "bg-blue-600 text-white",
        success: "bg-green-600 text-white",
        warning: "bg-yellow-500 text-black",
        danger: "bg-red-600 text-white",
    };

    return (
        <span
            className={cn("px-2 py-1 rounded-md text-xs font-medium", variants[variant], className)}
            {...props}
        />
    );
}
