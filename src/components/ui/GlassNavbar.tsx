'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';

export default function GlassNavbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-4 left-0 right-0 z-50 mx-auto max-w-4xl rounded-full transition-all duration-500 ease-in-out px-6 py-3 flex items-center justify-between ${scrolled
                    ? "bg-[#0B1120]/60 backdrop-blur-xl border border-white/10"
                    : "bg-transparent border-transparent"
                }`}
        >
            <Link
                href="/"
                className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${scrolled ? "text-[#2DD4BF]" : "text-slate-50"
                    }`}
            >
                Aligncare
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <Link
                    href="#services"
                    className="font-medium text-slate-100 transition-colors hover:text-[#3B82F6]"
                >
                    Services
                </Link>
                <Link
                    href="#clinic"
                    className="font-medium text-slate-100 transition-colors hover:text-[#3B82F6]"
                >
                    Clinic
                </Link>
                <Link
                    href="#home-visit"
                    className="font-medium text-slate-100 transition-colors hover:text-[#3B82F6]"
                >
                    Home Visit
                </Link>
            </div>

            <button className="bg-[#2DD4BF] hover:bg-[#20b8a5] text-[#0B1120] px-6 py-2 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.6)]">
                Book Now
            </button>
        </motion.nav>
    );
}
