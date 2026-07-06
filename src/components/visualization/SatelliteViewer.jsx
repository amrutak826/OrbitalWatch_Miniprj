import React, { useEffect, useRef } from "react";
import Orbit3D from "./Orbit3D";
import TimeControls from "./TimeControls";


export default function SatelliteViewer({
                                            satellites = [],
                                            alerts = [],
                                            isPlaying, setIsPlaying,
                                            simulationSpeed, setSimulationSpeed,
                                            currentTime, setCurrentTime,
                                            onSatelliteSelect
                                        }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 relative">
                <Orbit3D
                    satellites={satellites}
                    alerts={alerts}
                    isPlaying={isPlaying}
                    simulationSpeed={simulationSpeed}
                    currentTime={currentTime}
                    onSatelliteSelect={onSatelliteSelect}
                />
            </div>


            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <TimeControls
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onReset={() => setCurrentTime(0)}
                    simulationSpeed={simulationSpeed}
                    onSpeedChange={setSimulationSpeed}
                    currentTime={currentTime}
                    onTimeChange={setCurrentTime}
                    maxTime={1440}
                />
            </div>
        </div>
    );
}