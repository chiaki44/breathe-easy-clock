import { motion } from 'framer-motion';
import type { RhythmStep } from '../types';

interface BreathingCircleProps {
    currentStep: RhythmStep;
    timeLeft: number;
    isActive: boolean;
}

export function BreathingCircle({ currentStep, timeLeft, isActive }: BreathingCircleProps) {
    return (
        <div className="relative flex items-center justify-center w-96 h-96">
            {/* Outer reference ring */}
            <div className="absolute inset-0 rounded-full border border-teal-100/50" />

            {/* Aura / Blur Effect */}
            <motion.div
                className="absolute w-48 h-48 bg-teal-400 rounded-full blur-2xl opacity-40"
                animate={{
                    scale: isActive ? currentStep.scale * 1.1 : 1,
                }}
                transition={{
                    duration: isActive ? currentStep.duration : 1,
                    ease: "easeInOut",
                }}
            />

            {/* Main Circle */}
            <motion.div
                className="absolute w-48 h-48 bg-teal-500 rounded-full shadow-xl"
                animate={{
                    scale: isActive ? currentStep.scale : 1,
                }}
                transition={{
                    duration: isActive ? currentStep.duration : 1,
                    ease: "easeInOut",
                }}
            />

            {/* Text Content */}
            <div className="z-10 flex flex-col items-center justify-center pointer-events-none transform transition-colors duration-500">
                <span className="text-white text-2xl font-light tracking-widest drop-shadow-sm">
                    {isActive ? currentStep.label : '開始'}
                </span>
                {isActive && (
                    <span className="text-white font-mono text-6xl mt-2 font-bold drop-shadow-sm">
                        {timeLeft}
                    </span>
                )}
            </div>
        </div>
    );
}
