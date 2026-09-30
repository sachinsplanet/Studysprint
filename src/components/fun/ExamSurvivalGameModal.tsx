import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useFun } from '../../lib/fun/funContext';
import { soundEngine } from '../../lib/fun/sound';

interface TargetItem {
  id: number;
  x: number; // percentage
  y: number; // percentage
  type: 'study' | 'distraction';
  emoji: string;
  name: string;
}

const STUDY_ITEMS = [
  { emoji: '📚', name: 'Textbook' },
  { emoji: '✏️', name: '0.38mm Pen' },
  { emoji: '🧮', name: 'Calculator' },
  { emoji: '☕', name: 'Espresso' },
  { emoji: '📓', name: 'Formula Sheet' }
];

const DISTRACTION_ITEMS = [
  { emoji: '📱', name: 'Doomscrolling' },
  { emoji: '🎮', name: 'Gaming' },
  { emoji: '🛌', name: 'Emergency Nap' },
  { emoji: '🍿', name: 'Netflix Binge' }
];

export const ExamSurvivalGameModal: React.FC = () => {
  const { activeModal, closeModal, openModal, addXP, unlockAchievement } = useFun();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [studyCollected, setStudyCollected] = useState(0);
  const [distractionsClicked, setDistractionsClicked] = useState(0);

  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'examSurvivalGame') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  const startGame = () => {
    setStudyCollected(0);
    setDistractionsClicked(0);
    setTimeLeft(30);
    setGameState('playing');
    setTargets([]);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('over');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Target spawner
  useEffect(() => {
    if (gameState !== 'playing') {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      return;
    }

    spawnTimerRef.current = setInterval(() => {
      setTargets((prev) => {
        // Keep max 5 targets active at a time
        const clean = prev.slice(-4);
        const isStudy = Math.random() > 0.4;
        const pool = isStudy ? STUDY_ITEMS : DISTRACTION_ITEMS;
        const picked = pool[Math.floor(Math.random() * pool.length)];

        const newItem: TargetItem = {
          id: Math.random(),
          x: Math.floor(Math.random() * 75) + 10,
          y: Math.floor(Math.random() * 65) + 15,
          type: isStudy ? 'study' : 'distraction',
          emoji: picked.emoji,
          name: picked.name
        };
        return [...clean, newItem];
      });
    }, 650);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState]);

  const handleTargetClick = (target: TargetItem) => {
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    if (target.type === 'study') {
      setStudyCollected((s) => s + 1);
      soundEngine.playPop();
    } else {
      setDistractionsClicked((d) => d + 1);
      soundEngine.playBoing();
    }
  };

  // Calculate survival score %
  const totalClicks = studyCollected + distractionsClicked;
  const survivalRate =
    totalClicks === 0 ? 50 : Math.max(10, Math.min(99, Math.round(((studyCollected * 1.5 - distractionsClicked * 1.2) / (totalClicks * 1.5)) * 100)));

  // Game over hook
  useEffect(() => {
    if (gameState === 'over') {
      const earnedXP = Math.max(15, studyCollected * 4);
      addXP(earnedXP, `Completed Exam Survival Challenge (${survivalRate}% survival)`);
      if (survivalRate >= 80) {
        unlockAchievement('game_champ');
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameState, survivalRate, studyCollected, addXP, unlockAchievement]);

  if (activeModal !== 'examSurvivalGame') return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-[#FFFDF5] dark:bg-[#131D31] max-w-lg w-full p-6 text-[#10182B] dark:text-slate-100 animate-in zoom-in-95 duration-200 select-none border-2 border-[#F0E3B5] dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#F0E3B5] dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h3 className="font-display font-bold text-xl text-[#10182B] dark:text-white">
                Exam Survival Reflex
              </h3>
            </div>
            <p className="text-xs text-[#58647D] dark:text-slate-300">
              Click study items quickly! Avoid distractions!
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full border border-[#F0E3B5] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-[#10182B] dark:text-white hover:bg-[#FFF4C7] dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* HUD */}
        <div className="flex items-center justify-between my-3 px-3 py-2 bg-[#FFF4C7] dark:bg-[#1A263F] rounded-xl border border-[#F0E3B5] dark:border-slate-700 font-display text-sm text-[#10182B] dark:text-slate-200">
          <span>⏱️ Time: <b>{timeLeft}s</b></span>
          <span>📚 Study Items: <b className="text-[#00B887] dark:text-emerald-400">{studyCollected}</b></span>
          <span>⚠️ Traps: <b className="text-[#FF719A]">{distractionsClicked}</b></span>
        </div>

        {/* Game Arena */}
        <div className="relative w-full h-72 bg-[#FFFDF5] dark:bg-[#0B0F19] rounded-2xl border-2 border-[#F0E3B5] dark:border-slate-700 overflow-hidden shadow-inner">
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FFFDF5]/95 dark:bg-[#131D31]/95 backdrop-blur-xs z-20">
              <div className="text-5xl mb-2">🎯</div>
              <h4 className="font-display font-bold text-lg mb-1 text-[#10182B] dark:text-white">Survive The Exam Sprint!</h4>
              <p className="font-body text-xs text-[#58647D] dark:text-slate-300 mb-4 max-w-xs">
                Items will flash all over the screen. Tap books, coffee, calculators, and pens. Avoid phones, naps, and games!
              </p>
              <button
                type="button"
                onClick={startGame}
                className="btn-doodle btn-primary px-6 py-2.5 text-sm"
              >
                Begin Exam 🚀
              </button>
            </div>
          )}

          {gameState === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FFFDF5]/95 dark:bg-[#131D31]/95 backdrop-blur-xs z-20">
              <div className="text-4xl mb-1">🏁</div>
              <h4 className="font-display font-bold text-xl mb-1 text-[#10182B] dark:text-white">Exam Concluded!</h4>
              <div className="my-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-700">
                <span className="text-xs uppercase tracking-wider text-[#58647D] dark:text-slate-400 block">Exam Survival Score</span>
                <span className="font-display font-bold text-3xl text-[#00B887] dark:text-emerald-400">
                  {survivalRate}%
                </span>
                <p className="text-xs font-display mt-1 text-[#10182B] dark:text-slate-200">
                  Status: <b>{survivalRate >= 80 ? 'Barely prepared, but confident. 🏆' : 'Need more pastel highlighters! ✏️'}</b>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="btn-doodle btn-primary px-4 py-2 text-xs sm:text-sm"
                >
                  Try Again 🔄
                </button>
                <button
                  type="button"
                  onClick={() => openModal('catchBooksGame')}
                  className="btn-doodle btn-ghost px-3 py-2 text-xs border border-[#F0E3B5]"
                  title="Switch to Catch The Books mini-game"
                >
                  🎒 Catch The Books
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-doodle btn-ghost px-4 py-2 text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Active Targets */}
          {targets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTargetClick(t)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl border-2 border-[#1E2A4A] dark:border-white shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer animate-in zoom-in-50 duration-150 flex flex-col items-center bg-white dark:bg-slate-800"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`
              }}
            >
              <span className="text-3xl">{t.emoji}</span>
              <span className="text-[10px] font-display font-bold text-[#1E2A4A] dark:text-white px-1">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
