import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceBackground: React.FC = () => {
  const mount = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Basic setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    mount.current?.appendChild(renderer.domElement);

    // Resize listener
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const vertices = [];
    const colors = [];
    const starColors = [
      new THREE.Color(0xFFFFFF),
      new THREE.Color(0xFFDDAA),
      new THREE.Color(0x99AADD),
      new THREE.Color(0x5555FF),
    ];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);

      const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
      colors.push(chosenColor.r, chosenColor.g, chosenColor.b);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Camera position
    camera.position.z = 5;

    const animate = () => {
      starField.rotation.x += 0.0005;
      starField.rotation.y += 0.0005;

      starField.material.size = 0.08 + 0.02 * Math.sin(0.1 * performance.now());
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', () => { });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mount.current?.removeChild(renderer.domElement);
    };

  }, []);

  return <div ref={mount} style={{ position: 'absolute', top: 0, left: 0 }} />;
};

export default SpaceBackground;
