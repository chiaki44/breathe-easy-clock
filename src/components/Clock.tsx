import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ClockProps {
    sessionMinutes: number;
    isActive: boolean;
    onComplete: () => void;
}

export const Clock: React.FC<ClockProps> = ({ sessionMinutes, isActive, onComplete }) => {
    // State for ticking hands
    const [secondDegrees, setSecondDegrees] = useState(0);
    const [minuteDegrees, setMinuteDegrees] = useState(0);

    // Refs for precise timing
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (isActive) {
            // Set start time
            const start = Date.now();

            // Initial state
            setSecondDegrees(6);
            // setMinuteDegrees(0); // Assuming start at 0

            const animate = () => {
                const now = Date.now();
                const elapsed = now - start;

                // --- Second Hand (Long Hand) ---
                // Tick every second (1000ms)
                // We want: 0s-999s -> 6deg, 1000ms-1999ms -> 12deg?
                // Standard clock: Ticks TO the next second.
                // Let's say at 0ms it's at 0. At 1000ms it triggers to 6.
                // So expectedSeconds = ceil(elapsed/1000) * 6?
                // Or floor(elapsed/1000) + 1.
                const secondsPassed = Math.floor(elapsed / 1000) + 1;
                const expectedSecondDeg = secondsPassed * 6;

                // --- Minute Hand (Short Hand) ---
                // 1) Logic: 360 deg in (sessionMinutes) minutes.
                // 2) Ticking: Move once per MINUTE.
                // So at 60s (60000ms), it moves.
                // Angle per minute = 360 / sessionMinutes.
                const minutesPassed = Math.floor(elapsed / 60000) + 1;
                // Wait, first tick at 1 min? Yes.
                const degreesPerMinute = 360 / sessionMinutes;

                // If we want it to move at 1 minute mark:
                const expectedMinuteDeg = Math.floor(elapsed / 60000) * degreesPerMinute;
                // Actually, standard clock moves gradually? User asked for "Tick".
                // "Short hand ticks minutes" -> Yes, at 60s, move one step.
                // But if session is 5 min, 1 step = 72 degrees. That's a huge jump!
                // "Short hand is minute hand"? Or "Short hand is session hand"?
                // "Short hand ticks minutes" usually means one tick per minute.

                // Logic check:
                // 5 min session. Total 360 deg.
                // 1 min passed -> 1/5th circle -> 72 deg.
                // Correct. Big jump.

                // If it's 1 hour clock, 1 min = 6 deg.
                // User said "Short hand moves 6 deg per minute" (implied by previous context) OR "One lap per session"?
                // Spec: "Short hand: 1 lap in sessionMinutes".
                // So if 5 mins, moves 72 deg/min.
                // If user wants "Tick", then yes, jump 72 deg at 60s.

                // Let's implement strictly based on time to avoid drift.

                if (elapsed >= sessionMinutes * 60 * 1000) {
                    onComplete();
                    return;
                }

                setSecondDegrees((prev) => {
                    if (prev !== expectedSecondDeg) return expectedSecondDeg;
                    return prev;
                });

                // Only update minutes if changed
                // We want strictly integer changes for "ticking" look.
                // floor(elapsed/60000) changes at 60000, 120000...
                // So initial (0-59s) it is 0. At 60s it becomes 1 * step.
                const currentMinuteStep = Math.floor(elapsed / 60000);
                const targetMinDeg = currentMinuteStep * degreesPerMinute;

                setMinuteDegrees((prev) => {
                    if (prev !== targetMinDeg) return targetMinDeg;
                    return prev;
                });

                frameRef.current = requestAnimationFrame(animate);
            };

            frameRef.current = requestAnimationFrame(animate);

            return () => {
                cancelAnimationFrame(frameRef.current);
            };

        } else {
            // Reset
            setSecondDegrees(0);
            setMinuteDegrees(0);
        }
    }, [isActive, sessionMinutes, onComplete]);

    return (
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Case */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-black shadow-2xl shadow-black border-[1px] border-slate-600 ring-4 ring-slate-900 overflow-hidden">
                <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 shadow-inner"></div>

                {/* Markers */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "absolute top-0 left-1/2 w-1 -translate-x-1/2 origin-bottom",
                            "h-[50%] pt-6"
                        )}
                        style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                    >
                        <div className={clsx(
                            "w-1 bg-slate-500 rounded-full",
                            i % 3 === 0 ? "h-6 opacity-80" : "h-3 opacity-40"
                        )}></div>
                    </div>
                ))}

                {/* Minute Markers */}
                {[...Array(60)].map((_, i) => {
                    if (i % 5 === 0) return null;
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

            {/* Short Hand (Minutes) */}
            <motion.div
                animate={{ rotate: minuteDegrees }}
                transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                }}
                className="absolute z-30 top-1/2 left-1/2 w-1.5 h-24 -mt-24 origin-bottom rounded-full bg-amber-600 shadow-lg shadow-black/50"
                style={{ originY: 1, translateX: "-50%" }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-600"></div>
            </motion.div>

            {/* Long Hand (Seconds) */}
            <motion.div
                animate={{ rotate: secondDegrees }}
                transition={{
                    duration: 0.15,
                    ease: "easeOut"
                }}
                className="absolute z-40 top-1/2 left-1/2 w-0.5 h-36 -mt-36 origin-bottom rounded-full bg-sky-400 shadow-md shadow-sky-500/20"
                style={{ originY: 1, translateX: "-50%" }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400"></div>
            </motion.div>

            {/* Gloss */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
    );
};
