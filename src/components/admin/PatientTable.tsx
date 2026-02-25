// src/components/admin/PatientTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Phone, Calendar as CalendarIcon, ChevronRight as ChevronRightIcon, Beaker } from 'lucide-react';
import { PatientWithStats } from '@/types/appointment.types';

interface PatientTableProps {
    patients: PatientWithStats[];
}

export default function PatientTable({ patients }: PatientTableProps) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Local filtering (O(n) on client) without relying on useEffect
    const filteredPatients = useMemo(() => {
        if (!search.trim()) return patients;
        const lowerSearch = search.toLowerCase();
        return patients.filter(p =>
            p.full_name.toLowerCase().includes(lowerSearch) ||
            p.phone.includes(search)
        );
    }, [patients, search]);

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const currentPatients = filteredPatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-[#111827]/80 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
                <div>
                    <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center">
                        Patient Database
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-white/5 text-[#94A3B8] text-xs font-semibold border border-white/10">
                            {filteredPatients.length} total
                        </span>
                    </h2>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-[#2DD4BF]/50 focus:border-[#2DD4BF]/50 transition-all sm:text-sm"
                        placeholder="Search name or phone..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on new search
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-white/[0.02]">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Phone
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Last Treatment
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Last Visit
                            </th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {currentPatients.length > 0 ? (
                            currentPatients.map((patient) => (
                                <tr key={patient.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] font-bold text-xs ring-1 ring-[#2DD4BF]/20">
                                                {getInitials(patient.full_name)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[#F8FAFC]">
                                                    {patient.full_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={`tel:${patient.phone}`} className="text-sm text-[#94A3B8] flex items-center hover:text-[#2DD4BF] transition-colors">
                                            <Phone className="w-3.5 h-3.5 mr-2" />
                                            {patient.phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {patient.treatmentCategory ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 uppercase tracking-widest">
                                                <Beaker className="w-3 h-3 mr-1.5 opacity-70" />
                                                {patient.treatmentCategory.replace('_', ' ')}
                                            </span>
                                        ) : (
                                            <span className="text-[#94A3B8] text-sm font-medium">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {patient.lastVisit ? (
                                            <div className="flex items-center text-sm font-medium text-[#94A3B8]">
                                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 opacity-70" />
                                                {new Date(patient.lastVisit).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 uppercase tracking-widest">
                                                New Patient
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-[#94A3B8] hover:text-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-end w-full cursor-pointer">
                                            View <ChevronRightIcon className="ml-1 w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-[#94A3B8]">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="w-8 h-8 opacity-20 mb-3" />
                                        <p>No patients found matching "<span className="text-[#F8FAFC]">{search}</span>"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-[#94A3B8]">
                                Showing <span className="font-medium text-[#F8FAFC]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[#F8FAFC]">{Math.min(currentPage * itemsPerPage, filteredPatients.length)}</span> of{' '}
                                <span className="font-medium text-[#F8FAFC]">{filteredPatients.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/10 bg-white/5 text-sm font-medium text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/10 border-l-0 bg-white/5 text-sm font-medium text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
