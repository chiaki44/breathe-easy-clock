export type BreathPhase = 'inhale' | 'hold' | 'exhale';

export interface RhythmStep {
    phase: BreathPhase;
    duration: number; // in seconds
    label: string;
    scale: number;
}

export interface Rhythm {
    id: string;
    name: string;
    description: string;
    steps: RhythmStep[];
}

export const RHYTHMS: Rhythm[] = [
    {
        id: '3-6',
        name: '3-6法',
        description: '吸う(3秒) / 吐く(6秒)',
        steps: [
            { phase: 'inhale', duration: 3, label: '吸う', scale: 1.5 },
            { phase: 'exhale', duration: 6, label: '吐く', scale: 1.0 },
        ],
    },
    {
        id: '7-11',
        name: '7-11法',
        description: '吸う(7秒) / 吐く(11秒)',
        steps: [
            { phase: 'inhale', duration: 7, label: '吸う', scale: 1.5 },
            { phase: 'exhale', duration: 11, label: '吐く', scale: 1.0 },
        ],
    },
    {
        id: 'box',
        name: 'ボックス呼吸',
        description: '吸う(4秒) / 止める(4秒) / 吐く(4秒) / 止める(4秒)',
        steps: [
            { phase: 'inhale', duration: 4, label: '吸う', scale: 1.5 },
            { phase: 'hold', duration: 4, label: '止める', scale: 1.5 },
            { phase: 'exhale', duration: 4, label: '吐く', scale: 1.0 },
            { phase: 'hold', duration: 4, label: '止める', scale: 1.0 },
        ],
    },
];

export interface SessionLog {
    id: string;
    timestamp: string; // ISO String
    durationSeconds: number;
    moodBefore: number; // 1-5
    moodAfter: number; // 1-5
    rhythmId: string;
}
