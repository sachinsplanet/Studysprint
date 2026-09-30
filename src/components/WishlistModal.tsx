import React from 'react';
import { ProductImage } from './ProductImage';

export interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: 'focus' | 'exam' | 'custom';
  tag: string;
  blurb?: string;
  items?: string[];
  image?: string | null;
  imageAlt?: string;
  imageSource?: string | null;
  sourcePage?: string | null;
}

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: WishlistProduct[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: WishlistProduct) => void;
  onMoveAllToCart: () => void;
  onClearWishlist: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onMoveAllToCart,
  onClearWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFDF5] dark:bg-[#0F172A] text-[#10182B] dark:text-slate-100 rounded-3xl border-2 border-[#F0E3B5] dark:border-slate-700 shadow-[0_16px_48px_rgba(240,227,181,0.6)] dark:shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F0E3B5] dark:border-slate-700 flex items-center justify-between bg-[#FFF0F5] dark:bg-rose-950/30">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">💖</span>
            <div>
              <h2 id="wishlist-modal-title" className="font-display font-black text-xl leading-tight text-[#10182B] dark:text-white">
                My Wishlist
              </h2>
              <span className="text-xs font-medium text-[#58647D] dark:text-slate-400">
                {wishlist.length} {wishlist.length === 1 ? 'kit' : 'kits'} saved for later
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#F0E3B5] dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-[#FFF4C7] dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors text-[#10182B] dark:text-white"
            aria-label="Close Wishlist Modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlist.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F5] dark:bg-rose-900/40 flex items-center justify-center text-3xl mb-4 border border-[#FFCCD9] dark:border-rose-700">
                💌
              </div>
              <h3 className="font-display font-bold text-lg mb-1 text-[#10182B] dark:text-white">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-[#58647D] dark:text-slate-400 max-w-xs mb-6 font-body">
                Spot a study kit you love? Tap the heart icon on any card to save it for exam cramming!
              </p>
              <a
                href="#kits"
                onClick={onClose}
                className="btn-doodle btn-primary px-5 py-2 text-sm"
              >
                Browse Study Kits ⚡
              </a>
            </div>
          ) : (
            <ul className="space-y-3">
              {wishlist.map((item) => (
                <li
                  key={item.id}
                  className="bg-white dark:bg-slate-900/80 p-3 sm:p-3.5 rounded-2xl border border-[#F0E3B5] dark:border-slate-700 flex items-center gap-3 shadow-xs hover:border-[#FFD600] transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFFDF5] dark:bg-slate-800 border border-[#F0E3B5] dark:border-slate-700 flex items-center justify-center">
                    {item.image ? (
                      <ProductImage
                        src={item.image}
                        alt={item.imageAlt || item.name}
                        fallbackEmoji={item.emoji}
                        aspectRatio="square"
                        className="w-full h-full object-cover"
                        showBadge={false}
                      />
                    ) : (
                      <span className="text-3xl select-none">{item.emoji}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="font-hand text-xs font-semibold text-[#FF719A] dark:text-rose-400 block truncate">
                      {item.tag}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base text-[#10182B] dark:text-white truncate">
                      {item.name}
                    </h4>
                    <span className="font-display font-bold text-sm sm:text-base text-[#10182B] dark:text-amber-400 block mt-0.5">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="btn-doodle btn-primary text-xs px-3.5 py-1.5 whitespace-nowrap"
                      title="Add to shopping cart"
                    >
                      Add to Cart 🛒
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-1.5 text-xs text-[#7B8498] hover:text-[#FF719A] dark:hover:text-rose-400 rounded-lg hover:bg-[#FFF0F5] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-[#F0E3B5] dark:border-slate-700 bg-[#FFFDF5] dark:bg-slate-900/60 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={onClearWishlist}
              className="text-xs text-[#7B8498] hover:text-[#FF719A] font-semibold cursor-pointer underline"
            >
              Clear Wishlist
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMoveAllToCart}
                className="btn-doodle btn-primary text-xs sm:text-sm px-4 py-2"
              >
                Move All to Cart 🛒
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
