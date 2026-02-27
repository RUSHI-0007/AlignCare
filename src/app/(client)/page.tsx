"use client";
import dynamic from "next/dynamic";
import { FeatureSteps } from "@/components/ui/feature-section";
import TestimonialMarquee from "@/components/ui/TestimonialMarquee";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Link from "next/link";

// Dynamic import with ssr:false fixes the Turbopack ChunkLoadError
// that occurs when postprocessing tries to load WebGL chunks server-side
const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), { ssr: false });

const aligncareServices = [
    {
        step: 'Cancer Rehab',
        title: 'Cancer Rehabilitation',
        content: 'Specialized post-cancer recovery for patients during and after oncology treatment. Dr. Khushali builds bespoke movement protocols to restore strength, manage fatigue, and rebuild confidence—coordinated directly with your oncologist.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    },
    {
        step: 'Lymphedema',
        title: 'Lymphedema Treatment',
        content: 'Certified Lymphedema Therapist treatment for fluid retention and swelling in both lower limbs and upper limbs—including post-MRM/mastectomy upper-limb lymphedema. Manual lymphatic drainage, compression therapy, and self-management education.',
        image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=800&q=80',
    },
    {
        step: "Bell's Palsy",
        title: "Bell's Palsy Rehabilitation",
        content: 'Neuromuscular re-education and targeted physiotherapy for sudden facial nerve weakness or paralysis. Early intervention improves outcomes significantly—our protocols are drawn from Dr. Khushali’s MPT in Rehabilitation and MIAFT credentials.',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    },
    {
        step: 'Desk Job Pain',
        title: 'Corporate & Ergonomic Pain Relief',
        content: 'Neck pain, back pain, and postural dysfunction from long sitting hours and desk work. Dr. Khushali integrates physiotherapy with Yoga, Pilates, and ergonomic guidance for lasting lifestyle change—not just short-term pain relief.',
        image: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&w=800&q=80',
    },
    {
        step: 'Prenatal & Postnatal',
        title: 'Prenatal & Postnatal Care',
        content: 'Certified Prenatal & Postnatal Instructor and Pilates Instructor—safe, specialized movement therapy for pregnant and postpartum women. Pelvic floor rehab, diastasis recti recovery, and general antenatal wellness.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
];



export default function Page() {
    return (
        <>
            <HeroCanvas />

            {/* ─── TRUST BAR ─────────────────────────────────────────────── */}
            {/* Same Kapur White as hero — zero gap between sections */}
            <section className="py-14 px-6 border-b border-[#E2E8F0]" style={{ backgroundColor: '#FAF7F2' }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { num: '500+', label: 'Patients Treated' },
                        { num: '5★', label: 'Google Rating' },
                        { num: '8+', label: 'Years Experience' },
                        { num: '100%', label: 'Certified Specialists' },
                    ].map(stat => (
                        <div key={stat.label} className="flex flex-col items-center gap-1">
                            <span className="font-bold text-[#2D5BE3]"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                                {stat.num}
                            </span>
                            <span className="text-sm text-[#64748B]"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <FeatureSteps
                features={aligncareServices}
                title="Specialized Treatments"
                autoPlayInterval={4500}
                imageHeight="h-[300px] md:h-[420px]"
            />

            {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
            <section className="py-28 px-6" style={{ backgroundColor: '#FAF7F2' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-widest uppercase mb-3 text-[#64748B]"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            The Process
                        </p>
                        <h2 className="font-bold text-[#0F1E3C]"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}>
                            Your Recovery,{' '}
                            <span className="text-[#2D5BE3]">Step by Step</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { num: '01', title: 'Book Your Appointment', desc: 'Choose your service, pick a date and time. In-clinic or home visit — your choice.' },
                            { num: '02', title: 'Assessment & Plan', desc: 'Our specialist performs a thorough movement assessment and builds a personalised recovery protocol.' },
                            { num: '03', title: 'Heal & Strengthen', desc: 'Follow your guided programme. Track your progress. Return to full strength, at your own pace.' },
                        ].map(step => (
                            <div key={step.num}>
                                {/* Step number above the heading */}
                                <div className="leading-none select-none mb-4 text-[#2D5BE3]"
                                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: '5rem', opacity: 0.18, lineHeight: 1 }}>
                                    {step.num}
                                </div>
                                <h3 className="font-bold mb-3 text-[#0F1E3C]"
                                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem' }}>
                                    {step.title}
                                </h3>
                                <p className="leading-relaxed text-sm text-[#64748B]"
                                    style={{ fontFamily: 'DM Sans, sans-serif', lineHeight: 1.75 }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialMarquee />

            {/* ─── HOME VISIT HERO ───────────────────────────────────────── */}
            <section id="home-visit" className="py-24 px-6" style={{ backgroundColor: '#F0F4FF' }}>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-14">
                    <div className="flex-1">
                        <p className="text-xs tracking-widest uppercase mb-3 text-[#0D9488]"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Signature Service
                        </p>
                        <h2 className="font-bold mb-5 text-[#0F1E3C]"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.025em' }}>
                            Can&apos;t Come to Us?<br />
                            <span className="text-[#2D5BE3]"
                                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}>
                                We Come to You.
                            </span>
                        </h2>
                        <p className="leading-relaxed mb-8 max-w-md text-[#64748B]"
                            style={{ fontFamily: 'DM Sans, sans-serif', lineHeight: 1.75 }}>
                            Many families cannot transport elderly parents or post-surgery loved ones.
                            Our home visit physiotherapy brings the same expertise and genuine care — directly to your home.
                        </p>
                        <Link href="/booking?type=home"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', backgroundColor: '#0D9488' }}>
                            Request a Home Visit
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                        {[
                            'Same certified physiotherapist, every visit',
                            'Cancer rehab available at your home',
                            'Post-surgery rehabilitation without the commute',
                            'Elderly & mobility-limited patients welcomed',
                            'Hygienic, professional, fully private setting',
                        ].map(point => (
                            <div key={point} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4"
                                style={{ border: '1px solid #E2E8F0', boxShadow: '0 2px 16px rgba(45,91,227,0.06)' }}>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#CCFBF1' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                        fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <p className="text-sm text-[#0F1E3C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BOOKING CTA ───────────────────────────────────────────── */}
            <section className="py-24 px-6" style={{ backgroundColor: '#0D9488' }}>
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-bold text-white mb-4"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-0.025em' }}>
                        Begin Your Recovery
                    </h2>
                    <p className="mb-10 text-lg text-white/80"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Book your first appointment today. No referral needed.
                    </p>
                    <Link href="/booking"
                        className="inline-flex items-center gap-3 bg-white font-bold px-10 py-4 rounded-full text-lg shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] text-[#0D9488]"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Book Your First Appointment
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ────────────────────────────────────────────────── */}
            <footer className="py-16 px-6" style={{ backgroundColor: '#0F1E3C' }}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                    {/* Three-color wordmark: Align(white) care(indigo).(teal) */}
                    <div>
                        <p className="font-bold mb-2"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.75rem' }}>
                            <span className="text-white">Align</span>
                            <span className="text-[#2D5BE3]">care</span>
                            <span className="text-[#0D9488]">.</span>
                        </p>
                        <p className="text-sm mb-1 text-[#64748B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Physiotherapy &amp; Cancer Rehab Centre
                        </p>
                        <p className="text-sm text-[#64748B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Pune, India
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                        <div>
                            <p className="font-semibold text-white text-sm mb-4"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                Services
                            </p>
                            {['Physiotherapy', 'Cancer Rehab', 'Home Visits'].map(s => (
                                <p key={s} className="text-sm mb-2 text-[#64748B] hover:text-[#2D5BE3] cursor-pointer transition-colors"
                                    style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                    {s}
                                </p>
                            ))}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm mb-4"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                Contact
                            </p>
                            <p className="text-sm mb-2 text-[#64748B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                hello@aligncare.in
                            </p>
                            <p className="text-sm text-[#64748B]"
                                style={{ fontFamily: 'DM Mono, monospace' }}>
                                +91 98765 43210
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs text-[#64748B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        © 2026 Aligncare Physiotherapy &amp; Cancer Rehab Centre. All rights reserved.
                    </p>
                    <p className="text-xs text-[#64748B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Built with care in Pune, India 🇮🇳
                    </p>
                </div>
            </footer>

            {/* Floating WhatsApp — mandatory for Indian healthcare conversions */}
            <WhatsAppButton />
        </>
    );
}
