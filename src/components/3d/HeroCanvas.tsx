'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ParticleWave() {
    const pointsRef = useRef<THREE.Points>(null);

    // Create a grid of points
    const count = 4000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 25;
            pos[i * 3] = x;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < count; i++) {
                const x = positions[i * 3];
                const z = positions[i * 3 + 2];

                // Wave math for flowing geometry
                const y = Math.sin(x * 0.4 + time * 0.5) * 0.5 + Math.cos(z * 0.3 + time * 0.5) * 0.5;

                // Subtle mouse reaction
                // Map cursor (-1 to 1) to (-10 to 10) range
                const cursorX = state.pointer.x * 10;
                const cursorZ = -state.pointer.y * 10; // invert y for 3D Z

                const distX = cursorX - x;
                const distZ = cursorZ - z;
                const distance = Math.sqrt(distX * distX + distZ * distZ);

                // Push particles up when mouse is near
                const mouseEffect = Math.max(0, 3 - distance) * 0.8;

                positions[i * 3 + 1] = y + mouseEffect;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;

            // Gentle rotation to make the wave feel alive
            pointsRef.current.rotation.y = time * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#2DD4BF"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function HeroCanvas() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-primary-background flex items-center justify-center">
            {/* WebGL Canvas Layer */}
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
                <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
                    <fog attach="fog" args={['#0B1120', 5, 25]} />
                    <ParticleWave />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 2 + 0.1}
                        minPolarAngle={Math.PI / 3}
                    />
                </Canvas>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pointer-events-none mt-16">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-healing-teal/30 bg-healing-teal/5 backdrop-blur-md">
                    <span className="text-healing-teal font-medium text-sm tracking-wide uppercase">Elite Recovery & Alignment</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
                    Reclaim Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-healing-teal to-trust-blue">
                        Mobility
                    </span>
                </h1>
                <p className="text-base md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-md">
                    Experience advanced physiotherapy and cancer rehab powered by technology. Healing and alignment optimized for your unique recovery journey.
                </p>

                <button className="pointer-events-auto group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-healing-teal/60 hover:border-healing-teal transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.15)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]">
                    <div className="absolute inset-0 bg-healing-teal/10 group-hover:bg-healing-teal/20 transition-all duration-300"></div>
                    <div className="absolute -inset-4 bg-healing-teal/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative font-bold text-healing-teal tracking-wide shadow-sm flex items-center gap-2">
                        Book Appointment
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                </button>
            </div>
        </section>
    );
}
