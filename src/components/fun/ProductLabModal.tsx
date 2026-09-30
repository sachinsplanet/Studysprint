import React, { useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';
import { ProductImage } from '../ProductImage';

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
        className="doodle-card bg-[#FFFDF5] dark:bg-[#131D31] max-w-md w-full p-6 sm:p-8 text-[#10182B] dark:text-slate-100 animate-in zoom-in-95 duration-200 border-2 border-[#F0E3B5] dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#F0E3B5] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <div>
              <h3 className="font-display font-bold text-lg text-[#10182B] dark:text-white">
                StudyKit Lab Analysis
              </h3>
              <p className="text-xs text-[#58647D] dark:text-slate-400">
                Item: <b>{product.name}</b> {product.emoji}
              </p>
            </div>
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

        {/* Product Photograph Preview */}
        <div className="mt-4 mb-3 rounded-xl overflow-hidden border border-[#F0E3B5] dark:border-slate-750">
          <ProductImage
            src={product.image}
            alt={product.imageAlt || product.name}
            fallbackEmoji={product.emoji}
            aspectRatio="wide"
            sourcePage={product.sourcePage}
            sourceLabel={product.imageSource}
            showBadge={true}
          />
        </div>

        {/* RPG Stat Sheet */}
        <div className="my-5 space-y-2.5 font-body text-xs">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-800 flex justify-between items-center">
            <span className="font-display font-bold text-sm text-[#10182B] dark:text-slate-200">⚔️ Academic Power:</span>
            <span className="font-display font-bold text-sm text-[#FF719A]">
              {academicPower} / 100
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-800 flex justify-between items-center">
            <span className="text-[#10182B] dark:text-slate-200 font-semibold">🛡️ Procrastination Resistance:</span>
            <span className="font-display font-bold text-[#00B887]">
              +{procrastinationResistance}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-800 flex justify-between items-center">
            <span className="text-[#10182B] dark:text-slate-200 font-semibold">📐 Organization Affinity:</span>
            <span className="font-display font-bold text-[#10182B] dark:text-yellow-400">
              +{organizationBoost}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-800 flex justify-between items-center">
            <span className="text-[#10182B] dark:text-slate-200 font-semibold">💧 2 AM Tear Resistance:</span>
            <span className="font-display font-bold text-[#00B887]">
              +{examSurvivalRate}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#F0E3B5] dark:border-slate-800 flex justify-between items-center">
            <span className="text-[#10182B] dark:text-slate-200 font-semibold">📈 Confidence Inflation:</span>
            <span className="font-display font-bold text-[#FF719A]">
              +{confidenceInflation}%
            </span>
          </div>

          <div className="mt-3 p-3 bg-[#FFF4C7] dark:bg-[#1A263F] rounded-xl border border-[#F0E3B5] dark:border-slate-700 text-center">
            <span className="text-[11px] font-bold text-[#58647D] dark:text-amber-300 uppercase tracking-wider block">
              FINAL LAB VERDICT
            </span>
            <span className="font-display font-bold text-base text-[#10182B] dark:text-white">
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
