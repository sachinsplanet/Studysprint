import React, { useState, useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';
import { AcademicPrediction } from '../../lib/fun/types';

const SCAN_STEPS = [
  'Consulting suspiciously old scientific calculator...',
  'Analyzing late-night study habit telemetry...',
  'Calculating procrastination coefficient across semesters...',
  'Reviewing unread syllabus PDFs...',
  'Evaluating 100 GSM paper tear resistance against exam panic...',
  'Formulating definitive academic trajectory...'
];

const PREDICTIONS: AcademicPrediction[] = [
  {
    buyNotebooks: 5,
    useNotebooks: 1,
    researchHours: 42,
    daysBeforeExam: 3,
    confidence: 96.4,
    quote: 'You will color-code the first 4 pages with angelic perfection before abandoning the notebook for the rest of the year.'
  },
  {
    buyNotebooks: 8,
    useNotebooks: 2,
    researchHours: 65,
    daysBeforeExam: 1,
    confidence: 98.2,
    quote: 'At 2:45 AM before your exam, you will suddenly understand the entire theory of the universe, but forget formula #4.'
  },
  {
    buyNotebooks: 3,
    useNotebooks: 1,
    researchHours: 29,
    daysBeforeExam: 2,
    confidence: 91.8,
    quote: 'You will spend 6 hours looking for the perfect Spotify Lo-Fi playlist and 12 minutes actually solving practice problems.'
  },
  {
    buyNotebooks: 6,
    useNotebooks: 3,
    researchHours: 50,
    daysBeforeExam: 4,
    confidence: 94.5,
    quote: 'Your mom will see your tidy new StudySprint desk setup, assume you are getting an A+, and prepare sweet almond milk.'
  }
];

export const FuturePredictorModal: React.FC = () => {
  const { activeModal, closeModal, unlockAchievement, addXP } = useFun();
  const [scanning, setScanning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [prediction, setPrediction] = useState<AcademicPrediction>(PREDICTIONS[0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'futurePredictor') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  useEffect(() => {
    if (activeModal === 'futurePredictor') {
      startPrediction();
    }
  }, [activeModal]);

  const startPrediction = () => {
    setScanning(true);
    setStepIdx(0);
    const chosen = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
    setPrediction(chosen);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= SCAN_STEPS.length) {
        clearInterval(interval);
        setScanning(false);
        addXP(15, 'Consulted Academic Future Oracle');
        unlockAchievement('oracle_believer');
      } else {
        setStepIdx(current);
      }
    }, 450);
  };

  if (activeModal !== 'futurePredictor') return null;

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
        <div className="w-14 h-14 rounded-full bg-[#FFF4C7] dark:bg-[#281A38] border-2 border-[#F0E3B5] dark:border-purple-400 mx-auto flex items-center justify-center text-3xl mb-3">
          🔮
        </div>

        <h3 className="font-display font-bold text-2xl text-[#10182B] dark:text-white">
          Academic Future Oracle
        </h3>
        <p className="font-body text-xs text-[#58647D] dark:text-slate-400 mt-1">
          Peer into your semester destiny powered by doubtful stationery statistics.
        </p>

        {scanning ? (
          <div className="my-8 py-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[#F0E3B5] dark:border-slate-700">
            <div className="inline-block animate-spin text-3xl mb-3">🌀</div>
            <p className="font-display font-semibold text-sm text-[#10182B] dark:text-amber-300 px-4 min-h-[40px] flex items-center justify-center">
              {SCAN_STEPS[stepIdx]}
            </p>
            <div className="w-48 h-2 bg-[#FFF9DF] dark:bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden border border-[#F0E3B5]/60">
              <div
                className="h-full bg-[#FFD600] transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="my-6 text-left space-y-3 font-body text-xs">
            <div className="bg-[#FFF4C7] dark:bg-[#272115] p-4 rounded-xl border-2 border-[#F0E3B5] dark:border-amber-700 space-y-2">
              <div className="flex justify-between items-center text-sm font-display font-bold text-[#10182B] dark:text-amber-200 border-b border-[#F0E3B5] dark:border-amber-900/60 pb-2">
                <span>YOUR UPCOMING SEMESTER:</span>
                <span className="text-xs bg-[#FFD600] text-[#10182B] font-semibold px-2 py-0.5 rounded-full">
                  {prediction.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[#10182B] dark:text-slate-200">
                <p>
                  <b>Notebooks Purchased:</b> <span className="font-display text-sm">{prediction.buyNotebooks}</span>
                </p>
                <p>
                  <b>Notebooks Actually Used:</b> <span className="font-display text-sm text-[#FF719A]">{prediction.useNotebooks}</span>
                </p>
                <p>
                  <b>Productivity Researched:</b> <span className="font-display text-sm">{prediction.researchHours} hrs</span>
                </p>
                <p>
                  <b>Serious Studying Begins:</b> <span className="font-display text-sm text-[#FFD600] font-bold">{prediction.daysBeforeExam} days prior</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0E3B5] dark:border-amber-900/60 italic text-[#58647D] dark:text-slate-200">
                &quot;{prediction.quote}&quot;
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#58647D] px-1">
              <span>Scientific Validity: <b>Questionable</b></span>
              <span>Prophecy Level: <b>Accurate</b></span>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-center mt-6">
          <button
            type="button"
            onClick={startPrediction}
            disabled={scanning}
            className="btn-doodle btn-primary px-4 py-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            🔄 Divine Another Prediction
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="btn-doodle btn-ghost px-4 py-2 text-xs sm:text-sm cursor-pointer"
          >
            Accept Fate
          </button>
        </div>
      </div>
    </div>
  );
};
