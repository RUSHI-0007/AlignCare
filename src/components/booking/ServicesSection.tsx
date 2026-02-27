'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, HeartPulse, Home } from 'lucide-react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 'physio',
        title: 'Physiotherapy',
        description: 'Expert, hands-on treatment for musculoskeletal pain, sports injuries, and post-surgery rehabilitation using evidence-based clinical protocols.',
        icon: Activity,
        accentColor: '#2D5BE3',
        iconBg: '#EEF2FF',
        borderColor: '#2D5BE3',
    },
    {
        id: 'cancer-rehab',
        title: 'Cancer Rehab',
        description: 'Empathetic, structured movement protocols crafted to rebuild strength and confidence during and after oncology treatment.',
        icon: HeartPulse,
        accentColor: '#0D9488',
        iconBg: '#CCFBF1',
        borderColor: '#0D9488',
    },
    {
        id: 'home-visit',
        title: 'Home Visits',
        description: 'For families who cannot bring a loved one in — clinic-quality physiotherapy and rehab delivered directly to your home.',
        icon: Home,
        accentColor: '#2D5BE3',
        iconBg: '#EEF2FF',
        borderColor: '#2D5BE3',
    },
];

export default function ServicesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(cardsRef.current,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
                scrollTrigger: { trigger: containerRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
            }
        );
        return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }, []);

    return (
        // Jasmine — colour of morning light in a well-maintained clinic
        <section id="services" className="relative py-28 px-6 overflow-hidden" style={{ backgroundColor: '#F0F4FF' }} ref={containerRef}>
            {/* Soft radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(45,91,227,0.05) 0%, transparent 70%)' }} />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <p className="text-xs tracking-widest uppercase mb-3"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#64748B' }}>
                        Our Specialisations
                    </p>
                    <h2 className="font-bold mb-4"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0F1E3C', letterSpacing: '-0.025em' }}>
                        Specialized{' '}
                        <span style={{ color: '#2D5BE3' }}>Treatments</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg leading-relaxed"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
                        Evidence-based clinical protocols combined with genuine human warmth.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                ref={el => { cardsRef.current[index] = el; }}
                                className="group rounded-2xl p-8 cursor-pointer transition-all duration-300"
                                style={{
                                    backgroundColor: '#00A9CE',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 4px 24px rgba(0, 169, 206, 0.25)',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.boxShadow = '0 12px 40px rgba(0, 169, 206, 0.4)';
                                    el.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.boxShadow = '0 4px 24px rgba(0, 169, 206, 0.25)';
                                    el.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* White semi-transparent icon pill */}
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.22)', color: '#ffffff' }}>
                                    <Icon size={28} strokeWidth={2} />
                                </div>
                                <h3 className="font-bold mb-3 text-white"
                                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2rem' }}>
                                    {service.title}
                                </h3>
                                <p className="leading-relaxed text-sm"
                                    style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.85)' }}>
                                    {service.description}
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-sm font-semibold"
                                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'rgba(255,255,255,0.9)' }}>
                                    Learn more
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                        className="transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
