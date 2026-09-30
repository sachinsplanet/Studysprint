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
        className="doodle-card bg-[#FFFDF5] dark:bg-[#131D31] max-w-md w-full p-6 sm:p-8 text-[#10182B] dark:text-slate-100 animate-in zoom-in-95 duration-200 text-center border-2 border-[#F0E3B5] dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#FFF0F5] dark:bg-[#2F1725] border-2 border-[#FFCCD9] dark:border-pink-900/50 mx-auto flex items-center justify-center text-3xl mb-4 shadow-xs">
          🧠
        </div>

        <h3 className="font-display font-bold text-2xl text-[#10182B] dark:text-white">
          Brain Battery Diagnostics
        </h3>
        <p className="font-body text-xs text-[#58647D] dark:text-slate-400 mt-1">
          *100% Fictional student cognitive estimate. Zero medical validity.
        </p>

        {/* Battery meter */}
        <div className="my-6 bg-white dark:bg-[#0B1120] p-4 rounded-2xl border-2 border-[#F0E3B5] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-sm text-[#10182B] dark:text-slate-200">
              Current Charge
            </span>
            <span className={`font-display font-bold text-xl ${batteryStatus.color}`}>
              {brainBattery}%
            </span>
          </div>

          <div className="w-full h-4 bg-[#FFF9DF] dark:bg-slate-900 rounded-full border border-[#F0E3B5] dark:border-slate-700 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                brainBattery >= 70
                  ? 'bg-[#00B887]'
                  : brainBattery >= 40
                  ? 'bg-[#FFD600]'
                  : 'bg-[#FF719A]'
              }`}
              style={{ width: `${brainBattery}%` }}
            />
          </div>

          <div className="mt-3 text-left bg-[#FFFDF5] dark:bg-slate-900/80 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#58647D] dark:text-slate-400 block">
              Estimated Study Longevity
            </span>
            <p className="font-display font-bold text-base text-[#10182B] dark:text-white">
              ~{remainingMins} minutes before subconscious phone scrolling
            </p>
          </div>
        </div>

        {/* Status & Recommendation */}
        <div className="text-left space-y-3 font-body text-xs bg-[#FFF4C7] dark:bg-[#1A263F] p-4 rounded-xl border-2 border-[#F0E3B5] dark:border-slate-700">
          <div>
            <b className="font-display text-sm text-[#10182B] dark:text-amber-200 block">
              Status: {batteryStatus.text}
            </b>
            <span className="text-[#58647D] dark:text-slate-300">{batteryStatus.subtext}</span>
          </div>

          <div className="pt-2 border-t border-[#F0E3B5] dark:border-slate-700">
            <b className="font-display text-xs text-[#10182B] dark:text-amber-300 block mb-1">
              Recommended Student Action:
            </b>
            <p className="text-[#10182B] dark:text-slate-200 italic font-medium leading-relaxed">
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
