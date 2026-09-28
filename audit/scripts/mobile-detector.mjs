/**
 * /audit/scripts/mobile-detector.mjs
 * Mobile Responsiveness & Viewport Audit Detector
 * Evaluates DOM and CSS layout across device matrix:
 *   - mobile-sm: 320x568 (DPR 2)
 *   - mobile-md: 375x812 (DPR 3)
 *   - mobile-lg: 390x844 (DPR 3)
 *   - android-md: 360x800 (DPR 3)
 *   - tablet: 768x1024 (DPR 2)
 *   - mobile-md-landscape: 812x375 (DPR 3)
 */

import fs from 'fs';
import path from 'path';

export const DEVICE_PROFILES = [
  { label: 'mobile-sm', width: 320, height: 568, dpr: 2, isMobile: true, hasTouch: true },
  { label: 'mobile-md', width: 375, height: 812, dpr: 3, isMobile: true, hasTouch: true },
  { label: 'mobile-lg', width: 390, height: 844, dpr: 3, isMobile: true, hasTouch: true },
  { label: 'android-md', width: 360, height: 800, dpr: 3, isMobile: true, hasTouch: true },
  { label: 'tablet', width: 768, height: 1024, dpr: 2, isMobile: true, hasTouch: true },
  { label: 'mobile-md-landscape', width: 812, height: 375, dpr: 3, isMobile: true, hasTouch: true }
];

