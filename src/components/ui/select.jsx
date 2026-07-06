import * as React from "react";
import { cn } from "@/utils/cn";

export const Select = ({ children, value, onChange }) => {
    return (
        <select
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-md border border-gray-700"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {children}
        </select>
    );
};

export const SelectTrigger = ({ children }) => children;
export const SelectContent = ({ children }) => children;

export const SelectItem = ({ children, value }) => {
    return <option value={value}>{children}</option>;
};

export const SelectValue = ({ children }) => children;
