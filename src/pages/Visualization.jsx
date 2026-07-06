import React, { useState, useEffect, useRef } from "react";
import { Satellite, CollisionAlert } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Pause,
    RotateCcw,
    Filter,
    AlertTriangle,
    Eye,
    EyeOff,
    Settings,
    Globe
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as THREE from "three";

import Earth3D from "../components/visualization/Earth3D";
import SatelliteInfo from "../components/visualization/SatelliteInfo";
import ControlPanel from "../components/visualization/ControlPanel";

export default function Visualization() {
    const [satellites, setSatellites] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedSatellite, setSelectedSatellite] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [filters, setFilters] = useState({
        showAll: true,
        showHighRisk: true,
        showAlerts: true,
        satelliteType: 'all'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [satelliteData, alertData] = await Promise.all([
                Satellite.list('-created_date', 200),
                CollisionAlert.list('-created_date', 20)
            ]);
            setSatellites(satelliteData);
            setAlerts(alertData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setIsLoading(false);
    };

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const resetSimulation = () => {
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 100);
    };

    const filteredSatellites = satellites.filter(sat => {
        if (filters.satelliteType !== 'all' && sat.type !== filters.satelliteType) return false;
        if (!filters.showAll && sat.collision_risk === 'low') return false;
        if (!filters.showHighRisk && (sat.collision_risk === 'high' || sat.collision_risk === 'critical')) return false;
        return true;
    });

    const activeAlerts = alerts.filter(alert => alert.status === 'active');

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <h1 className="text-xl font-bold text-white">3D Space Visualization</h1>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                            {isPlaying ? 'LIVE' : 'PAUSED'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={isPlaying ? "default" : "outline"}
                            size="sm"
                            onClick={togglePlayback}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetSimulation}>
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* 3D Visualization */}
                <div className="flex-1 relative">
                    <Earth3D
                        satellites={filteredSatellites}
                        alerts={activeAlerts}
                        isPlaying={isPlaying}
                        simulationSpeed={simulationSpeed}
                        onSatelliteSelect={setSelectedSatellite}
                    />

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white">Loading orbital data...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    <ControlPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        simulationSpeed={simulationSpeed}
                        onSpeedChange={setSimulationSpeed}
                        satelliteCount={filteredSatellites.length}
                        alertCount={activeAlerts.length}
                    />

                    <div className="flex-1 overflow-auto">
                        <SatelliteInfo
                            satellite={selectedSatellite}
                            alerts={activeAlerts.filter(alert =>
                                alert.satellite_1 === selectedSatellite?.id ||
                                alert.satellite_2 === selectedSatellite?.id
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}