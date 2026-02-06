import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { clsx } from "clsx";

interface ClockProps {
    sessionMinutes: number;
    isActive: boolean;
    onComplete: () => void;
}

export const Clock: React.FC<ClockProps> = ({ sessionMinutes, isActive, onComplete }) => {
    // State for ticking hands
    // Long Hand (Seconds): 0-360 degrees, updates every second (6 deg)
    const [secondDegrees, setSecondDegrees] = useState(0);
    // Short Hand (Minutes): Updates every minute (6 deg)
    const [minuteDegrees, setMinuteDegrees] = useState(0);

    useEffect(() => {
        let secondInterval: number;
        let minuteInterval: number;

        if (isActive) {
            // Initial tick
            setSecondDegrees((p) => p + 6);

            // Tick Seconds
            secondInterval = window.setInterval(() => {
                setSecondDegrees((prev) => prev + 6);
            }, 1000);

            // Tick Minutes
            // To ensure it ticks exactly when a minute passes, we can sync it or just run independent interval.
            // Simplest logic: every 60s, increment minute by 6 deg.
            minuteInterval = window.setInterval(() => {
                setMinuteDegrees((prev) => prev + 6);
            }, 60000);


            // Timeout for completion
            const timer = setTimeout(() => {
                onComplete();
            }, sessionMinutes * 60 * 1000);

            return () => {
                clearTimeout(timer);
                clearInterval(secondInterval);
                clearInterval(minuteInterval);
            };

        } else {
            // Reset
            setSecondDegrees(0);
            setMinuteDegrees(0);
        }
    }, [isActive, sessionMinutes, onComplete]);

    return (
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Case (Premium Metal Look) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-black shadow-2xl shadow-black border-[1px] border-slate-600 ring-4 ring-slate-900 overflow-hidden">
                {/* Inner Face */}
                <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 shadow-inner"></div>

                {/* Hour Markers */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "absolute top-0 left-1/2 w-1 -translate-x-1/2 origin-bottom",
                            "h-[50%] pt-6" // Container height is half clock, padding pushes marker down
                        )}
                        style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                    >
                        <div className={clsx(
                            "w-1 bg-slate-500 rounded-full",
                            i % 3 === 0 ? "h-6 opacity-80" : "h-3 opacity-40" // Quarter markers are longer and brighter
                        )}></div>
                    </div>
                ))}

                {/* Minute Markers */}
                {[...Array(60)].map((_, i) => {
                    if (i % 5 === 0) return null; // Skip hour markers
                    return (
                        <div
                            key={`min-${i}`}
                            className="absolute top-0 left-1/2 w-[0.5px] -translate-x-1/2 origin-bottom h-[50%] pt-6 opacity-20"
                            style={{ transform: `translateX(-50%) rotate(${i * 6}deg)` }}
                        >
                            <div className="w-[1px] h-1 bg-slate-400 rounded-full"></div>
                        </div>
                    );
                })}
            </div>

            {/* Center Pin */}
            <div className="absolute z-50 w-4 h-4 rounded-full bg-slate-200 shadow-lg border-2 border-slate-500"></div>

            {/* Short Hand (Minutes) - Gold/Bronze */}
            {/* Ticks every minute (6 degrees) */}
            <motion.div
                animate={{ rotate: minuteDegrees }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute z-30 top-1/2 left-1/2 w-1.5 h-24 -mt-24 origin-bottom rounded-full bg-amber-600 shadow-lg shadow-black/50"
                style={{
                    originY: 1,
                    translateX: "-50%",
                }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-600"></div>
            </motion.div>

            {/* Long Hand (Seconds) - Silver/Blue */}
            {/* Ticks every second (6 degrees) */}
            <motion.div
                animate={{ rotate: secondDegrees }}
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 20
                }}
                className="absolute z-40 top-1/2 left-1/2 w-0.5 h-36 -mt-36 origin-bottom rounded-full bg-sky-400 shadow-md shadow-sky-500/20"
                style={{
                    originY: 1,
                    translateX: "-50%",
                }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400"></div>
            </motion.div>

            {/* Gloss Reflection (Glass effect) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
    );
};
