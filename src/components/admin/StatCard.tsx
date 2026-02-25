// src/components/admin/StatCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Calendar, Home, Clock } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    subtext: string;
    accent: 'teal' | 'blue' | 'green' | 'amber' | 'red';
    icon: 'calendar' | 'home' | 'clock';
}

const accentColors = {
    teal: 'text-[#2DD4BF] bg-[#2DD4BF]/10',
    blue: 'text-[#3B82F6] bg-[#3B82F6]/10',
    green: 'text-[#10B981] bg-[#10B981]/10',
    amber: 'text-[#F59E0B] bg-[#F59E0B]/10',
    red: 'text-[#EF4444] bg-[#EF4444]/10',
};

const iconMap = {
    calendar: Calendar,
    home: Home,
    clock: Clock,
};

export default function StatCard({ title, value, subtext, accent, icon }: StatCardProps) {
    const Icon = iconMap[icon];
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const animation = animate(count, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return animation.stop;
    }, [value, count]);

    return (
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group">
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full ${accentColors[accent].split(' ')[0]}`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-[#94A3B8] font-medium mb-1">{title}</p>
                    <motion.div className="text-4xl font-bold text-[#F8FAFC] tracking-tight">
                        {displayValue}
                    </motion.div>
                </div>
                <div className={`p-3 rounded-xl ${accentColors[accent]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-4 text-sm text-[#94A3B8] relative z-10">
                {subtext}
            </div>
        </div>
    );
}
