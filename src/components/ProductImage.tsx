import React, { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  fallbackEmoji: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  sourcePage?: string;
  sourceLabel?: string;
  showBadge?: boolean;
}

/**
 * Robust ProductImage component implementing:
 * 1. Realistic verified photography display with consistent e-commerce container
 * 2. Automatic, fail-safe fallback to thematic emoji illustration on 404/network error/timeout
 * 3. Lazy loading & performance optimization
 * 4. Semantic alt text and image source attribution
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackEmoji,
  className = '',
  containerClassName = '',
  aspectRatio = 'square',
  sourcePage,
  sourceLabel,
  showBadge = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'wide'
      ? 'aspect-[4/3]'
      : '';

  // If no source is provided or image failed to load, render the clean fallback immediately
  if (!src || error) {
    return (
      <div
        className={`w-full ${aspectClass} rounded-xl bg-white/60 dark:bg-slate-800/60 border-2 border-dashed border-[#1E2A4A]/25 dark:border-slate-600 flex items-center justify-center p-4 transition-transform ${containerClassName}`}
        aria-label={alt}
      >
        <span
          className="text-5xl sm:text-6xl float-slow select-none filter drop-shadow-sm"
          role="img"
          aria-label={alt}
        >
          {fallbackEmoji}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900 border-2 border-[#1E2A4A]/20 dark:border-slate-700 shadow-2xs group ${containerClassName}`}
    >
      {/* Loading Skeleton / Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-amber-50/70 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <span className="text-4xl opacity-40 select-none">{fallbackEmoji}</span>
        </div>
      )}

      {/* Real Product Photograph */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />

      {/* Verified Photo Badge / Attribution link */}
      {showBadge && sourcePage && loaded && (
        <a
          href={sourcePage}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={`Verified Product Photo: ${sourceLabel || 'View Source'}`}
          className="absolute bottom-2 right-2 bg-black/65 hover:bg-black/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-display font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-sm"
        >
          <span>📷</span>
          <span>Verified Photo</span>
        </a>
      )}
    </div>
  );
};

export default ProductImage;
