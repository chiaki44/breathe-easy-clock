import { useState, useEffect } from 'react';
import { RHYTHMS, type Rhythm } from './types';
import { useBreathingRhythm } from './hooks/useBreathingRhythm';
import { Clock } from './components/Clock';
import { useAudio } from './hooks/useAudio';
import { useGuide } from './hooks/useGuide';
import { useBreathingHistory } from './hooks/useBreathingHistory'; // Will hook up to Firestore later if needed
import { MoodModal } from './components/MoodModal';
import { HistoryView } from './components/HistoryView';
import { clsx } from 'clsx';
import {
  Volume2,
  VolumeX,
  MessageSquare,
  MessageSquareOff,
  Play,
  RotateCcw,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveSession } from './services/sessionService';

function App() {
  // Config State
  const [selectedRhythm] = useState<Rhythm>(RHYTHMS[0]); // Default to first rhythm
  const [sessionMinutes, setSessionMinutes] = useState<number>(5); // Default 5 min

  // Hooks
  const { currentStep, isActive, toggleActive, reset, setIsActive } = useBreathingRhythm(selectedRhythm);
  const { playNoise, stopNoise } = useAudio();
  const { speak, vibrate } = useGuide();
  const { logs, addLog } = useBreathingHistory(); // LocalStorage for now, will migrate to Firestore

  // UI State
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Mood State
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [showMoodModal, setShowMoodModal] = useState<'before' | 'after' | null>(null);

  // Audio Logic
  useEffect(() => {
    if (isActive && isSoundOn) playNoise();
    else stopNoise();
  }, [isActive, isSoundOn, playNoise, stopNoise]);

  // Guide Logic
  useEffect(() => {
    if (isActive) {
      vibrate();
      if (isVoiceOn) speak(currentStep.label);
    }
  }, [currentStep, isActive, isVoiceOn, speak, vibrate]);

  const handleStartRequest = () => {
    if (moodBefore === null) {
      setShowMoodModal('before');
    } else {
      toggleActive();
    }
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setShowMoodModal('after');
  };

  const handleMoodSelect = (score: number) => {
    if (showMoodModal === 'before') {
      setMoodBefore(score);
      setShowMoodModal(null);
      if (!isActive) toggleActive();
    } else if (showMoodModal === 'after' && moodBefore !== null) {
      // Save log primarily to Firestore
      saveSession({
        selectedMinutes: sessionMinutes,
        completed: true,
        moodBefore,
        moodAfter: score,
      });

      // Keep local log for immediate UI feedback (optional, or remove if moving fully to Firestore)
      const newLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        durationSeconds: sessionMinutes * 60,
        moodBefore: moodBefore,
        moodAfter: score,
        rhythmId: selectedRhythm.id
      };
      addLog(newLog);
      setShowMoodModal(null);

      // Reset after flow complete
      setMoodBefore(null);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-teal-500/30">

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-950 to-black z-0 pointer-events-none opacity-50"></div>

      {/* Header */}
      <header className="z-10 absolute top-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-light tracking-[0.2em] text-slate-300 uppercase opacity-80">Breathe Easy Clock</h1>
        <div className="text-xs text-slate-500 tracking-widest font-mono">{selectedRhythm.name}</div>
      </header>

      {/* Main Clock Area */}
      <main className="z-10 flex flex-col items-center gap-12">

        {/* The Clock */}
        <div className="relative">
          <Clock
            sessionMinutes={sessionMinutes}
            isActive={isActive}
            onComplete={handleSessionComplete}
          />
        </div>

        {/* Breathing Text Overlay (Below Clock) */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={currentStep.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex items-center justify-center pointer-events-none"
              >
                <span className="text-4xl font-light tracking-widest text-teal-400 uppercase select-none font-serif blur-[0.5px]">
                  {currentStep.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Container */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md">

          {/* Direct Actions */}
          <div className="flex items-center gap-8">
            {/* Reset */}
            <button
              onClick={() => { reset(); setMoodBefore(null); }}
              className="p-4 rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all active:scale-95"
              title="リセット"
            >
              <RotateCcw size={20} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={isActive ? toggleActive : handleStartRequest}
              className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 border border-slate-700 shadow-2xl shadow-black hover:border-teal-500/50 transition-all active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-slate-700 group-hover:to-slate-800 transition-all"></div>
              <div className={clsx("relative z-10 text-teal-500 transition-all", isActive ? "opacity-100" : "pl-1")}>
                {isActive ? (
                  <div className="w-8 h-8 rounded-sm bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                ) : (
                  <Play size={40} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
                )}
              </div>
            </button>

            {/* Settings / History */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-4 rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all active:scale-95"
              title="履歴"
            >
              <History size={20} />
            </button>
          </div>

          {/* Session Duration Selector */}
          <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-full border border-slate-800 shadow-inner">
            {[1, 3, 5, 10, 20].map((min) => (
              <button
                key={min}
                onClick={() => {
                  if (!isActive) setSessionMinutes(min);
                }}
                disabled={isActive}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  sessionMinutes === min
                    ? "bg-slate-700 text-teal-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                )}
              >
                {min}分
              </button>
            ))}
          </div>

          {/* Audio Toggles */}
          <div className="flex gap-6">
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={clsx("flex items-center gap-2 text-xs uppercase tracking-wider transition-colors", isSoundOn ? "text-teal-400" : "text-slate-600 hover:text-slate-400")}
            >
              {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>Sound</span>
            </button>
            <button
              onClick={() => setIsVoiceOn(!isVoiceOn)}
              className={clsx("flex items-center gap-2 text-xs uppercase tracking-wider transition-colors", isVoiceOn ? "text-teal-400" : "text-slate-600 hover:text-slate-400")}
            >
              {isVoiceOn ? <MessageSquare size={16} /> : <MessageSquareOff size={16} />}
              <span>Voice</span>
            </button>
          </div>

        </div>
      </main>

      {/* Modals */}
      <MoodModal
        isOpen={!!showMoodModal}
        type={showMoodModal || 'before'}
        onSelect={handleMoodSelect}
        onClose={() => setShowMoodModal(null)}
      />
      <HistoryView
        isOpen={isHistoryOpen}
        logs={logs}
        onClose={() => setIsHistoryOpen(false)}
      />

    </div>
  );
}

export default App;
