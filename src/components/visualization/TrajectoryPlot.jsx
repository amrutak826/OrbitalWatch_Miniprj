import React, { useRef, useEffect } from "react";


// A tiny canvas-based line plot to show distance trend
export default function TrajectoryPlot({ data = [], width = 400, height = 120 }) {
    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);


        if (!data.length) {
            ctx.fillStyle = "#1f2937";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "#9ca3af";
            ctx.fillText("No trajectory", 10, 20);
            return;
        }


// compute scaling
        const values = data.map(d => d.y);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = Math.max(1, max - min);


        ctx.lineWidth = 2;
        ctx.strokeStyle = "#06b6d4";
        ctx.beginPath();


        data.forEach((pt, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((pt.y - min) / range) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });


        ctx.stroke();


// axes simple
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height - 0.5);
        ctx.lineTo(width, height - 0.5);
        ctx.stroke();
    }, [data, width, height]);


    return <canvas ref={canvasRef} width={width} height={height} className="rounded bg-gray-800" />;
}