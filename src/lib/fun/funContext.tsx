import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Achievement, EasterEgg, StudentLevel } from './types';
import {
  STUDENT_LEVELS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_EASTER_EGGS
} from './constants';
import { getSafeStorage, setSafeStorage, STORAGE_KEYS } from './storage';
import { soundEngine } from './sound';

export interface FunToast {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: 'xp' | 'achievement' | 'egg' | 'alert' | 'secret';
}

export interface FunContextType {
  funMode: boolean;
  setFunMode: (val: boolean) => void;
  toggleFunMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // XP & Levels
  xp: number;
  level: StudentLevel;
  addXP: (amount: number, reason: string) => void;

  // Achievements & Easter eggs
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  easterEggs: EasterEgg[];
  discoverEasterEgg: (id: string) => void;

  // Brain Battery
  brainBattery: number;
  batteryStatus: { text: string; subtext: string; color: string; advice: string };
  rechargeBattery: () => void;

  // Behavior stats
  sessionDuration: number;
  inspectedProductsCount: number;
  recordProductInspection: (id: string) => void;
  recordClick: (targetName: string) => void;

  // Modals
  activeModal: string | null;
  modalPayload: any;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;

  // Toasts
  funToasts: FunToast[];
  removeToast: (id: string) => void;
  showFunToast: (toast: Omit<FunToast, 'id'>) => void;

  // Do Not Click count
  forbiddenClickCount: number;
  incrementForbiddenClick: () => number;
}

const FunContext = createContext<FunContextType | null>(null);

