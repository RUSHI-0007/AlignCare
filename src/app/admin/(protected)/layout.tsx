// src/app/(admin)/layout.tsx
export const revalidate = 0;
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/core/db/supabase-server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Server-side auth guard — no session means no access
    if (!session) redirect('/admin/login');

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 md:ml-[240px] pt-20 md:pt-8 p-4 md:p-8 overflow-auto w-full">
                {children}
            </main>
        </div>
    );
}
