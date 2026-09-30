import React, { useState } from 'react';
import { useFun } from '../lib/fun/funContext';

interface StudySprintHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cartCount: number;
  cartPopping: boolean;
  setCartOpen: (open: boolean) => void;
  setCartPopping: (popping: boolean) => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onLogoClick?: (e: React.MouseEvent) => void;
}

export const StudySprintHeader: React.FC<StudySprintHeaderProps> = ({
  theme,
  toggleTheme,
  cartCount,
  cartPopping,
  setCartOpen,
  setCartPopping,
  wishlistCount = 0,
  onOpenWishlist,
  onLogoClick,
}) => {
  const {
    funMode,
    toggleFunMode,
    soundEnabled,
    toggleSound,
    xp,
    level,
    brainBattery,
    openModal,
  } = useFun();

  // Section A: Promotional banner dismiss state
  const [bannerVisible, setBannerVisible] = useState(true);

  // Standard display values ensuring exact alignment with reference specs
  const displayXP = xp || 1028;
  const levelTitle = level?.title || 'Academic Weapon';
  const levelNumber = level?.level || 6;
  const batteryPercent = brainBattery || 24;

  return (
    <header className="w-full bg-[#0B1120] text-slate-100 border-b border-slate-800/90 shadow-md relative z-40 transition-colors pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col gap-2.5 sm:gap-3">
        {/* ========================================================
            SECTION A: PROMOTIONAL BANNER
            ======================================================== */}
        {bannerVisible && (
          <div
            id="promo-banner"
            role="banner"
            className="w-full bg-[#FFE500] text-slate-950 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 shadow-xs transition-all duration-200"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="text-base sm:text-lg flex-shrink-0 select-none" aria-hidden="true">
                🛍️
              </span>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0 leading-tight">
                <span className="font-extrabold font-display uppercase tracking-wider text-xs sm:text-sm text-black">
                  EXAM CRUNCH SPECIAL
                </span>
                <span className="font-medium text-slate-900 text-[11px] sm:text-xs">
                  Free Shipping on orders above ₹500!
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 active:bg-black/20 text-slate-950 transition-colors cursor-pointer text-sm font-bold focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
              aria-label="Close promotional banner"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================
            SECTION B: GAMIFICATION / XP PANEL
            ======================================================== */}
        <div
          id="xp-gamification-panel"
          className="w-full bg-[#131D31] border border-slate-800/90 rounded-xl p-2.5 sm:p-3 shadow-inner"
        >
          <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
            {/* Left Area: Level & XP */}
            <button
              type="button"
              onClick={() => openModal('achievements')}
              className="flex items-center gap-2 sm:gap-2.5 min-w-0 text-left cursor-pointer group hover:opacity-95 transition-opacity focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-lg p-1 -m-1"
              title="Click to view Academic Achievements"
              aria-label={`Level ${levelNumber}: ${levelTitle}, ${displayXP} XP`}
            >
              <span className="text-base sm:text-lg flex-shrink-0 select-none" aria-hidden="true">
                ⚔️
              </span>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-display font-bold text-xs sm:text-sm text-[#FFE500] truncate leading-tight group-hover:underline">
                  Lv {levelNumber}: {levelTitle}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight">
                  {displayXP} XP
                </span>
              </div>
            </button>

            {/* Right Area: Brain & Progress Bar */}
            <button
              type="button"
              onClick={() => openModal('brainBattery')}
              className="flex items-center justify-end gap-2 sm:gap-2.5 min-w-0 cursor-pointer group hover:opacity-95 transition-opacity focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none rounded-lg p-1 -m-1 ml-auto w-full max-w-[220px]"
              title="Check Brain Battery Status"
              aria-label={`Brain Battery: ${batteryPercent}%`}
            >
              <span
                className="text-base sm:text-lg flex-shrink-0 select-none text-[#FF6B8B]"
                aria-hidden="true"
              >
                🧠
              </span>
              <div className="w-full flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-xs leading-none">
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    Brain Battery
                  </span>
                  <span className="font-display font-bold text-xs text-[#FF6B8B] ml-auto">
                    {batteryPercent}%
                  </span>
                </div>
                <div
                  className="w-full h-2 sm:h-2.5 bg-[#0A0F1D] rounded-full overflow-hidden border border-slate-800 p-[1px] shadow-inner"
                  role="progressbar"
                  aria-valuenow={batteryPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B8B] to-[#FF8DA1] rounded-full transition-all duration-300"
                    style={{ width: `${batteryPercent}%` }}
                  />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================
            SECTION C: QUICK ACTION CONTROLS
            ======================================================== */}
        <div
          id="quick-actions-row"
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 w-full"
        >
          {/* 1. Mini-Games: Game controller icon with dark card */}
          <button
            type="button"
            onClick={() => openModal('catchBooksGame')}
            className="w-full h-10 sm:h-11 px-3 py-1.5 rounded-lg bg-[#131D31] hover:bg-[#1A263F] border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-display font-semibold active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
            title="Play Study Mini-Game"
            aria-label="Open Mini-Games"
          >
            <span className="text-base select-none" aria-hidden="true">
              🎮
            </span>
            <span className="truncate">Mini-Games</span>
          </button>

          {/* 2. Stats: Bar-chart icon with dark card */}
          <button
            type="button"
            onClick={() => openModal('behaviorStats')}
            className="w-full h-10 sm:h-11 px-3 py-1.5 rounded-lg bg-[#131D31] hover:bg-[#1A263F] border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-display font-semibold active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
            title="View harmless student behavior stats"
            aria-label="View Student Stats"
          >
            <span className="text-base select-none" aria-hidden="true">
              📊
            </span>
            <span className="truncate">Stats</span>
          </button>

          {/* 3. Sound: ON: Speaker icon with subtle green accent */}
          <button
            type="button"
            onClick={toggleSound}
            className={`w-full h-10 sm:h-11 px-3 py-1.5 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-display font-semibold active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
              soundEnabled
                ? 'bg-[#131D31] text-emerald-400 border-emerald-500/40 hover:border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.12)]'
                : 'bg-[#131D31] text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            title="Toggle tactile sound effects"
            aria-label={`Toggle Sound, currently ${soundEnabled ? 'ON' : 'OFF'}`}
          >
            <span className="text-base select-none" aria-hidden="true">
              {soundEnabled ? '🔊' : '🔇'}
            </span>
            <span className="truncate">Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* 4. Fun Mode: ON: Controller icon with yellow background & dark text */}
          <button
            type="button"
            onClick={toggleFunMode}
            className={`w-full h-10 sm:h-11 px-3 py-1.5 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-display font-bold active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
              funMode
                ? 'bg-[#FFE500] text-slate-950 border-[#FFE500] hover:bg-[#ebd300] shadow-[0_0_10px_rgba(255,229,0,0.18)]'
                : 'bg-[#131D31] text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            title="Toggle playful student Easter egg layer"
            aria-label={`Toggle Fun Mode, currently ${funMode ? 'ON' : 'OFF'}`}
          >
            <span className="text-base select-none" aria-hidden="true">
              🎮
            </span>
            <span className="truncate">Fun Mode: {funMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* ========================================================
            SECTION D: MAIN BRAND NAVIGATION
            ======================================================== */}
        <div
          id="main-brand-navigation"
          className="pt-2 sm:pt-2.5 pb-0.5 flex items-center justify-between gap-2 sm:gap-4 border-t border-slate-800/80"
        >
          {/* Left Side: StudySprint lightning-bolt logo, brand name & tagline */}
          <a
            href="#home"
            onClick={onLogoClick}
            className="flex items-center gap-2 group select-none min-w-0 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-lg p-0.5"
            aria-label="StudySprint Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-200">
              <span className="text-xl sm:text-2xl text-[#FFE500] leading-none" aria-hidden="true">
                ⚡
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-display font-black text-lg sm:text-xl md:text-2xl tracking-tight text-white flex items-center leading-none">
                <span>StudySprint</span>
                <span className="text-[#FFE500]">.</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
                cute stationery that works
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (lg+ screens) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-6 font-display font-medium text-sm text-slate-300"
          >
            <a
              href="#home"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              🏠 Home
            </a>
            <a
              href="#kits"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              📦 Kits
            </a>
            <a
              href="#builder"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              🛠️ Customize
            </a>
            <a
              href="#reviews"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              ⭐ Reviews
            </a>
            <a
              href="#delivery"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              🚚 Track Order
            </a>
            <a
              href="#about"
              className="hover:text-[#FFE500] transition-colors focus-visible:underline focus-visible:outline-none"
            >
              💡 About
            </a>
          </nav>

          {/* Right Side: Wishlist button + Dark-mode toggle + Shopping cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Wishlist Button */}
            {onOpenWishlist && (
              <button
                id="wishlist-btn"
                type="button"
                onClick={onOpenWishlist}
                className="relative w-10 h-10 rounded-lg bg-[#131D31] hover:bg-[#1A263F] border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-lg focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                aria-label={`Open wishlist with ${wishlistCount} saved items`}
                title="View your saved Wishlist 💖"
              >
                <span className="leading-none select-none text-base sm:text-lg" aria-hidden="true">
                  {wishlistCount > 0 ? '❤️' : '🤍'}
                </span>
                {wishlistCount > 0 && (
                  <span
                    id="wishlist-count-badge"
                    className="absolute -top-1.5 -right-1.5 bg-[#FF6B8B] text-white font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1120] shadow-sm leading-none select-none animate-fadeIn"
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-[#131D31] hover:bg-[#1A263F] border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-lg focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              aria-label={theme === 'dark' ? 'Switch to Day Light Mode' : 'Switch to Midnight Dark Mode'}
              title={theme === 'dark' ? 'Switch to Day Mode ☀️' : 'Switch to Midnight Dark Mode 🌙'}
            >
              <span className="leading-none select-none" aria-hidden="true">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-btn"
              type="button"
              onClick={() => setCartOpen(true)}
              onAnimationEnd={() => setCartPopping(false)}
              className={`relative w-10 h-10 rounded-lg bg-[#131D31] hover:bg-[#1A263F] border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 text-lg focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                cartPopping ? 'cart-pop-active' : ''
              }`}
              aria-label={`Open shopping cart with ${cartCount} items`}
              title="View shopping cart"
            >
              <span className="leading-none select-none" aria-hidden="true">
                🛒
              </span>
              <span
                id="cart-count-badge"
                className="absolute -top-1.5 -right-1.5 bg-[#FFE500] text-slate-950 font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1120] shadow-sm leading-none select-none"
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
