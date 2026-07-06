import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

import {
    Play,
    Pause,
    RotateCcw,
    FastForward,
    Rewind,
    Clock
} from "lucide-react";

import { format } from "date-fns";

export default function TimeControls({
                                         isPlaying,
                                         onPlayPause,
                                         onReset,
                                         simulationSpeed,
                                         onSpeedChange,
                                         currentTime,
                                         onTimeChange,
                                         maxTime = 1440 // minutes (24 hours)
                                     }) {

    const formatTimeOffset = (minutes) => {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.floor(Math.abs(minutes) % 60);
        const sign = minutes >= 0 ? "+" : "-";
        return `${sign}${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}`;
    };

    const speedOptions = [
        { label: "0.5x", value: 0.5 },
        { label: "1x", value: 1 },
        { label: "2x", value: 2 },
        { label: "5x", value: 5 },
        { label: "10x", value: 10 },
        { label: "30x", value: 30 },
        { label: "60x", value: 60 },
    ];

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Time Control</span>
                </div>

                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    {formatTimeOffset(currentTime)}
                </Badge>
            </div>

            {/* Time Slider */}
            <div className="space-y-2">
                <Slider
                    value={[currentTime]}
                    onValueChange={(value) => onTimeChange(value[0])}
                    min={-maxTime / 2}
                    max={maxTime / 2}
                    step={1}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>-12h</span>
                    <span>Now</span>
                    <span>+12h</span>
                </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTimeChange(currentTime - 60)}
                    className="flex-1"
                >
                    <Rewind className="w-4 h-4" />
                </Button>

                <Button
                    variant={isPlaying ? "default" : "outline"}
                    size="sm"
                    onClick={onPlayPause}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTimeChange(currentTime + 60)}
                    className="flex-1"
                >
                    <FastForward className="w-4 h-4" />
                </Button>

                <Button variant="outline" size="sm" onClick={onReset}>
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

            {/* Speed control */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400">Simulation Speed</label>

                <div className="grid grid-cols-7 gap-1">
                    {speedOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={simulationSpeed === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSpeedChange(option.value)}
                            className={`text-xs ${
                                simulationSpeed === option.value
                                    ? "bg-cyan-600 hover:bg-cyan-700"
                                    : "border-gray-600"
                            }`}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Current time */}
            <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700">
                Current: {format(new Date(Date.now() + currentTime * 60000), "MMM d, HH:mm")}
            </div>
        </div>
    );
}
