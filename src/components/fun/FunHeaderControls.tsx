import React from 'react';
import { useFun } from '../../lib/fun/funContext';
import { STUDENT_LEVELS } from '../../lib/fun/constants';

export const FunHeaderControls: React.FC = () => {
  const {
    funMode,
    toggleFunMode,
    soundEnabled,
    toggleSound,
    xp,
    level,
    brainBattery,
    batteryStatus,
    openModal,
    achievements,
    easterEggs
  } = useFun();

  // Find next level minXP
  const nextLevel = STUDENT_LEVELS.find((l) => l.level === level.level + 1);
  const currentLevelMin = level.minXP;
  const nextLevelMin = nextLevel ? nextLevel.minXP : level.minXP + 1000;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelMin);
  const xpNeededInCurrentLevel = Math.max(1, nextLevelMin - currentLevelMin);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededInCurrentLevel) * 100));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const discoveredEggsCount = easterEggs.filter((e) => e.discovered).length;

  return (
    <div className="w-full bg-[#FFF4C7] dark:bg-[#151D2C] border-b border-[#F0E3B5] dark:border-slate-800 text-[#10182B] dark:text-slate-200 text-xs py-1.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: XP Level & Brain Battery */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Level Pill */}
          <button
            type="button"
            onClick={() => openModal('achievements')}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0B0F19] px-2.5 py-1 rounded-full border border-[#F0E3B5] dark:border-slate-700 shadow-xs hover:border-[#FFD600] dark:hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer"
            title="Click to view Academic Achievements & Easter Eggs"
          >
            <span>{level.emoji}</span>
            <span className="font-display font-bold text-[#10182B] dark:text-amber-300">
              Lvl {level.level}: {level.title}
            </span>
            <span className="text-[10px] text-[#58647D] dark:text-slate-400">({xp} XP)</span>
            <div className="w-12 h-1.5 bg-[#FFF9DF] dark:bg-slate-700 rounded-full overflow-hidden ml-1 hidden sm:block border border-[#F0E3B5]/60">
              <div
                className="h-full bg-[#FFD600]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </button>

          {/* Brain Battery Widget */}
          <button
            type="button"
            onClick={() => openModal('brainBattery')}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0B0F19] px-2.5 py-1 rounded-full border border-[#F0E3B5] dark:border-slate-700 shadow-xs hover:border-[#FFD600] dark:hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer"
            title="Check Brain Battery Status"
          >
            <span>🧠</span>
            <span className={`font-display font-bold ${batteryStatus.color}`}>
              {brainBattery}%
            </span>
            <span className="hidden md:inline text-[11px] text-[#58647D] dark:text-slate-400">
              · {batteryStatus.text}
            </span>
          </button>

          {/* Quick Easter Egg & Trophy Counter */}
          <button
            type="button"
            onClick={() => openModal('achievements')}
            className="hidden lg:inline-flex items-center gap-2 bg-white/80 dark:bg-[#0B0F19]/70 px-2 py-0.5 rounded-full border border-dashed border-[#F0E3B5] dark:border-slate-700 hover:bg-white dark:hover:bg-[#0B0F19] transition-all cursor-pointer"
            title="Easter Eggs & Achievements unlocked"
          >
            <span>🏆 {unlockedCount}/{achievements.length}</span>
            <span>·</span>
            <span>🥚 {discoveredEggsCount}/10 Eggs</span>
          </button>
        </div>

        {/* Center / Right: Interactive Feature Launchers */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Degree Generator */}
          <button
            type="button"
            onClick={() => openModal('degreeGenerator')}
            className="px-2 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer font-display text-[11px] flex items-center gap-1"
            title="Generate a fictional university degree"
          >
            <span>🎓</span>
            <span className="hidden sm:inline">Degree Gen</span>
          </button>

          {/* Future Predictor */}
          <button
            type="button"
            onClick={() => openModal('futurePredictor')}
            className="px-2 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer font-display text-[11px] flex items-center gap-1"
            title="Predict your academic semester future"
          >
            <span>🔮</span>
            <span className="hidden sm:inline">Academic Oracle</span>
          </button>

          {/* Mini-Games */}
          <button
            type="button"
            onClick={() => openModal('catchBooksGame')}
            className="px-2 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer font-display text-[11px] flex items-center gap-1 text-[#FF719A] dark:text-pink-300 font-bold"
            title="Play 30s Study Mini-Game"
          >
            <span>🎮</span>
            <span>Mini-Games</span>
          </button>

          {/* Behavior Stats */}
          <button
            type="button"
            onClick={() => openModal('behaviorStats')}
            className="px-2 py-0.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer font-display text-[11px] flex items-center gap-1"
            title="View harmless fictional session analytics"
          >
            <span>📊</span>
            <span className="hidden md:inline">Student Stats</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-display font-medium transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#E9FFF5] dark:bg-emerald-950 text-[#00B887] dark:text-emerald-300 border-[#A7F3D0]'
                : 'bg-white dark:bg-slate-800 text-[#7B8498] border-[#F0E3B5] dark:border-slate-700'
            }`}
            title="Toggle synthesized tactile UI audio"
          >
            {soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
          </button>

          {/* Fun Mode Toggle */}
          <button
            type="button"
            onClick={toggleFunMode}
            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-display font-bold transition-all cursor-pointer ${
              funMode
                ? 'bg-[#FFD600] text-[#10182B] border-[#FFC928]'
                : 'bg-white dark:bg-slate-800 text-[#7B8498] border-[#F0E3B5] dark:border-slate-700'
            }`}
            title="Toggle playful student Easter eggs and secret layer"
          >
            {funMode ? '🎭 Fun Mode: ON' : '💼 Normal Mode'}
          </button>

          {/* Secret Diagnostics shortcut for mobile */}
          <button
            type="button"
            onClick={() => openModal('devDiagnostics')}
            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            title="Developer Diagnostics (Ctrl+Shift+S)"
            aria-label="Developer diagnostics"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};
