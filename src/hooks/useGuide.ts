import { useCallback } from 'react';

export function useGuide() {
    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        // Cancel previous utterances
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9; // Slightly slower for relaxation
        utterance.pitch = 0.8; // Slightly lower pitch
        utterance.volume = 0.8;

        window.speechSynthesis.speak(utterance);
    }, []);

    const vibrate = useCallback(() => {
        if (navigator.vibrate) {
            navigator.vibrate(50); // Short tick
        }
    }, []);

    return { speak, vibrate };
}
