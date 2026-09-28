import React, { useEffect } from 'react';
import { useFun } from '../../lib/fun/funContext';

export const DevDiagnosticsModal: React.FC = () => {
  const { activeModal, closeModal } = useFun();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal === 'devDiagnostics') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'devDiagnostics') return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-[#0F172A] border-2 border-emerald-400 max-w-md w-full p-6 text-emerald-400 font-mono text-xs shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-2 border-b border-emerald-500/40">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🟢</span>
            <span className="font-bold tracking-wider uppercase text-white">
              STUDYKIT SYSTEM DIAGNOSTICS v4.2
            </span>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="text-emerald-400 hover:text-white px-2 py-0.5 border border-emerald-500 rounded text-xs cursor-pointer"
          >
            [X]
          </button>
        </div>

        <div className="my-4 space-y-2.5 bg-black/60 p-4 rounded border border-emerald-500/30">
          <div className="flex justify-between">
            <span>CPU (Human Brain Engine):</span>
            <span className="text-white">12% [IDLE]</span>
          </div>
          <div className="flex justify-between">
            <span>RAM (Short-Term Memory):</span>
            <span className="text-white">67% [SWAPPING]</span>
          </div>
          <div className="flex justify-between">
            <span>Motivation Module:</span>
            <span className="text-rose-400 font-bold">4.0% [SUB-CRITICAL]</span>
          </div>
          <div className="flex justify-between">
            <span>Assignments in Queue:</span>
            <span className="text-amber-400 font-bold">7 pending</span>
          </div>
          <div className="flex justify-between">
            <span>Circadian Rhythm / Sleep:</span>
            <span className="text-rose-500 font-bold underline">ERROR_404_NOT_FOUND</span>
          </div>
          <div className="flex justify-between">
            <span>YouTube Study Music Tabs:</span>
            <span className="text-white">14 background threads</span>
          </div>
          <div className="flex justify-between border-t border-emerald-500/30 pt-2">
            <span>Academic Stability Status:</span>
            <span className="text-rose-400 font-bold animate-pulse">CRITICAL CONDITION</span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-300/80 mb-4 italic">
          &gt; WARNING: No actual system kernel was harmed. You unlocked the secret developer console via Ctrl+Shift+S.
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider rounded border border-emerald-300 transition-colors cursor-pointer"
        >
          [EXIT DIAGNOSTICS & RESUME SHOPPING]
        </button>
      </div>
    </div>
  );
};
