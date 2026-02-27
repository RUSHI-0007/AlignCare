"use client";
import { motion } from "framer-motion";
import { TestimonialsColumn, type TestimonialItem } from "./testimonials-columns-1";

const testimonials: TestimonialItem[] = [
    {
        text: "After my knee replacement I was scared to even stand. The team here made me feel completely safe from day one. Within 6 weeks I was walking unaided. I cannot thank Aligncare enough.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Priya Sharma",
        role: "Post-Surgery Recovery, Pune",
    },
    {
        text: "My oncologist referred me here after chemotherapy. The rehab programme was built exactly around my situation — they treated me like family, not a patient number.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Rajesh Kulkarni",
        role: "Cancer Survivor",
    },
    {
        text: "I had a chronic IT band issue for two years. The physiotherapy team pinpointed things no one else had. Back running in 8 weeks. Genuinely brilliant.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Anita Desai",
        role: "Marathon Runner",
    },
    {
        text: "My father had a stroke at 72 and we could not transport him. The home visit physiotherapy was clinic-quality — same equipment, same expertise. Truly exceptional.",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        name: "Vikram Mehta",
        role: "Home Visit Client",
    },
    {
        text: "Years of desk work destroyed my lower back. The personalised protocol they built changed my life. I sleep properly for the first time in years.",
        image: "https://randomuser.me/api/portraits/women/90.jpg",
        name: "Sunita Patil",
        role: "Working Professional",
    },
    {
        text: "My daughter had a sports injury before her board exams. Aligncare's rapid rehab plan had her back to training in 3 weeks without missing a single class.",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        name: "Suresh Iyer",
        role: "Parent of a Patient",
    },
    {
        text: "The cancer rehab programme gave me back my strength and my confidence after surgery. Every session felt purposeful, never clinical.",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        name: "Kavita Rao",
        role: "Breast Cancer Rehab",
    },
    {
        text: "Professional, warm, and deeply knowledgeable. The home visit service for my elderly mother was a genuine lifeline for our family.",
        image: "https://randomuser.me/api/portraits/women/55.jpg",
        name: "Deepa Nair",
        role: "Family Caregiver",
    },
    {
        text: "I was referred by three different doctors. Every one of them was right. The results speak for themselves — I'm pain-free for the first time in four years.",
        image: "https://randomuser.me/api/portraits/men/15.jpg",
        name: "Amit Bhosale",
        role: "Chronic Pain Patient",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function TestimonialMarquee() {
    return (
        // ONLY dark section on the page — earns trust through contrast
        <section className="relative overflow-hidden py-24 px-6" style={{ backgroundColor: "#0F1E3C" }}>
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-12"
                >
                    <div className="mb-4 px-4 py-1 rounded-full border text-xs tracking-widest uppercase"
                        style={{ borderColor: "rgba(45,91,227,0.4)", color: "#B8CCF4", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        What Patients Say
                    </div>
                    <h3 className="font-bold"
                        style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#FFFFFF" }}>
                        Stories of{" "}
                        <span style={{ color: "#2D5BE3" }}>Recovery</span>
                    </h3>
                    <p className="mt-3 text-sm max-w-md"
                        style={{ fontFamily: "DM Sans, sans-serif", color: "#64748B" }}>
                        Real patients. Real results. Every story matters.
                    </p>
                </motion.div>

                {/* Three vertical scrolling columns — faded top & bottom */}
                <div
                    className="flex justify-center gap-6 max-h-[740px] overflow-hidden"
                    style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={18} />
                    <TestimonialsColumn testimonials={secondColumn} duration={22} className="hidden md:block" />
                    <TestimonialsColumn testimonials={thirdColumn} duration={20} className="hidden lg:block" />
                </div>
            </div>
        </section>
    );
}
