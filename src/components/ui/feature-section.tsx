"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Feature {
    step: string
    title?: string
    content: string
    image: string
}

interface FeatureStepsProps {
    features: Feature[]
    className?: string
    title?: string
    autoPlayInterval?: number
    imageHeight?: string
}

export function FeatureSteps({
    features,
    className,
    title = "Our Services",
    autoPlayInterval = 4000,
    imageHeight = "h-[400px]",
}: FeatureStepsProps) {
    const [currentFeature, setCurrentFeature] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
            } else {
                setCurrentFeature((prev) => (prev + 1) % features.length)
                setProgress(0)
            }
        }, 100)
        return () => clearInterval(timer)
    }, [progress, features.length, autoPlayInterval])

    return (
        <div className={cn("py-20 px-6 md:px-12", className)} style={{ backgroundColor: '#F0F4FF' }}>
            <div className="max-w-6xl mx-auto w-full">
                {/* Section header */}
                <div className="text-center mb-14">
                    <p className="text-xs tracking-widest uppercase mb-3"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#64748B' }}>
                        Our Specialisations
                    </p>
                    <h2 className="font-bold"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0F1E3C', letterSpacing: '-0.025em' }}>
                        {title}
                    </h2>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left — step list */}
                    <div className="order-2 md:order-1 space-y-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-5 cursor-pointer"
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: index === currentFeature ? 1 : 0.35 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => { setCurrentFeature(index); setProgress(0); }}
                            >
                                {/* Step indicator */}
                                <motion.div
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm"
                                    style={{
                                        backgroundColor: index <= currentFeature ? '#2D5BE3' : '#EEF2FF',
                                        borderColor: index <= currentFeature ? '#2D5BE3' : '#C7D2FE',
                                        color: index <= currentFeature ? '#fff' : '#64748B',
                                        transform: index === currentFeature ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {index < currentFeature ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </motion.div>

                                <div className="flex-1">
                                    <h3 className="font-bold mb-1"
                                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.15rem', color: '#0F1E3C' }}>
                                        {feature.title || feature.step}
                                    </h3>
                                    <p className="text-sm leading-relaxed"
                                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B', lineHeight: 1.75 }}>
                                        {feature.content}
                                    </p>

                                    {/* Progress bar — only on active step */}
                                    {index === currentFeature && (
                                        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#C7D2FE' }}>
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: '#2D5BE3', width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right — animated image */}
                    <div className={cn("order-1 md:order-2 relative w-full overflow-hidden rounded-2xl", imageHeight)}
                        style={{ boxShadow: '0 12px 48px rgba(45,91,227,0.18)' }}>
                        <AnimatePresence mode="wait">
                            {features.map((feature, index) =>
                                index === currentFeature && (
                                    <motion.div
                                        key={index}
                                        className="absolute inset-0 rounded-2xl overflow-hidden"
                                        initial={{ y: 60, opacity: 0, rotateX: -10 }}
                                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                        exit={{ y: -60, opacity: 0, rotateX: 10 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <Image
                                            src={feature.image}
                                            alt={feature.step}
                                            className="w-full h-full object-cover"
                                            width={800}
                                            height={500}
                                        />
                                        {/* Gradient overlay so text could sit on top */}
                                        <div className="absolute inset-0"
                                            style={{ background: 'linear-gradient(to top, rgba(45,91,227,0.25) 0%, transparent 60%)' }} />
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
