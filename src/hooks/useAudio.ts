import { useRef, useEffect, useCallback } from 'react';

export function useAudio() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const initializeAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    const playNoise = useCallback(() => {
        initializeAudio();
        const ctx = audioContextRef.current;
        if (!ctx) return;

        // Resume context if suspended (browser policy)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Create Brown Noise Buffer (Soft, rain-like)
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate for gain loss from integration
        }

        // Create Source
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        // Create Filter (Lowpass to make it sound like distant rain/ocean)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        // Create Gain (Volume)
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.5; // Adjustable volume

        // Connect graph
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Start
        noiseSource.start();

        noiseSourceRef.current = noiseSource;
        gainNodeRef.current = gainNode;
    }, [initializeAudio]);

    const stopNoise = useCallback(() => {
        if (gainNodeRef.current) {
            // Fade out
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 0.5);
        }
        if (noiseSourceRef.current) {
            noiseSourceRef.current.stop(audioContextRef.current!.currentTime + 0.5);
            noiseSourceRef.current = null;
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            stopNoise();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { playNoise, stopNoise };
}

// Brown noise generator state
let lastOut = 0;
