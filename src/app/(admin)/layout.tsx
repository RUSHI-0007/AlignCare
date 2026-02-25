// src/app/(admin)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/core/db/supabase-server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Server-side auth guard — no session means no access
    if (!session) redirect('/admin/login');

    return (
        <div className="flex min-h-screen bg-[#0B1120]">
            <AdminSidebar />
            <main className="flex-1 ml-[240px] p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
