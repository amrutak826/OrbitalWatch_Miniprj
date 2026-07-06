import React from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }) {
    return (
        <div
            className={cn("rounded-xl border border-gray-800 bg-gray-900 p-4 shadow", className)}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }) {
    return (
        <div className={cn("mb-3", className)} {...props} />
    );
}

export function CardTitle({ className, ...props }) {
    return (
        <h3 className={cn("text-lg font-semibold text-white", className)} {...props} />
    );
}

export function CardContent({ className, ...props }) {
    return (
        <div className={cn("text-gray-300", className)} {...props} />
    );
}
