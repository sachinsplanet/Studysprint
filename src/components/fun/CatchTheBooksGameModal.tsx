import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useFun } from '../../lib/fun/funContext';
import { soundEngine } from '../../lib/fun/sound';

interface FallingItem {
  id: number;
  x: number; // percentage 8..92
  y: number; // percentage 0..100
  speed: number;
  type: 'good' | 'bad';
  emoji: string;
  name: string;
  points: number;
  rotation: number;
}

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  text: string;
  type: 'positive' | 'negative' | 'combo';
}

const STUDY_ITEMS = [
  { emoji: '📚', name: 'Textbook', points: 10 },
  { emoji: '✏️', name: 'Gel Pen', points: 10 },
  { emoji: '📓', name: 'Study Notes', points: 15 },
  { emoji: '📐', name: 'Geometry Ruler', points: 10 },
  { emoji: '🖍️', name: 'Highlighter', points: 10 },
  { emoji: '☕', name: 'Espresso Shot', points: 20 },
  { emoji: '💡', name: 'Eureka Idea', points: 25 },
];

const DISTRACTION_ITEMS = [
  { emoji: '📱', name: 'Doomscrolling', points: -15 },
  { emoji: '🎮', name: 'Gaming Binge', points: -15 },
  { emoji: '🍿', name: 'Streaming Tab', points: -15 },
  { emoji: '🛌', name: 'Emergency Nap', points: -20 },
  { emoji: '💤', name: 'Class Snooze', points: -10 },
  { emoji: '🍕', name: 'Snack Attack', points: -10 },
];

