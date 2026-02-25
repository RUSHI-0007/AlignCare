'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Activity, HeartPulse, Home } from 'lucide-react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const services = [
    {
        id: 'physio',
        title: 'Physiotherapy',
        description: 'Expert, hands-on treatment for musculoskeletal pain, injuries, and post-surgery rehabilitation.',
        icon: Activity,
        color: 'from-blue-500/20 to-blue-600/5',
        accent: 'text-blue-400',
    },
    {
        id: 'cancer-rehab',
        title: 'Cancer Rehab',
        description: 'Empathetic care and structured movement protocols designed to rebuild strength during and after treatment.',
        icon: HeartPulse,
        color: 'from-healing-teal/20 to-healing-teal/5',
        accent: 'text-healing-teal',
    },
    {
        id: 'home-visit',
        title: 'Home Visits',
        description: 'Premium clinic-level care delivered directly to your doorstep for maximum convenience and privacy.',
        icon: Home,
        color: 'from-purple-500/20 to-purple-600/5',
        accent: 'text-purple-400',
    }
];

export default function ServicesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // GSAP ScrollTrigger stagger animation
        gsap.fromTo(
            cardsRef.current,
            {
                y: 100,
                opacity: 0,
                rotateX: -15
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%', // trigger when top of container hits 75% down viewport
                    end: 'bottom bottom',
                    toggleActions: 'play none none reverse',
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="services" className="relative py-32 px-6 bg-primary-background overflow-hidden" ref={containerRef}>
            {/* Background radial gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-trust-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Specialized <span className="text-transparent bg-clip-text bg-gradient-to-r from-healing-teal to-trust-blue">Treatments</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Evidence-based clinical protocols combined with modern technology to deliver exceptional recovery outcomes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 perspective-[2000px]">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={service.id}
                                ref={(el) => { cardsRef.current[index] = el }}
                                className="relative group h-full cursor-pointer rounded-3xl"
                                whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* 3D Glass Card Container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.01] rounded-3xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden">
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${service.color}`} />
                                </div>

                                {/* Content translated out for 3D effect */}
                                <div
                                    className="relative p-10 flex flex-col h-full transform-gpu"
                                    style={{ transform: 'translateZ(50px)' }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-secondary-card border border-white/5 flex items-center justify-center mb-8 shadow-inner shadow-white/5 ${service.accent}`}>
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        {service.title}
                                    </h3>

                                    <p className="text-slate-400 font-light flex-grow leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                        <span>Learn more</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-arrow-right transition-transform group-hover:translate-x-1 ${service.accent}`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
