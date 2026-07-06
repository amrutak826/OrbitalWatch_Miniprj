import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function Earth3D({
                                    satellites,
                                    alerts,
                                    isPlaying,
                                    simulationSpeed,
                                    onSatelliteSelect
                                }) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const [selectedSatellite, setSelectedSatellite] = useState(null);

    useEffect(() => {
        const mountElement = mountRef.current;
        if (!mountElement) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
        renderer.setClearColor(0x000011);
        mountElement.appendChild(renderer.domElement);

        // Add stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            starsVertices.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Create Earth
        const earthGeometry = new THREE.SphereGeometry(6.371, 64, 64); // Earth radius in km (scaled)
        const earthMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a90e2,
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Add Earth atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(6.8, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Camera controls
        camera.position.set(15, 5, 15);
        camera.lookAt(0, 0, 0);

        // Mouse controls
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX - mountElement.clientWidth / 2) / mountElement.clientWidth;
            mouseY = (event.clientY - mountElement.clientHeight / 2) / mountElement.clientHeight;
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;
        };

        mountElement.addEventListener('mousemove', handleMouseMove);

        sceneRef.current = {
            scene,
            camera,
            renderer,
            earth,
            atmosphere,
            satellites: [],
            targetX: 0,
            targetY: 0
        };

        // Handle resize
        const handleResize = () => {
            if (mountElement) {
                const width = mountElement.clientWidth;
                const height = mountElement.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            if (isPlaying && sceneRef.current) {
                sceneRef.current.earth.rotation.y += 0.002 * simulationSpeed;
                sceneRef.current.atmosphere.rotation.y += 0.001 * simulationSpeed;

                // Update satellite positions
                sceneRef.current.satellites.forEach(satObj => {
                    satObj.angle += satObj.speed * simulationSpeed;
                    const x = Math.cos(satObj.angle) * satObj.radius;
                    const z = Math.sin(satObj.angle) * satObj.radius;
                    const y = Math.sin(satObj.angle * 0.5) * satObj.inclination;
                    satObj.mesh.position.set(x, y, z);
                });
            }

            // Camera movement
            if (sceneRef.current) {
                sceneRef.current.targetX += (targetX - sceneRef.current.targetX) * 0.05;
                sceneRef.current.targetY += (targetY - sceneRef.current.targetY) * 0.05;

                camera.position.x += (sceneRef.current.targetX - camera.position.x) * 0.02;
                camera.position.y += (-sceneRef.current.targetY - camera.position.y) * 0.02;
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            mountElement.removeEventListener('mousemove', handleMouseMove);
            if (mountElement && renderer.domElement) {
                mountElement.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []); // Only run once on mount

    // Update satellites when data changes
    useEffect(() => {
        if (!sceneRef.current || !satellites.length) return;

        // Clear existing satellites
        sceneRef.current.satellites.forEach(satObj => {
            sceneRef.current.scene.remove(satObj.mesh);
        });
        sceneRef.current.satellites = [];

        // Add new satellites
        satellites.forEach((satellite, index) => {
            const isHighRisk = satellite.collision_risk === 'high' || satellite.collision_risk === 'critical';
            const color = isHighRisk ? 0xff4444 : satellite.type === 'debris' ? 0x888888 : 0x44ffff;

            const satelliteGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const satelliteMaterial = new THREE.MeshBasicMaterial({ color });
            const satelliteMesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

            // Set orbital parameters
            const radius = 8 + (satellite.altitude || 400) / 100; // Scale altitude
            const inclination = (satellite.orbital_elements?.inclination || Math.random()) * 3;
            const angle = index * 0.3; // Distribute satellites
            const speed = 0.01 + Math.random() * 0.02;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.sin(angle * 0.5) * inclination;
            satelliteMesh.position.set(x, y, z);

            sceneRef.current.scene.add(satelliteMesh);
            sceneRef.current.satellites.push({
                mesh: satelliteMesh,
                data: satellite,
                radius,
                inclination,
                angle,
                speed
            });
        });
    }, [satellites]);

    return (
        <div
            ref={mountRef}
            className="w-full h-full cursor-move"
            style={{ background: 'radial-gradient(circle, #001122 0%, #000011 100%)' }}
        />
    );
}