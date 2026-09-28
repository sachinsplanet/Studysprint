import React, { useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';

export const BehaviorAnalysisModal: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const { activeModal, closeModal, sessionDuration, inspectedProductsCount } = useFun();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'behaviorStats') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'behaviorStats') return null;

  const mins = Math.floor(sessionDuration / 60);
  const secs = sessionDuration % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Emotional consideration count: inspections + cart
  const emotionallyConsidered = Math.max(inspectedProductsCount, cartCount + 2);

  // Playful metrics calculated dynamically
  const procrastinationLevel = Math.min(99, Math.max(78, 85 + (mins % 12)));
  const motivationLevel = Math.max(12, Math.min(65, 45 - mins * 2 + cartCount * 10));
  const confidenceLevel = Math.min(95, Math.max(25, 30 + cartCount * 15));

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-white dark:bg-[#162032] max-w-md w-full p-6 sm:p-8 text-[#1E2A4A] dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E2A4A]/10 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">
              Student Behavior Analysis
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-7 h-7 rounded-full border-2 border-[#1E2A4A] dark:border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-2 font-body italic">
          *Real-time session diagnostics compiled from your current visit. Zero creepy telemetry. Pure comedy.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-[#1E2A4A]/20 dark:border-slate-700">
            <span className="text-[11px] opacity-70 block font-display">Browsing Duration</span>
            <span className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">
              {timeFormatted}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-[#1E2A4A]/20 dark:border-slate-700">
            <span className="text-[11px] opacity-70 block font-display">Kits Inspected</span>
            <span className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">
              {inspectedProductsCount}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-[#1E2A4A]/20 dark:border-slate-700">
            <span className="text-[11px] opacity-70 block font-display">Emotionally Considered</span>
            <span className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">
              {emotionallyConsidered}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-[#1E2A4A]/20 dark:border-slate-700">
            <span className="text-[11px] opacity-70 block font-display">Added to Cart</span>
            <span className="font-display font-bold text-xl text-[#FFC93C] dark:text-amber-300">
              {cartCount}
            </span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3 font-body text-xs my-4 bg-[#FFFDF7] dark:bg-[#0B0F19] p-4 rounded-xl border-2 border-[#1E2A4A]/20 dark:border-slate-700">
          <div>
            <div className="flex justify-between mb-1 font-display font-bold">
              <span>Motivation</span>
              <span className="text-amber-600 dark:text-amber-400">{motivationLevel}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${motivationLevel}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-display font-bold">
              <span>Procrastination Coefficient</span>
              <span className="text-rose-500">{procrastinationLevel}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${procrastinationLevel}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-display font-bold">
              <span>Academic Confidence (Inflated)</span>
              <span className="text-emerald-600 dark:text-emerald-400">{confidenceLevel}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${confidenceLevel}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">Scientific Validity:</span>
            <span className="font-display font-bold text-rose-500">0.0% (Certified Placebo)</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={closeModal}
            className="btn-doodle btn-primary w-full py-2 text-xs sm:text-sm"
          >
            I Acknowledge My Flaws, Keep Shopping 🛒
          </button>
        </div>
      </div>
    </div>
  );
};
