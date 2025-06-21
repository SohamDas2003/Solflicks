"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeJsBackground() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: new THREE.Color("#f5f5ea"),
      transparent: true,
      opacity: 0.6,
    });

    // Create points mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 2;

    // Handle window resize
    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    function onDocumentMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }

    document.addEventListener("mousemove", onDocumentMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles based on mouse position
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;
      
      particlesMesh.rotation.x += mouseY * 0.0003;
      particlesMesh.rotation.y += mouseX * 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      renderer.dispose();
      if (canvasRef.current && canvasRef.current.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none" 
    />
  );
}