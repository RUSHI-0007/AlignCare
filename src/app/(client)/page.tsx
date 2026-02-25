import HeroCanvas from "@/components/3d/HeroCanvas";
import ServicesSection from "@/components/booking/ServicesSection";
import TestimonialMarquee from "@/components/ui/TestimonialMarquee";

export default function Page() {
    return (
        <>
            <HeroCanvas />
            <ServicesSection />
            <TestimonialMarquee />

            {/* Decorative Footer placeholder for the landing page */}
            <footer className="bg-secondary-card border-t border-white/5 py-12 text-center text-slate-500">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healing-teal to-trust-blue">Aligncare.</p>
                    <p>© 2026 Aligncare Physiotherapy & Cancer Rehab Clinic. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
