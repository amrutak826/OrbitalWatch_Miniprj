import * as React from "react";
import { cn } from "@/utils/cn";

export const Button = React.forwardRef(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const base =
            "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700",
            outline: "border border-gray-600 text-gray-200 hover:bg-gray-800",
            ghost: "text-gray-300 hover:bg-gray-800",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2",
            lg: "px-6 py-3 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
