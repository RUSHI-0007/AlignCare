'use client';

import { motion } from 'framer-motion';

const testimonials = [
    { id: 1, name: 'Sarah J.', role: 'Post-Surgery Patient', text: 'The physiotherapy team got me back on my feet faster than I ever thought possible. The 3D movement analysis is incredible.' },
    { id: 2, name: 'Michael T.', role: 'Marathon Runner', text: 'Aligncare identified muscle imbalances I didn\'t know I had. My recovery times have halved since starting treatment.' },
    { id: 3, name: 'Elena R.', role: 'Cancer Survivor', text: 'The cancer rehab program is handled with so much empathy. They didn\'t just rebuild my strength, they rebuilt my confidence.' },
    { id: 4, name: 'David K.', role: 'Home Visit Client', text: 'Having premium clinic-level care in my own living room while recovering from hip surgery was a game-changer.' },
    { id: 5, name: 'Priya M.', role: 'Corporate Athlete', text: 'Fixed my chronic back pain after years of desk work. The personalized approach and futuristic tech make it worth every penny.' },
];

export default function TestimonialMarquee() {
    // Duplicate the array to create a seamless infinite loop
    const marqueeItems = [...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-secondary-card/30 border-y border-white/5 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h3 className="text-2xl font-bold text-white text-center">Trusted by patients worldwide</h3>
            </div>

            {/* Left/Right fading edges so marquee blends in */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary-background to-transparent z-10 pointer-events-none" />

            <div className="flex w-fit">
                <motion.div
                    className="flex gap-6 pr-6"
                    animate={{ x: '-50%' }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {marqueeItems.map((item, idx) => (
                        <div
                            key={`${item.id}-${idx}`}
                            className="w-[400px] flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2DD4BF" stroke="#2DD4BF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                ))}
                            </div>
                            <p className="text-slate-300 font-light leading-relaxed mb-6">&quot;{item.text}&quot;</p>
                            <div className="mt-auto">
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-healing-teal text-sm">{item.role}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
