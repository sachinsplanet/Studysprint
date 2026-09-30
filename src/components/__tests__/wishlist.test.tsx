import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WishlistModal, WishlistProduct } from '../WishlistModal';
import { StudySprintHeader } from '../StudySprintHeader';
import { FunProvider } from '../../lib/fun/funContext';

describe('Wishlist Feature Suite', () => {
  const sampleWishlist: WishlistProduct[] = [
    {
      id: 'f1',
      name: 'Deep Focus Kit',
      price: 499,
      emoji: '🎯',
      category: 'focus',
      tag: '🧠 Flow State Mastery',
      blurb: 'Designed for high-intensity study marathons.'
    },
    {
      id: 'e1',
      name: 'Midnight Crammer Bento',
      price: 549,
      emoji: '🌙',
      category: 'exam',
      tag: '☕ 3 AM Emergency Rations',
      blurb: 'Everything needed to survive all-night revision.'
    }
  ];

  describe('WishlistModal Component', () => {
    it('renders empty state message when wishlist is empty', () => {
      const html = renderToStaticMarkup(
        <WishlistModal
          isOpen={true}
          onClose={() => {}}
          wishlist={[]}
          onRemoveFromWishlist={() => {}}
          onAddToCart={() => {}}
          onMoveAllToCart={() => {}}
          onClearWishlist={() => {}}
        />
      );

      expect(html).toContain('My Wishlist');
      expect(html).toContain('0 kits saved for later');
      expect(html).toContain('Your wishlist is empty');
      expect(html).toContain('Browse Study Kits');
    });

    it('renders saved product cards with details and action buttons', () => {
      const html = renderToStaticMarkup(
        <WishlistModal
          isOpen={true}
          onClose={() => {}}
          wishlist={sampleWishlist}
          onRemoveFromWishlist={() => {}}
          onAddToCart={() => {}}
          onMoveAllToCart={() => {}}
          onClearWishlist={() => {}}
        />
      );

      expect(html).toContain('2 kits saved for later');
      expect(html).toContain('Deep Focus Kit');
      expect(html).toContain('₹499');
      expect(html).toContain('Midnight Crammer Bento');
      expect(html).toContain('₹549');
      expect(html).toContain('Add to Cart 🛒');
      expect(html).toContain('Move All to Cart 🛒');
      expect(html).toContain('Clear Wishlist');
    });

    it('returns null when modal is not open', () => {
      const html = renderToStaticMarkup(
        <WishlistModal
          isOpen={false}
          onClose={() => {}}
          wishlist={sampleWishlist}
          onRemoveFromWishlist={() => {}}
          onAddToCart={() => {}}
          onMoveAllToCart={() => {}}
          onClearWishlist={() => {}}
        />
      );

      expect(html).toBe('');
    });
  });

  describe('Header Wishlist Integration', () => {
    it('renders Wishlist trigger button in header with item count badge', () => {
      const html = renderToStaticMarkup(
        <FunProvider>
          <StudySprintHeader
            theme="dark"
            toggleTheme={() => {}}
            cartCount={4}
            cartPopping={false}
            setCartOpen={() => {}}
            setCartPopping={() => {}}
            wishlistCount={2}
            onOpenWishlist={() => {}}
          />
        </FunProvider>
      );

      expect(html).toContain('id="wishlist-btn"');
      expect(html).toContain('id="wishlist-count-badge"');
      expect(html).toContain('>2<');
      expect(html).toContain('❤️');
    });

    it('displays unliked heart icon when wishlist is empty', () => {
      const html = renderToStaticMarkup(
        <FunProvider>
          <StudySprintHeader
            theme="dark"
            toggleTheme={() => {}}
            cartCount={4}
            cartPopping={false}
            setCartOpen={() => {}}
            setCartPopping={() => {}}
            wishlistCount={0}
            onOpenWishlist={() => {}}
          />
        </FunProvider>
      );

      expect(html).toContain('id="wishlist-btn"');
      expect(html).toContain('🤍');
      expect(html).not.toContain('id="wishlist-count-badge"');
    });
  });
});
