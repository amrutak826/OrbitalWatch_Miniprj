import React, { useState, useEffect, useCallback } from "react";
import { CollisionAlert, Satellite } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    AlertTriangle,
    Filter,
    Download,
    Search,
    Clock,
    Activity,
    TrendingUp,
    Shield
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import AlertCard from "../components/alerts/AlertCard";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertStats from "../components/alerts/AlertStats";

const riskColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200"
};

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [satellites, setSatellites] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        risk_level: "all",
        time_range: "all"
    });
    const [isLoading, setIsLoading] = useState(true);

    const applyFilters = useCallback(() => {
        let filtered = [...alerts];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(alert =>
                alert.satellite_1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.satellite_2?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (filters.status !== "all") {
            filtered = filtered.filter(alert => alert.status === filters.status);
        }

        // Risk level filter
        if (filters.risk_level !== "all") {
            filtered = filtered.filter(alert => alert.risk_level === filters.risk_level);
        }

        // Time range filter
        if (filters.time_range !== "all") {
            const now = new Date();
            const cutoff = new Date();

            switch (filters.time_range) {
                case "24h":
                    cutoff.setHours(now.getHours() - 24);
                    break;
                case "7d":
                    cutoff.setDate(now.getDate() - 7);
                    break;
                case "30d":
                    cutoff.setDate(now.getDate() - 30);
                    break;
            }

            filtered = filtered.filter(alert => new Date(alert.predicted_time) >= cutoff);
        }

        setFilteredAlerts(filtered);
    }, [alerts, searchTerm, filters]);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const loadData = async () => {
        try {
            const [alertData, satelliteData] = await Promise.all([
                CollisionAlert.list('-created_date', 100),
                Satellite.list('-created_date', 200)
            ]);
            setAlerts(alertData);
            setSatellites(satelliteData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setIsLoading(false);
    };

    const exportAlerts = () => {
        const csvContent = [
            "Satellite 1,Satellite 2,Risk Level,Predicted Time,Min Distance,Probability,Status",
            ...filteredAlerts.map(alert =>
                `${alert.satellite_1},${alert.satellite_2},${alert.risk_level},${alert.predicted_time},${alert.minimum_distance},${alert.probability},${alert.status}`
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `collision_alerts_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const activeAlerts = alerts.filter(alert => alert.status === 'active');
    const criticalAlerts = alerts.filter(alert => alert.risk_level === 'critical');

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <AlertTriangle className="text-red-400" />
                            Collision Alert Center
                        </h1>
                        <p className="text-gray-300">Monitor and manage potential satellite collisions</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={exportAlerts}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <AlertStats
                    totalAlerts={alerts.length}
                    activeAlerts={activeAlerts.length}
                    criticalAlerts={criticalAlerts.length}
                    isLoading={isLoading}
                />

                {/* Search and Filters */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search by satellite ID or name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <AlertFilters
                                filters={filters}
                                onFiltersChange={setFilters}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="grid gap-4">
                            {Array(5).fill(0).map((_, i) => (
                                <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredAlerts.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredAlerts.map((alert, index) => (
                                <AlertCard
                                    key={alert.id}
                                    alert={alert}
                                    satellites={satellites}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-12 text-center">
                                <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">All Clear</h3>
                                <p className="text-gray-400">
                                    {searchTerm || Object.values(filters).some(f => f !== "all")
                                        ? "No alerts match your current filters."
                                        : "No collision alerts at this time. Systems operating normally."
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}