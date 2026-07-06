import React, { useRef, useEffect } from "react";


// raycaster for click
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


function onClick(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(sceneRef.current.objects.map(o=>o.mesh));
    if (intersects.length) {
        const mesh = intersects[0].object;
        const found = sceneRef.current.objects.find(o => o.mesh === mesh);
        if (found) onSatelliteSelect(found.data);
    }
}


renderer.domElement.addEventListener('click', onClick);


// animation
let last = performance.now();
function animate(now) {
    const dt = now - last;
    last = now;


// rotate earth slowly
    earth.rotation.y += 0.0003 * simulationSpeed * (isPlaying ? 1 : 0);


// update satellite positions from data; simple precomputed pos used
    sceneRef.current.objects.forEach((obj) => {
        const p = obj.data.position || { x: 0, y: 0, z: 0 };
// apply scale transform and basic time offset (if alt available, we can animate angle)
        obj.mesh.position.set(p.x * scale, p.y * scale, p.z * scale);
    });


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);


// cleanup
return () => {
    // 1. Stop animation
    cancelAnimationFrame(sceneRef.current.animationId);

    // 2. Remove resize listener
    window.removeEventListener("resize", onResize);

    // 3. Remove click listener safely
    if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener("click", onClick);
    }

    // 4. Dispose meshes & materials
    sceneRef.current.objects.forEach(obj => {
        if (obj.mesh.geometry) obj.mesh.geometry.dispose();
        if (obj.mesh.material) {
            if (Array.isArray(obj.mesh.material)) {
                obj.mesh.material.forEach(mat => mat.dispose());
            } else {
                obj.mesh.material.dispose();
            }
        }
        scene.remove(obj.mesh);
    });

    // 5. Dispose renderer
    if (renderer) {
        renderer.dispose();
    }

    // 6. Remove canvas from DOM
    if (mountRef.current && renderer && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
    }

    // 7. Clear scene reference
    sceneRef.current = null;




// update satellites when prop changes
useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;


// remove existing
    s.objects.forEach(o => s.scene.remove(o.mesh));
    s.objects = [];


// add new
    satellites.forEach((sat, idx) => {
        const color = (sat.collision_risk === 'high' || sat.collision_risk === 'critical') ? 0xff4444 : (sat.type === 'debris' ? 0x888888 : 0x44ffff);
        const mesh = createSatMesh(color);
// initial placement
        const p = sat.position || { x: (Math.random()-0.5)*20000, y: (Math.random()-0.5)*20000, z: (Math.random()-0.5)*20000 };
        mesh.position.set(p.x * 0.04, p.y * 0.04, p.z * 0.04);


        s.scene.add(mesh);
        s.objects.push({ mesh, data: sat });
    });
}, [satellites]);


return <div ref={mountRef} className="w-full h-full" style={{ minHeight: 480 }} />;
}