// src/app/(admin)/patients/page.tsx
export const dynamic = 'force-dynamic';

import { getPatientsAction } from '@/core/actions/admin.actions';
import PatientTable from '@/components/admin/PatientTable';

export default async function PatientsPage() {
    const { data: patients, success } = await getPatientsAction();

    if (!success) {
        return (
            <div className="p-8">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
                    Failed to load patients. Please refresh the page.
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 h-[calc(100vh-4rem)] flex flex-col pb-8">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[#F8FAFC]">Patients</h1>
                    <p className="text-[#94A3B8] text-sm mt-1">
                        Manage your clinic's patient records and history
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <PatientTable patients={patients} />
            </div>
        </div>
    );
}
