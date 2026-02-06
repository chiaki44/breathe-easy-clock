import { motion, AnimatePresence } from 'framer-motion';
import { Frown, Meh, Smile } from 'lucide-react';

interface MoodModalProps {
    isOpen: boolean;
    type: 'before' | 'after';
    onSelect: (score: number) => void;
    onClose: () => void; // For cancelling start
}

export function MoodModal({ isOpen, type, onSelect, onClose }: MoodModalProps) {
    if (!isOpen) return null;

    const faces = [
        { score: 1, icon: Frown, color: 'text-red-400', label: '乱れている' },
        { score: 2, icon: Meh, color: 'text-orange-400', label: '少し不安' },
        { score: 3, icon: Meh, color: 'text-yellow-400', label: '普通' },
        { score: 4, icon: Smile, color: 'text-teal-400', label: '良い' },
        { score: 5, icon: Smile, color: 'text-green-500', label: '最高' },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                >
                    <h3 className="text-xl font-bold mb-2 dark:text-white">
                        {type === 'before' ? '今の気分は？' : '呼吸後の気分は？'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        {type === 'before' ? '開始前の状態を記録しましょう' : '効果を確認しましょう'}
                    </p>

                    <div className="flex justify-between gap-2">
                        {faces.map((face) => (
                            <button
                                key={face.score}
                                onClick={() => onSelect(face.score)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 transition-transform group-hover:scale-110 ${face.color}`}>
                                    <face.icon size={28} />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">{face.score}</span>
                            </button>
                        ))}
                    </div>

                    {type === 'before' && (
                        <button
                            onClick={onClose}
                            className="mt-8 text-sm text-slate-400 hover:text-slate-600 underline"
                        >
                            キャンセル
                        </button>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
