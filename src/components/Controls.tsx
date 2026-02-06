import { RHYTHMS, type Rhythm } from '../types';
import { clsx } from 'clsx';

interface ControlsProps {
    currentRhythm: Rhythm;
    onRhythmChange: (rhythm: Rhythm) => void;
    isActive: boolean;
    sessionDuration: number | null;
    onDurationChange: (duration: number | null) => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onOpenHistory: () => void;
}

import { Sun, Moon, Infinity as InfinityIcon, Calendar } from 'lucide-react';

export function Controls({
    currentRhythm,
    onRhythmChange,
    isActive,
    sessionDuration,
    onDurationChange,
    isDarkMode,
    onToggleDarkMode,
    onOpenHistory
}: ControlsProps) {

    const durations = [
        { value: 60, label: '1分' },
        { value: 180, label: '3分' },
        { value: 300, label: '5分' },
        { value: null, label: '∞' },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-lg w-full px-4">

            {/* Settings Row: Duration & Dark Mode */}
            <div className="flex justify-between items-center gap-4">

                {/* Duration Selector */}
                <div className={`flex items-center gap-1 p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100/80'}`}>
                    {durations.map((d) => (
                        <button
                            key={d.label}
                            onClick={() => !isActive && onDurationChange(d.value)}
                            disabled={isActive}
                            className={clsx(
                                "px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all",
                                sessionDuration === d.value
                                    ? (isDarkMode ? "bg-teal-700 text-white shadow-sm" : "bg-white text-teal-600 shadow-sm")
                                    : (isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"),
                                isActive && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {d.value === null ? <InfinityIcon size={14} /> : d.label}
                        </button>
                    ))}
                </div>

                {/* History Button */}
                <button
                    onClick={onOpenHistory}
                    className={clsx(
                        "p-2 rounded-xl transition-all",
                        isDarkMode
                            ? "bg-slate-800 text-teal-400 hover:bg-slate-700"
                            : "bg-gray-100 text-teal-600 hover:bg-gray-200"
                    )}
                    title="履歴"
                >
                    <Calendar size={20} />
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={onToggleDarkMode}
                    className={clsx(
                        "p-2 rounded-xl transition-all",
                        isDarkMode
                            ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                            : "bg-gray-100 text-slate-500 hover:bg-gray-200"
                    )}
                    title={isDarkMode ? "ライトモード" : "ナイトモード"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Rhythm Selector */}
            <div className={clsx(
                "grid grid-cols-3 gap-2 p-1.5 backdrop-blur-sm rounded-2xl",
                isDarkMode ? "bg-slate-800/80" : "bg-gray-100/80"
            )}>
                {RHYTHMS.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => !isActive && onRhythmChange(r)}
                        disabled={isActive}
                        className={clsx(
                            "py-3 px-2 text-sm md:text-base font-medium rounded-xl transition-all duration-200",
                            currentRhythm.id === r.id
                                ? (isDarkMode ? "bg-slate-700 text-teal-300 ring-1 ring-white/10" : "bg-white text-teal-600 shadow-sm ring-1 ring-black/5")
                                : (isDarkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"),
                            isActive && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {r.name}
                    </button>
                ))}
            </div>
            {/* Description Removed as per request */}
            {/* <div className="text-center text-gray-500 font-medium tracking-wide h-6">
                {currentRhythm.description}
            </div> */}
        </div>
    );
}
