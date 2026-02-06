import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';
import type { SessionLog } from '../types';

interface HistoryViewProps {
    isOpen: boolean;
    logs: SessionLog[];
    onClose: () => void;
}

export function HistoryView({ isOpen, logs, onClose }: HistoryViewProps) {
    if (!isOpen) return null;

    // Simple analysis
    const totalSessions = logs.length;

    // Get last 7 days keys for a simple chart or just list recent
    const recentLogs = logs.slice(0, 10);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl max-w-md w-full h-[80vh] flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                            <Activity className="text-teal-500" />
                            整い履歴
                        </h3>
                        <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-teal-50 dark:bg-teal-900/30 p-4 rounded-2xl text-center">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{totalSessions}</div>
                            <div className="text-xs text-teal-600/60 dark:text-teal-400/60">総セッション</div>
                        </div>
                        {/* More stats could go here */}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">最近の記録</h4>
                        <div className="flex flex-col gap-3">
                            {recentLogs.length === 0 ? (
                                <p className="text-center text-slate-400 py-8">まだ記録がありません</p>
                            ) : (
                                recentLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">
                                                {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                                {/* Map ID to name if easy, or current logic */}
                                                {log.rhythmId === '3-6' ? '3-6法' : log.rhythmId === '7-11' ? '7-11法' : 'ボックス呼吸'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400">気分変化</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-mono text-sm dark:text-slate-300">{log.moodBefore}</span>
                                                    <span className="text-slate-300">→</span>
                                                    <span className="font-mono text-lg font-bold text-teal-500">{log.moodAfter}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
