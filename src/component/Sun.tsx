import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Sun: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current!.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500 });
    const sunMesh = new THREE.Mesh(geometry, material);
    scene.add(sunMesh);

    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    const pointLightFront = new THREE.PointLight(0xffffff, 1);
    pointLightFront.position.set(0, 0, 2);
    scene.add(pointLightFront);

    const pointLightBack = new THREE.PointLight(0xffffff, 0.5);
    pointLightBack.position.set(0, 0, -2);
    scene.add(pointLightBack);

    const vertexShader = `
      varying vec3 vNormal;
      void main() 
      { 
        vNormal = normalize( normalMatrix * normal );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      void main() 
      { 
        float intensity = pow( 0.6 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
        gl_FragColor = vec4( 1.0, 0.7, 0.0, 1.0 ) * intensity;
      }
    `;

    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const sunGlow = new THREE.Mesh(geometry, glowMaterial);
    sunGlow.scale.set(1.3, 1.3, 1.3);
    scene.add(sunGlow);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Sun;
