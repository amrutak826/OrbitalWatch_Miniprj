
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Target, Zap, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const riskColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200"
};

const statusColors = {
    active: "bg-red-100 text-red-800",
    resolved: "bg-green-100 text-green-800",
    false_positive: "bg-gray-100 text-gray-800"
};

export default function AlertCard({ alert, satellites, index }) {
    const satellite1 = satellites.find(s => s.id === alert.satellite_1);
    const satellite2 = satellites.find(s => s.id === alert.satellite_2);

    // Add default fallbacks to prevent crash if properties are missing
    const riskLevel = alert.risk_level || 'low';
    const status = alert.status || 'active';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                riskLevel === 'critical' ? 'ring-2 ring-red-500/30' : ''
            }`}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={riskColors[riskLevel]}>
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {riskLevel.toUpperCase()} RISK
                                </Badge>
                                <Badge className={statusColors[status]} variant="outline">
                                    {status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    {alert.predicted_time && !isNaN(new Date(alert.predicted_time))
                                        ? format(new Date(alert.predicted_time), "MMM d, yyyy HH:mm 'UTC'")
                                        : "No time specified"
                                    }
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-400" />
                                        Involved Objects
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <p>Primary: <span className="font-mono text-cyan-400">{alert.satellite_1}</span></p>
                                        <p>Secondary: <span className="font-mono text-cyan-400">{alert.satellite_2}</span></p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        Impact Analysis
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <p>Min Distance: <span className="font-mono text-yellow-400">{alert.minimum_distance?.toFixed(3) || 'N/A'} km</span></p>
                                        <p>Collision Probability: <span className="font-mono text-red-400">{(alert.probability * 100)?.toFixed(2) || 'N/A'}%</span></p>
                                        <p>Relative Velocity: <span className="font-mono text-orange-400">{alert.relative_velocity?.toFixed(2) || 'N/A'} km/s</span></p>
                                        {alert.impact_severity && (
                                            <p>Severity: <span className={`font-mono ${
                                                alert.impact_severity === 'catastrophic' ? 'text-red-400' :
                                                    alert.impact_severity === 'major' ? 'text-orange-400' :
                                                        alert.impact_severity === 'moderate' ? 'text-yellow-400' : 'text-green-400'
                                            }`}>{alert.impact_severity}</span></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                            </Button>
                            {status === 'active' && (
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Track Objects
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
