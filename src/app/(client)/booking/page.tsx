import BookingWizard from "@/components/booking/BookingWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book Appointment | Aligncare",
    description: "Schedule your premium physiotherapy or cancer rehab appointment.",
};

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-cream-50 pt-32 pb-24 relative overflow-hidden">
            {/* Decorative background elements matching the sleek light aesthetic */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-clinic-blue-100 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-100/50 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-clinic-blue-200 bg-clinic-blue-50">
                        <span className="text-clinic-blue-700 font-medium text-sm tracking-wide uppercase">Priority Scheduling</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-clinic-navy mb-4 tracking-tight">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue-600 to-teal-600">Session</span>
                    </h1>
                    <p className="text-clinic-muted max-w-2xl mx-auto text-lg font-light">
                        Select your preferred treatment, date, and time. Our system ensures you are paired with the right specialist for optimized recovery.
                    </p>
                </div>

                <BookingWizard />
            </div>
        </div>
    );
}
