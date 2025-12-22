'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ParticleBackground.module.css';

interface ParticleBackgroundProps {
    className?: string;
}

export default function ParticleBackground({ className }: ParticleBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameIdRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;
        cameraRef.current = camera;

        // Renderer initialization with more robust error handling
        let renderer: THREE.WebGLRenderer;
        try {
            const canvas = document.createElement('canvas');
            // Try to create a context first to see if it's truly available
            const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
                canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });

            if (!gl) {
                // Try again without performance caveat before giving up
                const glBasic = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!glBasic) {
                    container.classList.add(styles.fallback);
                    return;
                }
            }

            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'low-power',
                failIfMajorPerformanceCaveat: false,
                precision: 'lowp'
            });

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        } catch (error) {
            // Silently fail and use fallback background
            container.classList.add(styles.fallback);
            return;
        }

        // Particles
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color('#ff0080'), // Pink
            new THREE.Color('#7928ca'), // Purple
            new THREE.Color('#00d4ff'), // Cyan
            new THREE.Color('#ff00ff'), // Magenta
            new THREE.Color('#ffffff'), // White
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Spread particles across the scene
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for better looking particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: renderer.getPixelRatio() }
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(time * 0.3 + position.y * 0.1) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Mouse movement
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / width) * 2 - 1;
            mouseRef.current.y = -(event.clientY / height) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation
        let time = 0;
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);
            time += 0.01;

            if (material.uniforms) {
                material.uniforms.time.value = time;
            }

            // Subtle camera movement based on mouse
            if (cameraRef.current) {
                cameraRef.current.position.x += (mouseRef.current.x * 5 - cameraRef.current.position.x) * 0.02;
                cameraRef.current.position.y += (mouseRef.current.y * 5 - cameraRef.current.position.y) * 0.02;
                cameraRef.current.lookAt(0, 0, 0);
            }

            // Rotate particles slowly
            if (particlesRef.current) {
                particlesRef.current.rotation.y += 0.001;
                particlesRef.current.rotation.x += 0.0005;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;

            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameIdRef.current);

            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
