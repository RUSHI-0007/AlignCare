"use client";
import React from "react";
import { motion } from "framer-motion";

export type TestimonialItem = {
    text: string;
    image: string;
    name: string;
    role: string;
};

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: TestimonialItem[];
    duration?: number;
}) => {
    return (
        <div className={props.className} style={{ overflow: "hidden" }}>
            <motion.div
                animate={{ translateY: "-50%" }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        {props.testimonials.map(({ text, image, name, role }, i) => (
                            <div
                                key={i}
                                className="rounded-3xl max-w-xs w-full p-8"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                {/* Turmeric stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, s) => (
                                        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-sm leading-relaxed mb-6"
                                    style={{ fontFamily: "DM Sans, sans-serif", color: "#E2E8F0" }}>
                                    &ldquo;{text}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        className="h-10 w-10 rounded-full object-cover"
                                        style={{ border: "2px solid rgba(245,158,11,0.4)" }}
                                    />
                                    <div className="flex flex-col">
                                        {/* Patient name — Turmeric */}
                                        <div className="font-semibold text-sm leading-5"
                                            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "#F59E0B" }}>
                                            {name}
                                        </div>
                                        <div className="text-xs leading-5 opacity-60"
                                            style={{ fontFamily: "DM Sans, sans-serif", color: "#E2E8F0" }}>
                                            {role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))]}
            </motion.div>
        </div>
    );
};
