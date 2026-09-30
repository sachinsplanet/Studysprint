import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useFun } from '../../lib/fun/funContext';
import { DegreeCertificate } from '../../lib/fun/types';

const DEGREES = [
  'Bachelor of Advanced Procrastination',
  'Master of Last-Minute Academic Miracles',
  'Doctor of High-End Stationery Hoarding',
  'Associate Degree in 3 AM Existential Calculation',
  'Bachelor of Applied Coffee Thermodynamics',
  'Executive Master in Opening 38 Browser Tabs',
  'Diploma in Color-Coding Spotify Instead of Syllabus',
  'Honorary Doctorate in Pretending To Understand Calculus'
];

const MAJORS = [
  'Avoiding Assignments with Extreme Precision',
  'Cramming 4-Month Semesters in 4.5 Hours',
  'Swatching Gel Pens on Forearms',
  'Nodding Knowingly in Online Lectures',
  'Staring Intensely at Page 14 Without Reading It',
  'Rewriting Lecture Titles in 6 Pastel Calligraphy Fonts'
];

const MINORS = [
  'Opening 17 Browser Tabs and Closing 0',
  'Midnight Maggi Engineering',
  'Converting 25m Pomodoro Breaks into 4-Day Holidays',
  'Sleeping with Open Textbooks for Osmotic Diffusion',
  'Panic Highlighting Entire Paragraphs with Neon Pink'
];

const SPECIALIZATIONS = [
  'Studying Exactly 4 Hours Before the Hall Gate Closes',
  'Defending Incomplete Lab Manuals with Poetic Grace',
  'Estimating Minimal Passing Marks to 3 Decimal Places',
  'Pretending "I Work Best Under Pressure"'
];

const HONORS = [
  'First Class with Panic Distinction',
  'Certified Academic Weapon (Subject to Verification)',
  'Hostel Corridor Legend',
  'Distinction in Midnight Cramming'
];

const CGPAS = ['6.9 / 10', '7.42 / 10', '9.01 (Alleged)', '4.0 / 4.0 (In Dreams)', '5.55 / 10 (Survival)'];

export const DegreeGeneratorModal: React.FC = () => {
  const { activeModal, closeModal, unlockAchievement, addXP, showFunToast } = useFun();
  const [degreeCount, setDegreeCount] = useState(0);

  const getRandomDegree = useCallback((): DegreeCertificate => {
    return {
      degree: DEGREES[Math.floor(Math.random() * DEGREES.length)],
      major: MAJORS[Math.floor(Math.random() * MAJORS.length)],
      minor: MINORS[Math.floor(Math.random() * MINORS.length)],
      specialization: SPECIALIZATIONS[Math.floor(Math.random() * SPECIALIZATIONS.length)],
      cgpa: CGPAS[Math.floor(Math.random() * CGPAS.length)],
      status: 'Technically Enrolled & Hoping for Mercy',
      honors: HONORS[Math.floor(Math.random() * HONORS.length)],
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, []);

  const [currentCert, setCurrentCert] = useState<DegreeCertificate>(getRandomDegree);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'degreeGenerator') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'degreeGenerator') return null;

  const handleRegenerate = () => {
    const next = getRandomDegree();
    setCurrentCert(next);
    setCopied(false);
    const newCount = degreeCount + 1;
    setDegreeCount(newCount);

    addXP(10, 'Issued new questionable academic diploma');

    if (newCount >= 3) {
      unlockAchievement('degree_master');
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleCopy = () => {
    const text = `🎓 MY OFFICIAL STUDYKIT DEGREE:\n\n${currentCert.degree}\n• Major: ${currentCert.major}\n• Minor: ${currentCert.minor}\n• Specialization: ${currentCert.specialization}\n• CGPA: ${currentCert.cgpa}\n• Status: ${currentCert.status}\n• Honors: ${currentCert.honors}\n\nConferred by StudySprint University 🏛️`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showFunToast({
      title: '📋 Degree Copied to Clipboard!',
      description: 'Ready to paste to confused family members or Discord.',
      emoji: '📜',
      type: 'alert'
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-[#FFFDF5] dark:bg-[#131D31] max-w-lg w-full p-6 sm:p-8 text-[#10182B] dark:text-slate-100 animate-in zoom-in-95 duration-200 border-2 border-[#F0E3B5] dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#F0E3B5] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h3 className="font-display font-bold text-xl text-[#10182B] dark:text-white">
              Fictional Degree Generator
            </h3>
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

        {/* Certificate Display */}
        <div className="my-5 p-6 rounded-2xl border-4 border-double border-[#F0E3B5] dark:border-amber-400/80 bg-[#FFF4C7]/60 dark:bg-[#121927] relative shadow-inner text-center">
          <div className="text-xs uppercase tracking-widest text-[#10182B] dark:text-amber-400 font-bold mb-1">
            StudySprint Institute of Questionable Education
          </div>
          <div className="text-[11px] text-[#58647D] dark:text-slate-400 italic mb-3">
            Conferred Under the Guise of Academic Ambition
          </div>

          <h4 className="font-display font-bold text-xl text-[#10182B] dark:text-white mb-4 underline decoration-[#FFD600] decoration-wavy underline-offset-4">
            {currentCert.degree}
          </h4>

          <div className="text-left space-y-2 font-body text-xs bg-white/90 dark:bg-[#0B0F19]/80 p-3.5 rounded-xl border border-[#F0E3B5] dark:border-slate-700">
            <p>
              <b className="font-display text-[#10182B] dark:text-amber-300">Major:</b>{' '}
              <span className="text-[#58647D] dark:text-slate-200">{currentCert.major}</span>
            </p>
            <p>
              <b className="font-display text-[#10182B] dark:text-amber-300">Minor:</b>{' '}
              <span className="text-[#58647D] dark:text-slate-200">{currentCert.minor}</span>
            </p>
            <p>
              <b className="font-display text-[#10182B] dark:text-amber-300">Specialization:</b>{' '}
              <span className="text-[#58647D] dark:text-slate-200">{currentCert.specialization}</span>
            </p>
            <div className="pt-2 border-t border-[#F0E3B5] dark:border-slate-700 flex justify-between items-center">
              <span>
                <b>CGPA:</b> <span className="font-display font-bold text-[#10182B] dark:text-amber-400">{currentCert.cgpa}</span>
              </span>
              <span className="text-[10px] bg-[#FFD600] text-[#10182B] px-2 py-0.5 rounded-full font-bold">
                {currentCert.honors}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] text-[#58647D] dark:text-slate-400 border-t border-[#F0E3B5] dark:border-slate-800 pt-2 font-hand text-sm">
            <span>Date: {currentCert.issuedAt}</span>
            <span>Dean of Procrastination: 🐾 Prof. Cat D.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={handleRegenerate}
            className="btn-doodle btn-primary px-4 py-2 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5"
          >
            <span>🎲 Generate Another Degree</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-doodle btn-ghost px-4 py-2 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5"
          >
            <span>{copied ? '✅ Copied!' : '📋 Copy Degree Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
