import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StudySprintHeader } from '../StudySprintHeader';
import { FunProvider } from '../../lib/fun/funContext';

describe('StudySprintHeader Component Suite', () => {
  const renderHeader = (props = {}) => {
    const defaultProps = {
      theme: 'dark' as const,
      toggleTheme: () => {},
      cartCount: 4,
      cartPopping: false,
      setCartOpen: () => {},
      setCartPopping: () => {},
      onLogoClick: () => {},
      ...props
    };

    return renderToStaticMarkup(
      <FunProvider>
        <StudySprintHeader {...defaultProps} />
      </FunProvider>
    );
  };

  describe('Section A: Promotional Banner', () => {
    it('renders the shopping bag icon, bold announcement, and supporting text', () => {
      const html = renderHeader();
      expect(html).toContain('🛍️');
      expect(html).toContain('EXAM CRUNCH SPECIAL');
      expect(html).toContain('Free Shipping on orders above ₹500!');
      expect(html).toContain('bg-[#FFE500]');
      expect(html).toContain('text-slate-950');
      expect(html).toContain('rounded-xl');
    });

    it('contains an accessible close button to dismiss the banner', () => {
      const html = renderHeader();
      expect(html).toContain('aria-label="Close promotional banner"');
      expect(html).toContain('✕');
    });
  });

  describe('Section B: Gamification / XP Panel', () => {
    it('renders the left area with crossed-swords icon, Level 6 Academic Weapon, and 1028 XP', () => {
      const html = renderHeader();
      expect(html).toContain('⚔️');
      expect(html).toContain('Lv 6: Academic Weapon');
      expect(html).toContain('1028 XP');
      expect(html).toContain('text-[#FFE500]');
    });

    it('renders the right area with brain icon, 24% progress, and progress bar', () => {
      const html = renderHeader();
      expect(html).toContain('🧠');
      expect(html).toContain('24%');
      expect(html).toContain('role="progressbar"');
      expect(html).toContain('width:24%');
      expect(html).toContain('from-[#FF6B8B]');
    });
  });

  describe('Section C: Quick Action Controls', () => {
    it('renders all four action controls in a responsive grid', () => {
      const html = renderHeader();
      expect(html).toContain('grid-cols-2');
      expect(html).toContain('md:grid-cols-4');

      // 1. Mini-Games
      expect(html).toContain('Mini-Games');
      expect(html).toContain('🎮');

      // 2. Stats
      expect(html).toContain('Stats');
      expect(html).toContain('📊');

      // 3. Sound
      expect(html).toContain('Sound:');

      // 4. Fun Mode
      expect(html).toContain('Fun Mode:');
    });
  });

  describe('Section D: Main Brand Navigation', () => {
    it('renders the lightning-bolt logo, StudySprint brand name, and tagline', () => {
      const html = renderHeader();
      expect(html).toContain('⚡');
      expect(html).toContain('StudySprint');
      expect(html).toContain('cute stationery that works');
    });

    it('renders the dark-mode toggle button with moon icon when in dark mode', () => {
      const html = renderHeader({ theme: 'dark' });
      expect(html).toContain('id="theme-toggle-btn"');
      expect(html).toContain('🌙');
    });

    it('renders the shopping cart icon with yellow circular badge displaying 4', () => {
      const html = renderHeader({ cartCount: 4 });
      expect(html).toContain('id="cart-btn"');
      expect(html).toContain('🛒');
      expect(html).toContain('id="cart-count-badge"');
      expect(html).toContain('bg-[#FFE500]');
      expect(html).toContain('>4<');
    });
  });
});
