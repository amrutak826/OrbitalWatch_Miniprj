import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
};

export default function AlertsPanel({ alerts, isLoading }) {
    return (
        <Card className="bg-gray-800 border-gray-700 h-fit">
            <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Active Collision Alerts
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : alerts.length > 0 ? (
                    <div className="space-y-4">
                        {alerts.slice(0, 5).map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Badge className={riskColors[alert.risk_level]}>
                                        {alert.risk_level.toUpperCase()}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(alert.predicted_time), "MMM d, HH:mm")}
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm text-gray-300">
                                    <p className="font-medium">
                                        Satellites: {alert.satellite_1} ↔ {alert.satellite_2}
                                    </p>
                                    <p className="text-gray-400">
                                        Min Distance: {alert.minimum_distance.toFixed(2)} km
                                    </p>
                                    <p className="text-gray-400">
                                        Probability: {(alert.probability * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-green-400 font-medium">All Clear</p>
                        <p className="text-gray-500 text-sm">No collision alerts at this time</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}