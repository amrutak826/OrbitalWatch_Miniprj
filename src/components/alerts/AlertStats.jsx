import React from "react";
import { motion } from "framer-motion";
import StatusCard from "../dashboard/StatusCard";
import { AlertTriangle, Activity, Shield, TrendingUp } from "lucide-react";

export default function AlertStats({ totalAlerts, activeAlerts, criticalAlerts, isLoading }) {
    const stats = [
        {
            title: "Total Alerts",
            value: isLoading ? "..." : totalAlerts,
            icon: Activity,
            color: "from-blue-500 to-cyan-500",
            trend: "Last 30 days"
        },
        {
            title: "Active Alerts",
            value: isLoading ? "..." : activeAlerts,
            icon: AlertTriangle,
            color: "from-yellow-500 to-orange-500",
            trend: activeAlerts > 0 ? "Requires attention" : "All resolved"
        },
        {
            title: "Critical Risk",
            value: isLoading ? "..." : criticalAlerts,
            icon: Shield,
            color: "from-red-500 to-pink-500",
            trend: criticalAlerts > 0 ? "Immediate action" : "Safe levels"
        },
        {
            title: "Detection Rate",
            value: isLoading ? "..." : "99.7%",
            icon: TrendingUp,
            color: "from-green-500 to-emerald-500",
            trend: "System accuracy"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatusCard key={stat.title} {...stat} index={index} />
            ))}
        </div>
    );
}