export const CatchTheBooksGameModal: React.FC = () => {
  const { activeModal, closeModal, openModal, addXP, unlockAchievement, showFunToast, soundEnabled, toggleSound } = useFun();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [studyCaught, setStudyCaught] = useState(0);
  const [distractionsHit, setDistractionsHit] = useState(0);
  const [basketX, setBasketX] = useState(50); // percentage 8..92
  const [basketTilt, setBasketTilt] = useState(0); // degrees
  const [isCatching, setIsCatching] = useState(false);
  const [shakeArena, setShakeArena] = useState(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('studyKitGameScore_books') || 0);
    } catch {
      return 0;
    }
  });

  const itemsRef = useRef<FallingItem[]>([]);
  const [, setRenderTrigger] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysHeldRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const basketXRef = useRef(50);
  const gameOverHandledRef = useRef<boolean>(false);

  // Keep ref in sync
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Keyboard navigation listener (smooth hold detection)
  useEffect(() => {
    if (activeModal !== 'catchBooksGame') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === ' ' && (gameState === 'playing' || gameState === 'paused')) {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
        return;
      }
      if (gameState === 'playing') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          keysHeldRef.current.left = true;
          setBasketTilt(-8);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          keysHeldRef.current.right = true;
          setBasketTilt(8);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysHeldRef.current.left = false;
        if (!keysHeldRef.current.right) setBasketTilt(0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysHeldRef.current.right = false;
        if (!keysHeldRef.current.left) setBasketTilt(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal, closeModal, gameState]);

  // Start game function
  const startGame = useCallback(() => {
    gameOverHandledRef.current = false;
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setStudyCaught(0);
    setDistractionsHit(0);
    setBasketX(50);
    basketXRef.current = 50;
    setBasketTilt(0);
    setFloatingScores([]);
    itemsRef.current = [];
    keysHeldRef.current = { left: false, right: false };
    setGameState('playing');
    lastSpawnRef.current = Date.now();
    lastTimeRef.current = performance.now();
    soundEngine.playPop();
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('over');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Handle Game Over XP, Confetti, and High Score
  useEffect(() => {
    if (gameState === 'over' && !gameOverHandledRef.current) {
      gameOverHandledRef.current = true;
      const earnedXP = Math.max(15, Math.round(score * 0.8));
      addXP(earnedXP, `Finished 'Catch The Books' mini-game (${score} pts)`);

      setHighScore((prevHigh) => {
        if (score > prevHigh) {
          try {
            localStorage.setItem('studyKitGameScore_books', String(score));
          } catch {
            // ignore
          }
          showFunToast({
            title: '🏆 New High Score!',
            description: `You scored ${score} pts in Catch The Books!`,
            emoji: '🎯',
            type: 'achievement',
          });
          return score;
        }
        return prevHigh;
      });

      if (score >= 100) {
        unlockAchievement('game_champ');
      }

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
      soundEngine.playSuccess();
    }
  }, [gameState, score, addXP, showFunToast, unlockAchievement]);

  // Floating score trigger helper
  const addFloatingScore = useCallback((x: number, y: number, text: string, type: 'positive' | 'negative' | 'combo') => {
    const id = Date.now() + Math.random();
    setFloatingScores((prev) => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((f) => f.id !== id));
    }, 900);
  }, []);

  // Main 60fps game animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let running = true;
    lastTimeRef.current = performance.now();

    const loop = (timestamp: number) => {
      if (!running) return;

      const delta = Math.min(32, timestamp - lastTimeRef.current) / 16.67; // normalized to 60fps
      lastTimeRef.current = timestamp;

      // 1. Process keyboard steering from held keys
      if (keysHeldRef.current.left) {
        basketXRef.current = Math.max(8, basketXRef.current - 1.6 * delta);
        setBasketX(basketXRef.current);
      } else if (keysHeldRef.current.right) {
        basketXRef.current = Math.min(92, basketXRef.current + 1.6 * delta);
        setBasketX(basketXRef.current);
      }

      const now = Date.now();
      // Faster spawn rate during final 10 seconds crunch
      const spawnInterval = timeLeft <= 10 ? 460 : 620;

      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const isGood = Math.random() > 0.32;
        const sourceList = isGood ? STUDY_ITEMS : DISTRACTION_ITEMS;
        const selected = sourceList[Math.floor(Math.random() * sourceList.length)];
        const speedBoost = timeLeft <= 10 ? 0.35 : 0;

        const newItem: FallingItem = {
          id: Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          speed: (Math.random() * 0.55 + 0.85 + speedBoost) * delta,
          type: isGood ? 'good' : 'bad',
          emoji: selected.emoji,
          name: selected.name,
          points: selected.points,
          rotation: (Math.random() - 0.5) * 20,
        };
        itemsRef.current.push(newItem);
      }

      // 2. Update falling items and check basket collisions
      const nextItems: FallingItem[] = [];
      const currentBasketX = basketXRef.current;

      for (const item of itemsRef.current) {
        item.y += item.speed * delta;

        // Collision zone at basket height y ~ 83%..93%
        if (item.y >= 82 && item.y <= 92) {
          const distance = Math.abs(item.x - currentBasketX);
          if (distance <= 13) {
            // Collision caught!
            setIsCatching(true);
            setTimeout(() => setIsCatching(false), 150);

            if (item.type === 'good') {
              setStudyCaught((prev) => prev + 1);
              setCombo((prevCombo) => {
                const newCombo = prevCombo + 1;
                setMaxCombo((prevMax) => Math.max(prevMax, newCombo));

                let bonus = 0;
                if (newCombo >= 10) bonus = 20;
                else if (newCombo >= 5) bonus = 10;
                else if (newCombo >= 3) bonus = 5;

                const earned = item.points + bonus;
                setScore((s) => s + earned);

                if (newCombo >= 3 && newCombo % 3 === 0) {
                  soundEngine.playSuccess();
                  addFloatingScore(currentBasketX, 78, `🔥 COMBO x${newCombo}! +${earned}`, 'combo');
                } else {
                  soundEngine.playPop();
                  addFloatingScore(currentBasketX, 80, `+${earned} ${item.emoji}`, 'positive');
                }
                return newCombo;
              });
            } else {
              // Hit distraction!
              setDistractionsHit((prev) => prev + 1);
              setCombo(0);
              setScore((s) => Math.max(0, s + item.points));
              soundEngine.playBoing();
              setShakeArena(true);
              setTimeout(() => setShakeArena(false), 250);
              addFloatingScore(currentBasketX, 80, `${item.points} ${item.emoji} DISTRACTION!`, 'negative');
            }
            continue; // item consumed
          }
        }

        if (item.y < 100) {
          nextItems.push(item);
        }
      }

      itemsRef.current = nextItems;
      setRenderTrigger((prev) => prev + 1);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, timeLeft, addFloatingScore]);

  // Touch / mouse pointer move on arena to steer basket
  const handleArenaPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const targetX = Math.min(92, Math.max(8, relativeX));
    const diff = targetX - basketXRef.current;
    setBasketTilt(diff > 1 ? 8 : diff < -1 ? -8 : 0);
    basketXRef.current = targetX;
    setBasketX(targetX);
  }, [gameState]);

  // On-screen touch buttons for mobile / handheld
  const handleTouchButtonMove = useCallback((direction: 'left' | 'right', isPressed: boolean) => {
    if (gameState !== 'playing') return;
    if (direction === 'left') {
      keysHeldRef.current.left = isPressed;
      setBasketTilt(isPressed ? -8 : 0);
    } else {
      keysHeldRef.current.right = isPressed;
      setBasketTilt(isPressed ? 8 : 0);
    }
  }, [gameState]);

  if (activeModal !== 'catchBooksGame') return null;

  // Calculate Academic Rank on Game Over
  let gradeLetter = 'C';
  let gradeTitle = 'Cram Session Survivor';
  let gradeColor = 'text-amber-500';

  if (score >= 140) {
    gradeLetter = 'S+';
    gradeTitle = 'Academic Weapon of Mass Productivity ⚔️';
    gradeColor = 'text-purple-600 dark:text-purple-400';
  } else if (score >= 100) {
    gradeLetter = 'A';
    gradeTitle = "Dean's List Legend 🎓";
    gradeColor = 'text-emerald-600 dark:text-emerald-400';
  } else if (score >= 60) {
    gradeLetter = 'B';
    gradeTitle = 'Solid GPA Defender 📚';
    gradeColor = 'text-blue-600 dark:text-blue-400';
  } else if (score >= 30) {
    gradeLetter = 'C';
    gradeTitle = 'Highlighter Collector 🖍️';
    gradeColor = 'text-amber-500 dark:text-amber-400';
  } else {
    gradeLetter = 'F';
    gradeTitle = 'Victim of Phone Notifications 📱';
    gradeColor = 'text-rose-500 dark:text-rose-400';
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="doodle-card bg-[#FFFDF7] dark:bg-[#162032] max-w-lg w-full max-h-[92vh] overflow-y-auto my-auto p-4 sm:p-6 text-[#1E2A4A] dark:text-slate-100 animate-in zoom-in-95 duration-200 select-none shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#1E2A4A]/10 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎒</span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#1E2A4A] dark:text-white">
                Catch The Books!
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFC93C] text-[#1E2A4A]">
                Mini-Game
              </span>
            </div>
            <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300">
              Catch study essentials (📚✏️📓☕), dodge distractions (📱🎮🛌)!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-8 h-8 rounded-full border-2 border-[#1E2A4A] dark:border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* HUD: Time, Score, Combo, High Score */}
        <div className="grid grid-cols-4 gap-2 my-3 font-display text-center">
          <div className={`px-2 py-1.5 rounded-xl border ${timeLeft <= 10 ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-600 animate-pulse' : 'bg-blue-50 dark:bg-slate-800/80 border-blue-200 dark:border-slate-700'}`}>
            <span className="text-[10px] uppercase block tracking-wider opacity-70">Time</span>
            <b className="text-sm sm:text-base">{timeLeft}s</b>
          </div>
          <div className="px-2 py-1.5 rounded-xl border bg-amber-50 dark:bg-slate-800/80 border-amber-200 dark:border-slate-700">
            <span className="text-[10px] uppercase block tracking-wider opacity-70">Score</span>
            <b className="text-sm sm:text-base text-amber-600 dark:text-amber-300">{score}</b>
          </div>
          <div className="px-2 py-1.5 rounded-xl border bg-orange-50 dark:bg-slate-800/80 border-orange-200 dark:border-slate-700">
            <span className="text-[10px] uppercase block tracking-wider opacity-70">Combo</span>
            <b className={`text-sm sm:text-base ${combo >= 3 ? 'text-orange-500 font-bold animate-bounce' : 'text-slate-700 dark:text-slate-300'}`}>
              {combo > 1 ? `x${combo} 🔥` : 'x1'}
            </b>
          </div>
          <div className="px-2 py-1.5 rounded-xl border bg-emerald-50 dark:bg-slate-800/80 border-emerald-200 dark:border-slate-700">
            <span className="text-[10px] uppercase block tracking-wider opacity-70">High</span>
            <b className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400">{highScore}</b>
          </div>
        </div>

        {/* Game Arena */}
        <div
          ref={containerRef}
          onPointerMove={handleArenaPointerMove}
          className={`relative w-full h-80 bg-gradient-to-b from-blue-50/60 via-amber-50/40 to-yellow-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 rounded-2xl border-3 border-[#1E2A4A] dark:border-slate-600 overflow-hidden touch-none select-none ${
            shakeArena ? 'animate-wiggle' : ''
          }`}
          style={{ cursor: gameState === 'playing' ? 'ew-resize' : 'default' }}
        >
          {/* Subtle arena background pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#1E2A4A_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Crunch time banner in last 10s */}
          {gameState === 'playing' && timeLeft <= 10 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 rounded-full bg-rose-500 text-white font-display text-[10px] font-bold tracking-wider uppercase animate-pulse shadow-md">
              ⚡ FINAL EXAM CRUNCH MODE! (+SPEED)
            </div>
          )}

          {/* Idle screen */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/95 dark:bg-[#162032]/95 backdrop-blur-xs z-20">
              <div className="text-5xl mb-2 animate-bounce">🎒</div>
              <h4 className="font-display font-bold text-xl mb-1 text-[#1E2A4A] dark:text-white">
                Catch The Knowledge!
              </h4>
              <p className="font-body text-xs text-slate-600 dark:text-slate-300 mb-3 max-w-sm">
                Control the StudyKit basket to catch study essentials before they hit the ground. Dodge distractions or lose precious exam points!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] mb-4 bg-amber-50/80 dark:bg-slate-800 p-2 rounded-xl border border-amber-200 dark:border-slate-700">
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Catch: 📚 ✏️ 📓 📐 ☕</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Avoid: 📱 🎮 🍿 🛌</span>
              </div>
              <button
                type="button"
                onClick={startGame}
                className="btn-doodle btn-primary px-7 py-2.5 text-sm sm:text-base cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                Start 30s Study Sprint ⚡
              </button>
            </div>
          )}

          {/* Paused screen */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs z-20 text-white">
              <span className="text-4xl mb-2">⏸️</span>
              <h4 className="font-display font-bold text-xl mb-1">Study Session Paused</h4>
              <p className="text-xs text-slate-300 mb-4">Take a deep breath. Drink some water.</p>
              <button
                type="button"
                onClick={pauseGame}
                className="btn-doodle btn-primary px-6 py-2 text-sm cursor-pointer shadow-md"
              >
                Resume Sprint ▶
              </button>
            </div>
          )}

          {/* Game Over screen */}
          {gameState === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-white/95 dark:bg-[#162032]/95 backdrop-blur-xs z-20 animate-in zoom-in-95 duration-200">
              <div className="text-4xl mb-1">🏁</div>
              <h4 className="font-display font-bold text-lg sm:text-xl text-[#1E2A4A] dark:text-white">
                Study Sprint Complete!
              </h4>

              {/* Performance Card */}
              <div className="my-2.5 w-full max-w-xs bg-amber-50 dark:bg-slate-800 p-3 rounded-2xl border-2 border-amber-200 dark:border-slate-700 text-center shadow-xs">
                <div className="flex items-center justify-center gap-3">
                  <div className={`font-display font-black text-4xl ${gradeColor}`}>
                    {gradeLetter}
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Score: <b className="text-amber-600 dark:text-amber-300 text-base">{score} pts</b>
                    </span>
                    <span className="font-display font-bold text-xs text-[#1E2A4A] dark:text-slate-100 block">
                      {gradeTitle}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-amber-200/60 dark:border-slate-700 text-[10px]">
                  <div>
                    <span className="opacity-70 block">Caught</span>
                    <b>{studyCaught} 📚</b>
                  </div>
                  <div>
                    <span className="opacity-70 block">Distractions</span>
                    <b className="text-rose-500">{distractionsHit} 📱</b>
                  </div>
                  <div>
                    <span className="opacity-70 block">Max Combo</span>
                    <b className="text-orange-500">{maxCombo}x 🔥</b>
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-display font-semibold mb-3">
                +{Math.max(15, Math.round(score * 0.8))} Academic XP added to your student profile!
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="btn-doodle btn-primary px-4 py-2 text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  Play Again 🔄
                </button>
                <button
                  type="button"
                  onClick={() => openModal('examSurvivalGame')}
                  className="btn-doodle btn-ghost px-3 py-2 text-xs cursor-pointer border border-[#1E2A4A]/20"
                  title="Switch to Exam Survival reflex game"
                >
                  ⏱️ Exam Survival
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-doodle btn-ghost px-3 py-2 text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Falling items */}
          {itemsRef.current.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl sm:text-3xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-sm"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Floating Score Popups */}
          {floatingScores.map((f) => (
            <div
              key={f.id}
              className={`absolute transform -translate-x-1/2 pointer-events-none font-display font-bold text-xs sm:text-sm px-2 py-0.5 rounded-full shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-10 ${
                f.type === 'positive'
                  ? 'bg-emerald-500 text-white'
                  : f.type === 'negative'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white animate-bounce'
              }`}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
              }}
            >
              {f.text}
            </div>
          ))}

          {/* Player Basket */}
          <div
            className={`absolute bottom-3 transform -translate-x-1/2 pointer-events-none transition-transform duration-75 ${
              isCatching ? 'scale-110' : 'scale-100'
            }`}
            style={{
              left: `${basketX}%`,
              transform: `translateX(-50%) rotate(${basketTilt}deg)`,
            }}
          >
            {/* Basket Bag */}
            <div className="relative w-20 h-10 rounded-b-2xl border-3 border-[#1E2A4A] dark:border-white bg-[#FFC93C] flex items-center justify-center shadow-lg font-display font-bold text-xs text-[#1E2A4A]">
              {/* Basket Straps/Handle */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 border-t-3 border-x-3 border-[#1E2A4A] dark:border-white rounded-t-lg bg-amber-300" />
              <div className="flex items-center gap-1 z-10">
                <span className="text-sm">🎒</span>
                <span className="tracking-wider">KIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls & mobile controls */}
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          {/* Mobile on-screen touch arrows */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              type="button"
              onPointerDown={() => handleTouchButtonMove('left', true)}
              onPointerUp={() => handleTouchButtonMove('left', false)}
              onPointerLeave={() => handleTouchButtonMove('left', false)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E2A4A] dark:border-slate-600 font-display font-bold active:bg-[#FFC93C] active:text-[#1E2A4A] cursor-pointer touch-none select-none transition-colors text-center"
              aria-label="Move basket left"
            >
              ◀ Left
            </button>
            <button
              type="button"
              onPointerDown={() => handleTouchButtonMove('right', true)}
              onPointerUp={() => handleTouchButtonMove('right', false)}
              onPointerLeave={() => handleTouchButtonMove('right', false)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[#1E2A4A] dark:border-slate-600 font-display font-bold active:bg-[#FFC93C] active:text-[#1E2A4A] cursor-pointer touch-none select-none transition-colors text-center"
              aria-label="Move basket right"
            >
              Right ▶
            </button>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="hidden sm:inline">
              Move with <b>Arrow Keys</b>, <b>A/D</b>, or <b>Mouse/Touch</b>
            </span>
            {gameState === 'playing' && (
              <button
                type="button"
                onClick={pauseGame}
                className="btn-doodle btn-ghost px-3 py-1 text-xs cursor-pointer"
              >
                Pause (Space)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
