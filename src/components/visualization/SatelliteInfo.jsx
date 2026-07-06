import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Satellite as SatelliteIcon,
    AlertTriangle,
    Activity,
    MapPin,
    Clock,
    Zap
} from "lucide-react";
import { format } from "date-fns";

const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
};

const typeIcons = {
    communication: "📡",
    navigation: "🧭",
    earth_observation: "🌍",
    scientific: "🔬",
    military: "🛡️",
    debris: "💥"
};

export default function SatelliteInfo({ satellite, alerts }) {
    if (!satellite) {
        return (
            <div className="p-6 text-center">
                <SatelliteIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Click on a satellite to view details</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Satellite Header */}
            <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <span className="text-lg">{typeIcons[satellite.type] || "🛰️"}</span>
                            {satellite.name}
                        </CardTitle>
                        <Badge className={riskColors[satellite.collision_risk]}>
                            {satellite.collision_risk?.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <p className="text-gray-400">NORAD ID</p>
                            <p className="text-white font-mono">{satellite.norad_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Type</p>
                            <p className="text-white capitalize">{satellite.type?.replace('_', ' ')}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Altitude</p>
                            <p className="text-white">{satellite.altitude || 'N/A'} km</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Status</p>
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${satellite.active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <p className="text-white text-xs">{satellite.active ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Position Data */}
            {satellite.position && (
                <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Current Position
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                                <p className="text-gray-400">X</p>
                                <p className="text-white font-mono">{satellite.position.x?.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Y</p>
                                <p className="text-white font-mono">{satellite.position.y?.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Z</p>
                                <p className="text-white font-mono">{satellite.position.z?.toFixed(2)} km</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Orbital Elements */}
            {satellite.orbital_elements && (
                <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Orbital Elements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-gray-400">Semi-major Axis</p>
                                <p className="text-white">{satellite.orbital_elements.semi_major_axis?.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Eccentricity</p>
                                <p className="text-white">{satellite.orbital_elements.eccentricity?.toFixed(4)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Inclination</p>
                                <p className="text-white">{satellite.orbital_elements.inclination?.toFixed(2)}°</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Right Ascension</p>
                                <p className="text-white">{satellite.orbital_elements.right_ascension?.toFixed(2)}°</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Related Alerts */}
            {alerts.length > 0 && (
                <Card className="bg-red-900 border-red-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            Active Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="bg-red-800 rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-red-600 text-white text-xs">
                                        {alert.risk_level.toUpperCase()}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-red-300">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(alert.predicted_time), "MMM d, HH:mm")}
                                    </div>
                                </div>
                                <p className="text-sm text-red-200 mb-1">
                                    Min Distance: {alert.minimum_distance.toFixed(2)} km
                                </p>
                                <p className="text-sm text-red-200">
                                    Probability: {(alert.probability * 100).toFixed(1)}%
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Closest Approach */}
            {satellite.closest_approach && (
                <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Next Close Approach
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                        <div>
                            <p className="text-gray-400">Target</p>
                            <p className="text-white">{satellite.closest_approach.target_satellite}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Distance</p>
                            <p className="text-white">{satellite.closest_approach.distance?.toFixed(2)} km</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Time</p>
                            <p className="text-white">
                                {format(new Date(satellite.closest_approach.time), "MMM d, yyyy HH:mm")}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}