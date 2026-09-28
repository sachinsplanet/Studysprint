import React, { useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';

export const ProductLabModal: React.FC = () => {
  const { activeModal, closeModal, modalPayload, unlockAchievement, addXP } = useFun();
  const product = modalPayload?.product;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'labModal') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  useEffect(() => {
    if (activeModal === 'labModal' && product) {
      unlockAchievement('lab_scientist');
      addXP(10, 'Executed stationery laboratory RPG breakdown');
    }
  }, [activeModal, product, unlockAchievement, addXP]);

  if (activeModal !== 'labModal' || !product) return null;

  // RPG stats derived deterministically from price & id
  const academicPower = 70 + (product.price % 28);
  const procrastinationResistance = 12 + (product.name.length % 15);
  const organizationBoost = 20 + (product.items.length * 6);
  const examSurvivalRate = 18 + (product.price % 14);
  const confidenceInflation = 45 + (product.price % 35);

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
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#1E2A4A]/10 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">
                StudyKit Lab Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Item: <b>{product.name}</b> {product.emoji}
              </p>
            </div>
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

        {/* RPG Stat Sheet */}
        <div className="my-5 space-y-2.5 font-body text-xs">
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="font-display font-bold text-sm">⚔️ Academic Power:</span>
            <span className="font-display font-bold text-sm text-purple-600 dark:text-purple-400">
              {academicPower} / 100
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span>🛡️ Procrastination Resistance:</span>
            <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">
              +{procrastinationResistance}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span>📐 Organization Affinity:</span>
            <span className="font-display font-bold text-blue-600 dark:text-blue-400">
              +{organizationBoost}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span>💧 2 AM Tear Resistance:</span>
            <span className="font-display font-bold text-teal-600 dark:text-teal-400">
              +{examSurvivalRate}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span>📈 Confidence Inflation:</span>
            <span className="font-display font-bold text-amber-600 dark:text-amber-400">
              +{confidenceInflation}%
            </span>
          </div>

          <div className="mt-3 p-3 bg-amber-50 dark:bg-[#201A10] rounded-xl border border-amber-300 dark:border-amber-800 text-center">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              FINAL LAB VERDICT
            </span>
            <span className="font-display font-bold text-base text-[#1E2A4A] dark:text-white">
              RECOMMENDED FOR DESPERATE SCHOLARS
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="btn-doodle btn-primary w-full py-2 text-xs sm:text-sm"
        >
          Equip This Stationery In Real Life 🎒
        </button>
      </div>
    </div>
  );
};
