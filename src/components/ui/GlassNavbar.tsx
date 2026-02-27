'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';

export default function GlassNavbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 50));

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-4xl rounded-full transition-all duration-500 ease-in-out px-6 py-3 flex items-center justify-between"
            style={scrolled ? {
                background: 'rgba(250, 247, 242, 0.80)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid rgba(45, 91, 227, 0.1)',
                boxShadow: '0 8px 32px rgba(15, 30, 60, 0.08)',
            } : {
                background: 'transparent',
                border: '1px solid transparent',
            }}
        >
            {/* Three-colour wordmark: Align(navy) care(indigo).(teal) */}
            <Link href="/" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#0F1E3C' }}>Align</span>
                <span style={{ color: '#2D5BE3' }}>care</span>
                <span style={{ color: '#0D9488' }}>.</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {['Services', 'Clinic', 'Home Visit'].map(label => (
                    <Link key={label}
                        href={`#${label.toLowerCase().replace(' ', '-')}`}
                        className="font-medium text-sm transition-colors duration-200"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0F1E3C' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2D5BE3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#0F1E3C'}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* Indigo CTA pill */}
            <Link href="/booking"
                className="px-5 py-2 rounded-full font-semibold text-sm text-white transition-all duration-200"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', backgroundColor: '#2D5BE3', boxShadow: '0 2px 12px rgba(45,91,227,0.3)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#1E40AF'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#2D5BE3'}
            >
                Book Now
            </Link>
        </motion.nav>
    );
}
