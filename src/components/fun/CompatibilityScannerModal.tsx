import React, { useState, useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';

const SCAN_LINES = [
  'Student biometric status detected...',
  'Checking semester distress signals...',
  'Evaluating notebook requirement necessity...',
  'Pen ownership level: uncertain...',
  'Motivation level: questionable...',
  'Exam proximity: alarming...',
  'Stationery dependency: critical...'
];

export const CompatibilityScannerModal: React.FC = () => {
  const { activeModal, closeModal, modalPayload, addXP } = useFun();
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const product = modalPayload?.product;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'compatibilityModal') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  useEffect(() => {
    if (activeModal === 'compatibilityModal') {
      setStepIdx(0);
      setDone(false);
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        if (current >= SCAN_LINES.length) {
          clearInterval(interval);
          setDone(true);
          addXP(10, 'Analyzed product academic compatibility');
        } else {
          setStepIdx(current);
        }
      }, 350);
      return () => clearInterval(interval);
    }
  }, [activeModal, addXP]);

  const handleSkip = () => {
    setDone(true);
  };

  if (activeModal !== 'compatibilityModal' || !product) return null;

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
        <div className="w-14 h-14 rounded-full bg-[#D8F3DC] dark:bg-[#143021] border-3 border-[#1E2A4A] dark:border-emerald-400 mx-auto flex items-center justify-center text-3xl mb-3">
          🔍
        </div>

        <h3 className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">
          Academic Compatibility Scanner
        </h3>
        <p className="font-body text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-1">
          Evaluating synergy with <b>{product.name}</b> {product.emoji}
        </p>

        {!done ? (
          <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left font-mono text-xs space-y-1.5 min-h-[140px]">
            {SCAN_LINES.slice(0, stepIdx + 1).map((line, i) => (
              <div key={i} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span>✓</span>
                <span className="text-[#1E2A4A] dark:text-slate-200">{line}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-6 space-y-3 font-body text-left">
            <div className="bg-[#D8F3DC] dark:bg-[#183624] p-4 rounded-xl border-2 border-emerald-500 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 block">
                COMPATIBILITY SCORE
              </span>
              <span className="font-display font-black text-4xl text-emerald-700 dark:text-emerald-300 my-1 block">
                98.7%
              </span>
              <p className="text-xs font-semibold text-[#1E2A4A] dark:text-slate-100 italic">
                &quot;This kit is dangerously compatible with your academic situation and current state of denial.&quot;
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <p>• <b>Placebo Factor:</b> +45% Instant confidence boost</p>
              <p>• <b>Tear Absorbency:</b> High (Guaranteed 100 GSM)</p>
              <p>• <b>Parental Approval:</b> Guaranteed smile upon unboxing</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {!done ? (
            <button
              type="button"
              onClick={handleSkip}
              className="btn-doodle btn-ghost px-4 py-2 text-xs"
            >
              Skip Scan ⏩
            </button>
          ) : (
            <button
              type="button"
              onClick={closeModal}
              className="btn-doodle btn-primary px-5 py-2 text-xs sm:text-sm"
            >
              Add to Study Setup! 🛍️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
