'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface ServiceCard3DProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
    accentClass: string;
    animationType: 'physio' | 'cancer-rehab' | 'home-visit';
}

const ServiceCardBackground = ({ type }: { type: 'physio' | 'cancer-rehab' | 'home-visit' }) => {
    switch (type) {
        case 'physio':
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <svg
                        className="absolute bottom-0 w-[200%] h-32 animate-[wave_8s_linear_infinite]"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                            opacity=".25"
                            className="fill-clinic-blue-400"
                        />
                        <path
                            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05c92.87,70,208.7,46.6,303.88-5.32c91.1-49.63,184.28-44.5,278.43-16.14,94,28.3,190.26,38.25,286.76,14.61C1014.28,41.4,1102.34,16.5,1200,45.8V0Z"
                            opacity=".5"
                            className="fill-clinic-blue-600"
                        />
                        <path
                            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4c58.8,25.66,119.53,40,183.9,28.37,42.5-7.7,82.5-23.3,123.6-32.93,42.4-9.9,86-13.8,123.5-3.37V0Z"
                            className="fill-clinic-blue-200"
                        />
                    </svg>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes wave {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                    `}} />
                </div>
            );
        case 'cancer-rehab':
            return (
                <div className="absolute top-4 right-4 w-24 h-24 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500 flex items-center justify-center">
                    <div className="relative w-16 h-16 animate-[spin_10s_linear_infinite]">
                        <div className="absolute inset-0 rounded-full border-2 border-teal-500 opacity-50 shadow-[0_0_15px_rgba(20,184,166,0.3)]" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-50 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-[spin_5s_reverse_linear_infinite]" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
                    </div>
                </div>
            );
        case 'home-visit':
            return (
                <div className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        {/* Core pin */}
                        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full" />
                        {/* Ripples */}
                        <div className="absolute w-8 h-8 border border-indigo-400 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        <div className="absolute w-12 h-12 border border-indigo-300 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.4s' }} />
                        <div className="absolute w-16 h-16 border border-indigo-200 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.8s' }} />
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export default function ServiceCard3D({
    title,
    description,
    icon,
    colorClass,
    accentClass,
    animationType
}: ServiceCard3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for the radial gradient shine
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const [{ rotateX, rotateY, translateZ }, api] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        config: { stiffness: 150, damping: 20 },
    }));

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();

        // Calculate offset from center (-0.5 to 0.5)
        const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate absolute percentages for the CSS radial gradient
        const percX = ((e.clientX - rect.left) / rect.width) * 100;
        const percY = ((e.clientY - rect.top) / rect.height) * 100;

        // Apply max rotation of 12 degrees
        api.start({
            rotateY: offsetX * 24, // 24 * 0.5 = 12 deg
            rotateX: -offsetY * 24,
            translateZ: 8,
        });

        setMousePos({ x: percX, y: percY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        api.start({
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
        });
    };

    return (
        <animated.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer w-full h-full rounded-3xl"
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                zIndex: isHovered ? 10 : 1,
            }}
        >
            <animated.div
                className={`relative flex flex-col h-full rounded-3xl border border-[#E2E8F0] overflow-hidden transition-all duration-300 shadow-sm ${colorClass}`}
                style={{
                    translateZ,
                    boxShadow: isHovered
                        ? '0 20px 40px -10px rgba(0,0,0,0.1)'
                        : '0 4px 6px -1px rgba(0,0,0,0.05)',
                    borderColor: isHovered ? 'var(--tw-colors-clinic-blue-200)' : '#E2E8F0'
                }}
            >
                {/* CSS Inner Radial Shine tracking mouse */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
                    style={{
                        background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.7), transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                        mixBlendMode: 'overlay'
                    }}
                />

                {/* Specific CSS Animated Background */}
                <ServiceCardBackground type={animationType} />

                {/* Card Content layer */}
                <div className="relative z-10 p-10 flex flex-col h-full pointer-events-none">
                    <div className={`w-16 h-16 rounded-2xl bg-clinic-blue-50/50 border border-clinic-blue-100 flex items-center justify-center mb-8 bg-white shadow-sm ${accentClass}`}>
                        {icon}
                    </div>

                    <h3 className="text-2xl font-bold text-clinic-navy mb-4">
                        {title}
                    </h3>

                    <p className="text-clinic-muted font-light flex-grow leading-relaxed">
                        {description}
                    </p>

                    <div className={`mt-8 pt-6 border-t border-[#E2E8F0] flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isHovered ? accentClass : 'text-clinic-navy'}`}>
                        <span>Learn more</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-arrow-right transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                </div>
            </animated.div>
        </animated.div>
    );
}
