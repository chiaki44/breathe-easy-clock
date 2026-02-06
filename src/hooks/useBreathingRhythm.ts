import { useState, useEffect, useRef } from 'react';
import type { Rhythm } from '../types';

export function useBreathingRhythm(rhythm: Rhythm) {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(rhythm.steps[0].duration);

    // Use a ref to track index inside the interval closure without resetting the timer
    const indexRef = useRef(0);

    // Sync ref with state
    useEffect(() => {
        indexRef.current = currentStepIndex;
    }, [currentStepIndex]);

    // Reset when rhythm changes
    useEffect(() => {
        setIsActive(false);
        setCurrentStepIndex(0);
        indexRef.current = 0;
        setTimeLeft(rhythm.steps[0].duration);
    }, [rhythm.id, rhythm.steps]);

    // Timer logic
    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                // Determine if we should switch (at 1s remaining, next tick is 0)
                // We typically switch AT 0. So 3 -> 2 -> 1 -> SWITCH.
                // If we want to show 3, 2, 1... implies 3 seconds duration.
                if (prev <= 1) {
                    const nextIndex = (indexRef.current + 1) % rhythm.steps.length;

                    // Atomic-like update: Set Index AND Time
                    // Since these are separate state calls, React 18+ auto-batches them in event handlers/effects.
                    setCurrentStepIndex(nextIndex);

                    // Return the NEW duration primarily to update the 'timeLeft' state correctly
                    // for the next render cycle.
                    return rhythm.steps[nextIndex].duration;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, rhythm.steps]);

    const toggleActive = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setCurrentStepIndex(0);
        setTimeLeft(rhythm.steps[0].duration);
    };

    const currentStep = rhythm.steps[currentStepIndex];

    return {
        currentStep,
        timeLeft,
        isActive,
        toggleActive,
        reset,
        setIsActive
    };
}
