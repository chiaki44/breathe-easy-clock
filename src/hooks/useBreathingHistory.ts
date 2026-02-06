import { useState, useEffect, useCallback } from 'react';
import type { SessionLog } from '../types';

const STORAGE_KEY = 'breathing_guide_history';

export function useBreathingHistory() {
    const [logs, setLogs] = useState<SessionLog[]>([]);

    // Load logs on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setLogs(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const addLog = useCallback((log: SessionLog) => {
        setLogs((prev) => {
            const newLogs = [log, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
            return newLogs;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setLogs([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        logs,
        addLog,
        clearHistory
    };
}
