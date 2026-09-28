import React, { useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';

export const BrainBatteryModal: React.FC = () => {
  const { activeModal, closeModal, brainBattery, batteryStatus, rechargeBattery } = useFun();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'brainBattery') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'brainBattery') return null;

  // Estimated remaining study time calculation
  const remainingMins = Math.max(2, Math.round((brainBattery / 100) * 85));

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-white dark:bg-[#162032] max-w-md w-full p-6 sm:p-8 text-[#1E2A4A] dark:text-slate-100 animate-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#FFF2C6] dark:bg-[#2A2312] border-3 border-[#1E2A4A] dark:border-amber-400 mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
          🧠
        </div>

        <h3 className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">
          Brain Battery Diagnostics
        </h3>
        <p className="font-body text-xs text-[#1E2A4A]/60 dark:text-slate-400 mt-1">
          *100% Fictional student cognitive estimate. Zero medical validity.
        </p>

        {/* Battery meter */}
        <div className="my-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#1E2A4A] dark:border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-sm text-[#1E2A4A] dark:text-slate-200">
              Current Charge
            </span>
            <span className={`font-display font-bold text-xl ${batteryStatus.color}`}>
              {brainBattery}%
            </span>
          </div>

          <div className="w-full h-4 bg-white dark:bg-slate-900 rounded-full border-2 border-[#1E2A4A] dark:border-slate-500 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                brainBattery >= 70
                  ? 'bg-emerald-500'
                  : brainBattery >= 40
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${brainBattery}%` }}
            />
          </div>

          <div className="mt-3 text-left bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Estimated Study Longevity
            </span>
            <p className="font-display font-bold text-base text-[#1E2A4A] dark:text-white">
              ~{remainingMins} minutes before subconscious phone scrolling
            </p>
          </div>
        </div>

        {/* Status & Recommendation */}
        <div className="text-left space-y-3 font-body text-xs bg-amber-50 dark:bg-[#201A10] p-4 rounded-xl border-2 border-amber-300 dark:border-amber-700/60">
          <div>
            <b className="font-display text-sm text-[#1E2A4A] dark:text-amber-200 block">
              Status: {batteryStatus.text}
            </b>
            <span className="text-[#1E2A4A]/80 dark:text-slate-300">{batteryStatus.subtext}</span>
          </div>

          <div className="pt-2 border-t border-amber-200 dark:border-amber-900/50">
            <b className="font-display text-xs text-amber-900 dark:text-amber-300 block mb-1">
              Recommended Student Action:
            </b>
            <p className="text-[#1E2A4A] dark:text-slate-200 italic font-medium leading-relaxed">
              &quot;{batteryStatus.advice}&quot;
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={rechargeBattery}
            className="btn-doodle btn-green px-4 py-2 text-xs sm:text-sm"
          >
            ☕ Sip Digital Coffee (+25%)
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="btn-doodle btn-ghost px-4 py-2 text-xs sm:text-sm"
          >
            Understood, will pretend to study 📚
          </button>
        </div>
      </div>
    </div>
  );
};
