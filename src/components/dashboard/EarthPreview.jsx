import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Eye } from "lucide-react";
import * as THREE from "three";

export default function EarthPreview({ satellites }) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        const mountElement = mountRef.current;
        if (!mountElement) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(400, 300);
        renderer.setClearColor(0x000000, 0);
        mountElement.appendChild(renderer.domElement);

        // Create Earth
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        const earthMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a90e2,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Add satellites
        const satelliteGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

        const satelliteMeshes = [];
        for (let i = 0; i < Math.min(satellites.length, 20); i++) {
            const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial.clone());

            // Random orbital position
            const radius = 1.2 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            satellite.position.setFromSphericalCoords(radius, phi, theta);
            scene.add(satellite);
            satelliteMeshes.push({ mesh: satellite, theta, phi, radius, speed: 0.01 + Math.random() * 0.02 });
        }

        camera.position.z = 3;
        sceneRef.current = { scene, camera, renderer, earth, satellites: satelliteMeshes };

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            earth.rotation.y += 0.005;

            satelliteMeshes.forEach(sat => {
                sat.theta += sat.speed;
                sat.mesh.position.setFromSphericalCoords(sat.radius, sat.phi, sat.theta);
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (mountElement && renderer.domElement) {
                mountElement.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [satellites.length]);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Earth Orbital View
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="relative">
                    <div
                        ref={mountRef}
                        className="w-full h-[300px] bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden"
                        style={{ minHeight: '300px' }}
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Live Preview</span>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">
                            {Math.min(satellites.length, 20)} satellites visible
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}