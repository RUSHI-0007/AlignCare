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
    teal: 'text-teal-600 bg-teal-50',
    blue: 'text-indigo-600 bg-indigo-50',
    green: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-rose-600 bg-rose-50',
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
        <div className="relative bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 rounded-full ${accentColors[accent].split(' ')[1]}`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-slate-500 font-medium mb-1">{title}</p>
                    <motion.div className="text-4xl font-bold text-slate-900 tracking-tight">
                        {displayValue}
                    </motion.div>
                </div>
                <div className={`p-3 rounded-xl ${accentColors[accent]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-4 text-sm text-slate-500 relative z-10">
                {subtext}
            </div>
        </div>
    );
}