export const FunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fun Mode (default true)
  const [funMode, setFunModeState] = useState<boolean>(() => {
    return getSafeStorage<boolean>(STORAGE_KEYS.FUN_MODE, true);
  });

  const setFunMode = useCallback((val: boolean) => {
    setFunModeState(val);
    setSafeStorage(STORAGE_KEYS.FUN_MODE, val);
  }, []);

  const toggleFunMode = useCallback(() => {
    setFunMode(!funMode);
  }, [funMode, setFunMode]);

  // Sound (default false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEngine.isEnabled());
  const toggleSound = useCallback(() => {
    const next = !soundEngine.isEnabled();
    soundEngine.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundEngine.playPop();
  }, []);

  // XP State
  const [xp, setXP] = useState<number>(() => {
    return getSafeStorage<number>(STORAGE_KEYS.XP, 1028);
  });

  // Calculate Level
  const level = useMemo(() => {
    let current = STUDENT_LEVELS[0];
    for (const lvl of STUDENT_LEVELS) {
      if (xp >= lvl.minXP) {
        current = lvl;
      }
    }
    return current;
  }, [xp]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = getSafeStorage<Achievement[] | null>(STORAGE_KEYS.ACHIEVEMENTS, null);
    if (!saved) return INITIAL_ACHIEVEMENTS;
    // merge with any new definitions
    return INITIAL_ACHIEVEMENTS.map((item) => {
      const existing = saved.find((s) => s.id === item.id);
      return existing ? { ...item, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : item;
    });
  });

  // Easter Eggs
  const [easterEggs, setEasterEggs] = useState<EasterEgg[]>(() => {
    const saved = getSafeStorage<EasterEgg[] | null>(STORAGE_KEYS.EASTER_EGGS, null);
    if (!saved) return INITIAL_EASTER_EGGS;
    return INITIAL_EASTER_EGGS.map((item) => {
      const existing = saved.find((s) => s.id === item.id);
      return existing ? { ...item, discovered: existing.discovered, discoveredAt: existing.discoveredAt } : item;
    });
  });

  // Brain Battery (fluctuates randomly around 18% - 42% on start, persists)
  const [brainBattery, setBrainBattery] = useState<number>(() => {
    return getSafeStorage<number>(STORAGE_KEYS.BRAIN_BATTERY, 24);
  });

  // Forbidden Click count
  const [forbiddenClickCount, setForbiddenClickCount] = useState<number>(() => {
    return getSafeStorage<number>(STORAGE_KEYS.DO_NOT_CLICK, 0);
  });

  // Toasts
  const [funToasts, setFunToasts] = useState<FunToast[]>([]);

  const showFunToast = useCallback((toast: Omit<FunToast, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setFunToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => {
      setFunToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setFunToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add XP
  const addXP = useCallback((amount: number, _reason?: string) => {
    setXP((prev) => {
      const next = prev + amount;
      setSafeStorage(STORAGE_KEYS.XP, next);
      return next;
    });
  }, []);

  // Unlock Achievement
  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target || target.unlocked) return prev;

      const next = prev.map((a) => (a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a));
      setSafeStorage(STORAGE_KEYS.ACHIEVEMENTS, next);

      // Defer side-effects outside React state transition
      setTimeout(() => {
        soundEngine.playSuccess();
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 }
        });

        showFunToast({
          title: `🏆 Achievement Unlocked!`,
          description: target.title + ' — ' + target.description,
          emoji: target.emoji,
          type: 'achievement'
        });

        // Bonus XP
        setXP((old) => {
          const nextXP = old + 50;
          setSafeStorage(STORAGE_KEYS.XP, nextXP);
          return nextXP;
        });
      }, 0);

      return next;
    });
  }, [showFunToast]);

  // Check level 6 achievement
  useEffect(() => {
    if (level.level >= 6) {
      const isUnlocked = achievements.some((a) => a.id === 'academic_weapon' && a.unlocked);
      if (!isUnlocked) {
        const timer = setTimeout(() => {
          unlockAchievement('academic_weapon');
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [level.level, achievements, unlockAchievement]);

  // Discover Easter Egg
  const discoverEasterEgg = useCallback((id: string) => {
    setEasterEggs((prev) => {
      const target = prev.find((e) => e.id === id);
      if (!target || target.discovered) return prev;

      const next = prev.map((e) => (e.id === id ? { ...e, discovered: true, discoveredAt: Date.now() } : e));
      setSafeStorage(STORAGE_KEYS.EASTER_EGGS, next);

      // Defer side-effects outside React state transition
      setTimeout(() => {
        soundEngine.playEasterEgg();
        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#FFC93C', '#FFD6E0', '#D8F3DC', '#CDE7FF']
        });

        showFunToast({
          title: `🥚 Secret Easter Egg Discovered!`,
          description: `${target.name} (+100 Academic XP)`,
          emoji: '✨',
          type: 'egg'
        });

        // First egg achievement
        unlockAchievement('first_egg');

        // Check if 5 discovered
        const discoveredCount = next.filter((e) => e.discovered).length;
        if (discoveredCount >= 5) {
          unlockAchievement('web_detective');
        }

        setXP((old) => {
          const nextXP = old + 100;
          setSafeStorage(STORAGE_KEYS.XP, nextXP);
          return nextXP;
        });
      }, 0);

      return next;
    });
  }, [showFunToast, unlockAchievement]);

  // Battery status logic
  const batteryStatus = useMemo(() => {
    if (brainBattery >= 90) {
      return {
        text: 'Academic Weapon',
        subtext: 'Unchecked caffeine synergy and exam domination.',
        color: 'text-emerald-500',
        advice: 'Take over the lecture hall and correct the professor.'
      };
    }
    if (brainBattery >= 70) {
      return {
        text: 'Suspiciously Productive',
        subtext: 'High focus detected. Almost certainly an accident.',
        color: 'text-teal-500',
        advice: 'Ride this wave before TikTok catches you.'
      };
    }
    if (brainBattery >= 40) {
      return {
        text: 'Functional Student',
        subtext: 'Operating at baseline cognitive capacity.',
        color: 'text-amber-500',
        advice: 'Drink water. Open your notes. Stop pretending you will study later.'
      };
    }
    if (brainBattery >= 15) {
      return {
        text: 'Running on Caffeine & Hopes',
        subtext: '3 AM study sprint vibes. Critical cognitive jitter.',
        color: 'text-orange-500',
        advice: 'Consume hydration immediately. Breathe. Review formula 14.'
      };
    }
    return {
      text: 'Critical Academic Condition',
      subtext: 'Please restart student.exe.',
      color: 'text-rose-500',
      advice: 'Lie down on the floor or apply emergency gel pen swatches to forearm.'
    };
  }, [brainBattery]);

  const rechargeBattery = useCallback(() => {
    setBrainBattery((prev) => {
      const next = Math.min(100, prev + 25);
      setSafeStorage(STORAGE_KEYS.BRAIN_BATTERY, next);
      return next;
    });
    soundEngine.playPop();
    showFunToast({
      title: '🔋 Brain Battery Recharged!',
      description: '+25% Cognitive fuel restored.',
      emoji: '🧠',
      type: 'alert'
    });
  }, [showFunToast]);

  // Session Duration tracking
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Product Inspection tracking
  const [inspectedProductIds, setInspectedProductIds] = useState<Set<string>>(new Set());
  const recordProductInspection = useCallback((id: string) => {
    setInspectedProductIds((prev) => {
      if (!prev.has(id)) {
        const next = new Set(prev);
        next.add(id);
        return next;
      }
      return prev;
    });
  }, []);

  // Click tracking
  const [clickCounts, setClickCounts] = useState<{ [key: string]: { count: number; lastTime: number } }>({});
  const recordClick = useCallback((targetName: string) => {
    const now = Date.now();
    setClickCounts((prev) => {
      const current = prev[targetName] || { count: 0, lastTime: now };
      const isQuick = now - current.lastTime < 2500;
      const count = isQuick ? current.count + 1 : 1;

      if (count === 7) {
        setTimeout(() => {
          unlockAchievement('suspicious_visitor');
        }, 0);
      }

      return {
        ...prev,
        [targetName]: { count, lastTime: now }
      };
    });
  }, [unlockAchievement]);

  // Forbidden Click Widget
  const incrementForbiddenClick = useCallback(() => {
    soundEngine.playBoing();
    const next = forbiddenClickCount + 1;
    setForbiddenClickCount(next);
    setSafeStorage(STORAGE_KEYS.DO_NOT_CLICK, next);

    if (next >= 2) {
      unlockAchievement('forbidden_clicker');
    }
    if (next >= 10) {
      discoverEasterEgg('forbidden_button_10');
    }
    return next;
  }, [forbiddenClickCount, unlockAchievement, discoverEasterEgg]);

  // Modals management
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  const openModal = useCallback((modalName: string, payload?: any) => {
    setActiveModal(modalName);
    setModalPayload(payload || null);
    soundEngine.playPop();

    if (modalName === 'brainBattery') {
      unlockAchievement('battery_checker');
    }
  }, [unlockAchievement]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  // Secret Commands typing listener
  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if inside an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Check Developer shortcut: Ctrl + Shift + S or Cmd + Shift + S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        openModal('devDiagnostics');
        discoverEasterEgg('dev_diagnostics');
        unlockAchievement('hacker_mode');
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        buffer += e.key.toLowerCase();
        if (buffer.length > 20) {
          buffer = buffer.slice(-20);
        }

        if (buffer.endsWith('study')) {
          discoverEasterEgg('secret_command_study');
          showFunToast({
            title: '📚 STUDY MODE ACTIVATED',
            description: "Just kidding. You're still on an e-commerce website.",
            emoji: '📖',
            type: 'secret'
          });
          buffer = '';
        } else if (buffer.endsWith('exam')) {
          discoverEasterEgg('secret_command_exam');
          showFunToast({
            title: '🚨 EXAM DETECTED',
            description: 'Preparation level: Insufficient. Recommended response: Panic responsibly.',
            emoji: '⚠️',
            type: 'secret'
          });
          buffer = '';
        } else if (buffer.endsWith('coffee')) {
          discoverEasterEgg('secret_command_coffee');
          showFunToast({
            title: '☕ COFFEE PROTOCOL 9',
            description: 'Digital caffeine injected! Heart rate elevated by 0.0001 bpm.',
            emoji: '☕',
            type: 'secret'
          });
          rechargeBattery();
          buffer = '';
        } else if (buffer.endsWith('admin')) {
          discoverEasterEgg('secret_command_admin');
          showFunToast({
            title: '🛡️ ACCESS DENIED',
            description: 'Nice try, hacker. All passwords are saved on real sticky notes.',
            emoji: '🔐',
            type: 'secret'
          });
          buffer = '';
        } else if (buffer.endsWith('debug')) {
          openModal('devDiagnostics');
          buffer = '';
        } else if (buffer.endsWith('help')) {
          showFunToast({
            title: '💡 StudyKit Tip',
            description: 'Try clicking the logo lightning bolt 5 times or pressing Ctrl+Shift+S!',
            emoji: '⚡',
            type: 'secret'
          });
          buffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discoverEasterEgg, openModal, rechargeBattery, showFunToast, unlockAchievement]);

  return (
    <FunContext.Provider
      value={{
        funMode,
        setFunMode,
        toggleFunMode,
        soundEnabled,
        toggleSound,
        xp,
        level,
        addXP,
        achievements,
        unlockAchievement,
        easterEggs,
        discoverEasterEgg,
        brainBattery,
        batteryStatus,
        rechargeBattery,
        sessionDuration,
        inspectedProductsCount: inspectedProductIds.size,
        recordProductInspection,
        recordClick,
        activeModal,
        modalPayload,
        openModal,
        closeModal,
        funToasts,
        removeToast,
        showFunToast,
        forbiddenClickCount,
        incrementForbiddenClick
      }}
    >
      {children}
    </FunContext.Provider>
  );
};

export const useFun = (): FunContextType => {
  const context = useContext(FunContext);
  if (!context) {
    throw new Error('useFun must be used within a FunProvider');
  }
  return context;
};
