import React, { useEffect } from "react";


// Simple component: receives a list of close approach pairs and renders a small list
export default function CollisionVisualizer({ closePairs = [] }) {
    return (
        <div className="p-3 space-y-2 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-sm font-semibold text-white">Close Approaches</h4>
            {closePairs.length === 0 ? (
                <p className="text-xs text-gray-400">No close approaches</p>
            ) : (
                <div className="space-y-1 text-xs">
                    {closePairs.map((p, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="truncate">
                                <span className="text-gray-300">{p.satellite}</span>
                                <span className="text-gray-500"> ↔ {p.debris}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-cyan-400">{p.distance_km.toFixed(2)} km</div>
                                <div className="text-xs text-gray-400">{p.risk?.toUpperCase() || ''}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}