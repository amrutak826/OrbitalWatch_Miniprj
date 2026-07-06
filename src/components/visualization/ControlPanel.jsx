import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Settings,
    Filter,
    Activity,
    AlertTriangle,
    Satellite as SatelliteIcon,
    Eye,
    Zap
} from "lucide-react";

export default function ControlPanel({
                                         filters,
                                         onFiltersChange,
                                         simulationSpeed,
                                         onSpeedChange,
                                         satelliteCount,
                                         alertCount
                                     }) {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="p-4 space-y-4 border-b border-gray-700">
            {/* Status Summary */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <SatelliteIcon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{satelliteCount}</p>
                    <p className="text-xs text-gray-400">Visible Objects</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{alertCount}</p>
                    <p className="text-xs text-gray-400">Active Alerts</p>
                </div>
            </div>

            {/* Simulation Controls */}
            <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Simulation Controls
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 mb-2 block">Speed Multiplier</label>
                        <Select value={simulationSpeed.toString()} onValueChange={(value) => onSpeedChange(parseFloat(value))}>
                            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0.5">0.5x</SelectItem>
                                <SelectItem value="1">1x (Real-time)</SelectItem>
                                <SelectItem value="2">2x</SelectItem>
                                <SelectItem value="5">5x</SelectItem>
                                <SelectItem value="10">10x</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Display Filters */}
            <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Display Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Show All Satellites</label>
                            <Switch
                                checked={filters.showAll}
                                onCheckedChange={(value) => handleFilterChange('showAll', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">High Risk Only</label>
                            <Switch
                                checked={filters.showHighRisk}
                                onCheckedChange={(value) => handleFilterChange('showHighRisk', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Show Alerts</label>
                            <Switch
                                checked={filters.showAlerts}
                                onCheckedChange={(value) => handleFilterChange('showAlerts', value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-2 block">Satellite Type</label>
                        <Select
                            value={filters.satelliteType}
                            onValueChange={(value) => handleFilterChange('satelliteType', value)}
                        >
                            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="communication">Communication</SelectItem>
                                <SelectItem value="navigation">Navigation</SelectItem>
                                <SelectItem value="earth_observation">Earth Observation</SelectItem>
                                <SelectItem value="scientific">Scientific</SelectItem>
                                <SelectItem value="military">Military</SelectItem>
                                <SelectItem value="debris">Space Debris</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}