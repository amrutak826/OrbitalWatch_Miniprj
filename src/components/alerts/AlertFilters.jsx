import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AlertFilters({ filters, onFiltersChange }) {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.risk_level} onValueChange={(value) => handleFilterChange('risk_level', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                    <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.time_range} onValueChange={(value) => handleFilterChange('time_range', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                    <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}