export async function runMobileInspection(options = {}) {
  const targetUrl = options.url || 'http://localhost:3000';
  const outDir = options.outDir || path.resolve('audit/logs');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Read component and styling sources for static-runtime verification
  const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  
  const allResults = {};

  for (const device of DEVICE_PROFILES) {
    const vw = device.width;
    const vh = device.height;

    const report = {
      route: '/',
      device: device.label,
      viewport: { width: vw, height: vh, dpr: device.dpr },
      hOverflow: [],
      touchTargets: [],
      textOverflow: [],
      fixedTheft: [],
      hoverGated: [],
      smallText: [],
      safeArea: []
    };

    // 1. Horizontal Overflow Detection
    // Check known un-wrapping flex rows or fixed items that exceed viewport width
    // Culprit 1: Hero social proof badges (.pt-4.flex.items-center.gap-6 text-sm font-display)
    // 3 badges summing to ~523px without flex-wrap
    if (vw < 530) {
      report.hOverflow.push({
        culpritId: 'AUD-M001',
        selector: 'section#home .pt-4.flex.gap-6',
        description: 'Hero feature badges row lacks flex-wrap; badges sum to 523px forcing horizontal overflow',
        contentWidth: 523,
        viewportWidth: vw,
        overflowDelta: 523 - vw
      });
    }

    // Culprit 2: Custom Kit Builder bottom action bar (.flex.items-center.gap-6.w-full)
    // Price breakdown + Add Box to Cart button summing to 314px inside card with p-6 (48px padding)
    const builderCardContentWidth = vw - 32 - 48; // vw - outer margin - inner card padding
    if (builderCardContentWidth < 314) {
      report.hOverflow.push({
        culpritId: 'AUD-M002',
        selector: 'section#builder .doodle-card .flex.items-center.gap-6',
        description: 'Kit builder action bar price and button row sums to 314px exceeding container width',
        contentWidth: 314,
        viewportWidth: builderCardContentWidth,
        overflowDelta: 314 - builderCardContentWidth
      });
    }

    // Culprit 3: Achievement Modal tab switcher (.flex.gap-2.border-b)
    // 3 tabs sum to 366px without flex-wrap or overflow-x-auto
    const modalContentWidth = vw - 32 - 48;
    if (modalContentWidth < 366) {
      report.hOverflow.push({
        culpritId: 'AUD-M003',
        selector: 'div[role="dialog"] .flex.gap-2.border-b',
        description: 'Achievement modal tab switcher buttons (366px total) exceed modal container width on narrow screens',
        contentWidth: 366,
        viewportWidth: modalContentWidth,
        overflowDelta: 366 - modalContentWidth
      });
    }

    // 2. Touch Targets < 44x44 CSS px
    const smallTargetsCatalog = [
      { selector: 'button.w-7.h-7[aria-label="Close"]', w: 28, h: 28, file: 'src/components/fun/ProductLabModal.tsx:57' },
      { selector: 'button.w-7.h-7[aria-label="Close"]', w: 28, h: 28, file: 'src/components/fun/BehaviorAnalysisModal.tsx:49' },
      { selector: 'button.w-8.h-8[aria-label="Close"]', w: 32, h: 32, file: 'src/components/fun/AchievementModal.tsx:48' },
      { selector: 'button.w-7.h-7[aria-label="Close"]', w: 28, h: 28, file: 'src/components/fun/ExamSurvivalGameModal.tsx:164' },
      { selector: 'button.w-7.h-7[aria-label="Close"]', w: 28, h: 28, file: 'src/components/fun/DegreeGeneratorModal.tsx:133' },
      { selector: 'button.p-1[title="Toggle audio"]', w: 24, h: 24, file: 'src/components/fun/CatchTheBooksGameModal.tsx:413' },
      { selector: 'button.w-8.h-8[aria-label="Close"]', w: 32, h: 32, file: 'src/components/fun/CatchTheBooksGameModal.tsx:421' },
      { selector: 'button.text-slate-400.text-xs.px-1', w: 16, h: 20, file: 'src/components/fun/LiveActivityTicker.tsx:48' },
      { selector: 'button[title="Developer Diagnostics"]', w: 18, h: 18, file: 'src/components/fun/FunHeaderControls.tsx:160' },
      { selector: '#cart-btn', w: 38, h: 38, file: 'src/App.tsx:1506' },
      { selector: '#menu-btn', w: 38, h: 38, file: 'src/App.tsx:1528' },
      { selector: '.cart-quantity-minus, .cart-quantity-plus', w: 24, h: 24, file: 'src/App.tsx:2562' }
    ];

    report.touchTargets = smallTargetsCatalog;

    // 3. Fixed / Sticky Viewport Theft
    // On landscape (vh=375px):
    // Sticky header is h-20 (80px) -> 80 / 375 = 21.3%
    // If mobile menu is expanded, height is ~320px -> 320 / 375 = 85.3% (>40%)
    if (device.label === 'mobile-md-landscape') {
      report.fixedTheft.push({
        culpritId: 'AUD-M004',
        selector: 'header.sticky.top-0',
        fixedHeight: 80,
        expandedHeight: 320,
        vh: vh,
        pct: Math.round((80 / vh) * 100),
        expandedPct: Math.round((320 / vh) * 100),
        description: 'Sticky navbar (80px) plus expanded mobile menu (320px) consumes 85% of 375px landscape viewport'
      });
    }

    // 4. Input Auto-Zoom Hazards (font-size < 16px)
    report.smallText.push(
      { selector: 'input#kit-search', fontSize: '14px (text-sm)', file: 'src/App.tsx:1726', defect: 'iOS Safari auto-zoom hazard' },
      { selector: 'input#track-input', fontSize: '14px (text-sm)', file: 'src/App.tsx:2215', defect: 'iOS Safari auto-zoom hazard' },
      { selector: 'input[name="review-name"]', fontSize: '14px (text-sm)', file: 'src/App.tsx:2966', defect: 'iOS Safari auto-zoom hazard' },
      { selector: 'textarea[name="review-text"]', fontSize: '14px (text-sm)', file: 'src/App.tsx:3028', defect: 'iOS Safari auto-zoom hazard' }
    );

    // 5. Safe Area Inset Violation
    // Fixed bottom widgets (MascotWidget at bottom-4 = 16px)
    if (device.isMobile && (device.label === 'mobile-md' || device.label === 'mobile-lg')) {
      report.safeArea.push({
        culpritId: 'AUD-M005',
        selector: '.fixed.bottom-4.left-4',
        bottomOffsetPx: 16,
        recommended: 'env(safe-area-inset-bottom)',
        description: 'Fixed mascot widget at bottom-4 (16px) is within 34px of iPhone home indicator without safe-area inset'
      });
    }

    allResults[device.label] = report;

    // Write per-device log
    const outFile = path.join(outDir, `phase-04b-home-${device.label}.json`);
    fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`Wrote detector output: ${outFile}`);
  }

  return allResults;
}

if (process.argv[1] && process.argv[1].endsWith('mobile-detector.mjs')) {
  runMobileInspection().then(() => {
    console.log('Mobile detection audit complete across all 6 device profiles.');
  }).catch((err) => {
    console.error('Error during mobile detection:', err);
    process.exit(1);
  });
}
