import React from 'react';
import { useFun } from '../../lib/fun/funContext';

export const FunToastContainer: React.FC = () => {
  const { funToasts, removeToast } = useFun();

  if (funToasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {funToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1E2A4A]/95 dark:bg-slate-900/95 backdrop-blur-md text-white border border-[#FFC93C]/40 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
          role="status"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.emoji && <span className="text-lg shrink-0">{toast.emoji}</span>}
            <p className="font-body text-xs sm:text-sm font-medium text-slate-100 line-clamp-2">
              {toast.description || toast.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white text-sm font-bold shrink-0 p-1 cursor-pointer transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
