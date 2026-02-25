// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
        );
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#111827]/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
            <div className="p-6">
                <h2 className="text-xl font-bold text-[#F8FAFC]">Aligncare</h2>
                <p className="text-sm text-[#2DD4BF]">Admin Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 relative">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors z-10 block",
                                isActive ? "text-[#2DD4BF]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute inset-0 bg-[#2DD4BF]/10 border-l-2 border-[#2DD4BF] rounded-xl z-0 pointer-events-none"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className="w-5 h-5 relative z-10" />
                            <span className="font-medium relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 mt-auto">
                <div className="flex items-center space-x-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] font-bold">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#F8FAFC]">Admin User</p>
                        <p className="text-xs text-[#94A3B8]">admin@aligncare.in</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[#94A3B8] transition-colors hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
