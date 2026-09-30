import React, { useState, useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';
import { STUDENT_LEVELS } from '../../lib/fun/constants';

export const AchievementModal: React.FC = () => {
  const { activeModal, closeModal, achievements, easterEggs, xp, level } = useFun();
  const [tab, setTab] = useState<'achievements' | 'eggs' | 'roadmap'>('achievements');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'achievements') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'achievements') return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const discoveredEggsCount = easterEggs.filter((e) => e.discovered).length;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-[#FFFDF5] dark:bg-[#131D31] max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#10182B] dark:text-slate-100 animate-in zoom-in-95 duration-200 border-2 border-[#F0E3B5] dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#F0E3B5] dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏆</span>
              <h3 className="font-display font-bold text-2xl text-[#10182B] dark:text-white">
                Academic Hall of Fame
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-[#58647D] dark:text-slate-300 mt-1">
              Current Status: <b className="text-[#10182B] dark:text-yellow-400">{level.emoji} {level.title}</b> ({xp} Academic XP)
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

        {/* Tab switchers */}
        <div className="flex gap-2 my-4 border-b border-[#F0E3B5] dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setTab('achievements')}
            className={`px-3 py-1.5 rounded-full font-display text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              tab === 'achievements'
                ? 'bg-[#FFD600] text-[#10182B] shadow-xs scale-105 border border-[#E5C000]'
                : 'bg-white dark:bg-slate-800 text-[#58647D] dark:text-slate-300 border border-[#F0E3B5] dark:border-slate-700 hover:bg-[#FFF9DF]'
            }`}
          >
            Trophies ({unlockedCount}/{achievements.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('eggs')}
            className={`px-3 py-1.5 rounded-full font-display text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              tab === 'eggs'
                ? 'bg-[#FF719A] text-white shadow-xs scale-105'
                : 'bg-white dark:bg-slate-800 text-[#58647D] dark:text-slate-300 border border-[#F0E3B5] dark:border-slate-700 hover:bg-[#FFF9DF]'
            }`}
          >
            🥚 Easter Eggs ({discoveredEggsCount}/10)
          </button>
          <button
            type="button"
            onClick={() => setTab('roadmap')}
            className={`px-3 py-1.5 rounded-full font-display text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              tab === 'roadmap'
                ? 'bg-[#FFF4C7] text-[#10182B] shadow-xs scale-105 border border-[#F0E3B5]'
                : 'bg-white dark:bg-slate-800 text-[#58647D] dark:text-slate-300 border border-[#F0E3B5] dark:border-slate-700 hover:bg-[#FFF9DF]'
            }`}
          >
            🗺️ Levels Roadmap
          </button>
        </div>

        {/* TAB 1: ACHIEVEMENTS */}
        {tab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  item.unlocked
                    ? 'border-[#FFD600] bg-white dark:bg-[#1A263F] text-[#10182B] dark:text-slate-100 shadow-xs'
                    : 'border-dashed border-[#F0E3B5] dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 opacity-60'
                }`}
              >
                <span className={`text-2xl shrink-0 ${!item.unlocked && 'grayscale'}`}>
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-display font-bold text-xs sm:text-sm text-[#10182B] dark:text-white">
                      {item.title}
                    </p>
                    {item.unlocked && (
                      <span className="text-[10px] bg-[#E9FFF5] text-[#00B887] border border-[#A7F3D0] px-1.5 py-0.2 rounded-full font-bold">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-[#58647D] dark:text-slate-300 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: EASTER EGGS TRACKER */}
        {tab === 'eggs' && (
          <div className="space-y-3 mt-4">
            <div className="bg-[#FFF4C7] dark:bg-[#1A263F] p-3 rounded-xl border border-[#F0E3B5] text-xs font-body text-[#10182B] dark:text-amber-200 flex items-center justify-between">
              <span>Find and interact with secret elements across the website to uncover all 10 Easter Eggs!</span>
              <span className="font-display font-bold text-sm shrink-0 ml-2">
                {discoveredEggsCount} / 10 Found
              </span>
            </div>

            <div className="space-y-2">
              {easterEggs.map((egg, index) => (
                <div
                  key={egg.id}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 text-xs font-body ${
                    egg.discovered
                      ? 'border-[#FFCCD9] bg-[#FFF0F5] dark:bg-[#2F1725] text-[#10182B] dark:text-pink-100'
                      : 'border-[#F0E3B5] dark:border-slate-700 bg-white dark:bg-slate-800/40 text-[#7B8498] dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-display font-bold text-sm text-[#58647D] dark:text-slate-400">#{index + 1}</span>
                    <span className="text-base">{egg.discovered ? '✨' : '❓'}</span>
                    <div className="min-w-0">
                      <b className="font-display block text-xs sm:text-sm text-[#10182B] dark:text-white truncate">
                        {egg.discovered ? egg.name : 'Undiscovered Mystery'}
                      </b>
                      <span className="text-[11px] opacity-80 block truncate">
                        {egg.discovered ? 'Discovered! (+100 XP awarded)' : `Clue: ${egg.hint}`}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 font-display font-bold text-[11px]">
                    {egg.discovered ? '✅ DONE' : '🔒 LOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEVEL ROADMAP */}
        {tab === 'roadmap' && (
          <div className="space-y-3 mt-4">
            {STUDENT_LEVELS.map((lvl) => {
              const isCurrent = lvl.level === level.level;
              const isUnlocked = xp >= lvl.minXP;
              return (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-[#FFD600] bg-[#FFF4C7] dark:bg-[#1A263F] shadow-xs'
                      : isUnlocked
                      ? 'border-[#F0E3B5] dark:border-slate-700 bg-white dark:bg-slate-800'
                      : 'border-dashed border-[#F0E3B5]/60 dark:border-slate-800 opacity-50 bg-[#FFFDF5] dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lvl.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-[#10182B] dark:text-white">
                          Level {lvl.level}: {lvl.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#FFD600] text-[#10182B] font-bold px-2 py-0.5 rounded-full">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-[#58647D] dark:text-slate-300 mt-0.5">
                        {lvl.perk}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display font-bold text-xs text-[#10182B] dark:text-white">
                      {lvl.minXP} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#F0E3B5] dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={closeModal}
            className="btn-doodle btn-primary px-5 py-2 text-xs sm:text-sm"
          >
            Back to Studying (or Shopping) 🎒
          </button>
        </div>
      </div>
    </div>
  );
};
