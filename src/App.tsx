import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FunProvider, useFun } from './lib/fun/funContext';
import { CART_PERSONALITY_MESSAGES } from './lib/fun/constants';
import {
  FunToastContainer,
  AchievementModal,
  BrainBatteryModal,
  BehaviorAnalysisModal,
  DegreeGeneratorModal,
  FuturePredictorModal,
  DevDiagnosticsModal,
  CatchTheBooksGameModal,
  ExamSurvivalGameModal,
  ProductLabModal,
  CompatibilityScannerModal
} from './components/fun';
import { ProductImage } from './components/ProductImage';
import { StudySprintHeader } from './components/StudySprintHeader';
import { WishlistModal } from './components/WishlistModal';
import productImagesData from './data/productImages.json';

interface Product {
  id: string;
  category: 'focus' | 'exam' | 'custom';
  name: string;
  tag: string;
  price: number;
  emoji: string;
  color: string;
  tilt: string;
  bestseller: boolean;
  blurb: string;
  items: string[];
  image?: string | null;
  imageSource?: string | null;
  sourcePage?: string | null;
  imageAlt?: string;
  verified?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  customDetails?: string[];
  image?: string | null;
  imageAlt?: string;
}

interface Order {
  id: string;
  ts: number;
  pay: string;
  name: string;
  total: number;
  items: number;
}

interface BuilderItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  image?: string | null;
  imageSource?: string | null;
  sourcePage?: string | null;
  imageAlt?: string;
  verified?: boolean;
}

interface FunnyReview {
  id: string;
  name: string;
  role: string;
  initials: string;
  tag: string;
  category: 'aesthetic' | 'procrastination' | 'placebo' | 'tears';
  rating: number;
  text: string;
  likes: number;
  tilt: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
}

const DEFAULT_FUNNY_REVIEWS: FunnyReview[] = [
  {
    id: 'rev-1',
    name: 'Kabir D.',
    role: 'Professional Procrastinator · IIT Kharagpur',
    initials: 'KD',
    tag: '🎨 Aesthetic Failure',
    category: 'aesthetic',
    rating: 5,
    text: 'Bought 6 pastel highlighters to study Organic Chem. Ended up color-coding my Spotify playlists and swatching my forearm for 3 hours. Still failed the test, but I looked academically dangerous doing it.',
    likes: 142,
    tilt: 'rotate-[-1deg]',
    badgeBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]',
    badgeText: 'text-[#1E2A4A] dark:text-pink-200',
    avatarBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]'
  },
  {
    id: 'rev-2',
    name: 'Simran R.',
    role: 'Overcaffeinated Med Student · AIIMS',
    initials: 'SR',
    tag: '🧠 Placebo Effect',
    category: 'placebo',
    rating: 5,
    text: 'I unboxed the Deep Focus kit and my GPA immediately jumped +0.4 points before I even wrote anything. The fresh paper smells like academic validation and parental pride.',
    likes: 218,
    tilt: 'rotate-[1deg]',
    badgeBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]',
    badgeText: 'text-[#1E2A4A] dark:text-blue-200',
    avatarBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]'
  },
  {
    id: 'rev-3',
    name: 'Pooja N.',
    role: 'CA Finalist · Mumbai',
    initials: 'PN',
    tag: '🥜 Almonds Unlocked',
    category: 'placebo',
    rating: 5,
    text: 'My desk used to look like a crime scene of empty Maggi bowls and crumpled photocopies. With this doodle planner set, my mom walked in, smiled gently, and handed me soaked almonds instead of scolding me. 100/10.',
    likes: 95,
    tilt: 'rotate-[-0.5deg]',
    badgeBg: 'bg-[#D8F3DC] dark:bg-[#153422]',
    badgeText: 'text-[#1E2A4A] dark:text-emerald-200',
    avatarBg: 'bg-[#D8F3DC] dark:bg-[#153422]'
  },
  {
    id: 'rev-4',
    name: 'Aditya V.',
    role: 'Final Year (Allegedly) · Pune University',
    initials: 'AV',
    tag: '⏱️ 96h Pomodoro Break',
    category: 'procrastination',
    rating: 5,
    text: 'The Pomodoro tracker works so well! You study for 25 mins, and then take a 5-minute break. Unfortunately my break lasted 4 days and I finished two full seasons of anime. Stationery is innocent, I am weak.',
    likes: 310,
    tilt: 'rotate-[0.8deg]',
    badgeBg: 'bg-[#FFF2C6] dark:bg-[#342A16]',
    badgeText: 'text-[#1E2A4A] dark:text-amber-200',
    avatarBg: 'bg-[#FFF2C6] dark:bg-[#342A16]'
  },
  {
    id: 'rev-5',
    name: 'Meera S.',
    role: 'Calculus Survivor · Chennai',
    initials: 'MS',
    tag: '💧 Tear Resistant',
    category: 'tears',
    rating: 5,
    text: 'They claim zero-bleed 100 GSM paper. Can confirm it handles heavy gel pens, but more importantly, it withstood 3 drops of existential 2 AM tears before wrinkling. Premium engineering.',
    likes: 184,
    tilt: 'rotate-[-1.2deg]',
    badgeBg: 'bg-[#E2D9F3] dark:bg-[#2C213D]',
    badgeText: 'text-[#1E2A4A] dark:text-purple-200',
    avatarBg: 'bg-[#E2D9F3] dark:bg-[#2C213D]'
  },
  {
    id: 'rev-6',
    name: 'Rohan T.',
    role: 'Mechanical Engg · Delhi',
    initials: 'RT',
    tag: '📦 Box Hoarder',
    category: 'aesthetic',
    rating: 5,
    text: 'The custom box came with cute cat doodles on the carton. I cannot bring myself to throw the cardboard box away so it is now my official hostel sanctuary for cables and unfinished dreams.',
    likes: 127,
    tilt: 'rotate-[0.6deg]',
    badgeBg: 'bg-[#FFE5D9] dark:bg-[#3B251D]',
    badgeText: 'text-[#1E2A4A] dark:text-orange-200',
    avatarBg: 'bg-[#FFE5D9] dark:bg-[#3B251D]'
  },
  {
    id: 'rev-7',
    name: 'Divya K.',
    role: 'Law Student · NLS Bangalore',
    initials: 'DK',
    tag: '☕ Caffeine Frenzy',
    category: 'tears',
    rating: 5,
    text: "Wrote 30 sticky notes at 3 AM detailing my master syllabus blitzkrieg. Woke up at noon to find one note that just said 'potato' circled in red gel pen 6 times. 10/10 adhesion though, still stuck to my wall.",
    likes: 165,
    tilt: 'rotate-[-0.8deg]',
    badgeBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]',
    badgeText: 'text-[#1E2A4A] dark:text-pink-200',
    avatarBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]'
  },
  {
    id: 'rev-8',
    name: 'Tanmay P.',
    role: 'B.Com Hons · DU',
    initials: 'TP',
    tag: '✍️ Smooth Operator',
    category: 'procrastination',
    rating: 5,
    text: 'The gel pen glides with such zero friction that my pen outran my cognition. I wrote 7 pages of confident nonsense in under 20 minutes. Evaluator gave me 2 marks for handwriting alone.',
    likes: 88,
    tilt: 'rotate-[1.1deg]',
    badgeBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]',
    badgeText: 'text-[#1E2A4A] dark:text-blue-200',
    avatarBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]'
  },
  {
    id: 'rev-9',
    name: 'Zoya F.',
    role: 'Master of Excuses · Ashoka Univ',
    initials: 'ZF',
    tag: '😴 Osmosis Attempt',
    category: 'placebo',
    rating: 5,
    text: 'I slept with the open notebook under my pillow hoping for knowledge absorption by osmosis. Woke up with a crick in my neck and zero formulas remembered. Stationery 10/10, pillow 2/10.',
    likes: 246,
    tilt: 'rotate-[-1deg]',
    badgeBg: 'bg-[#D8F3DC] dark:bg-[#153422]',
    badgeText: 'text-[#1E2A4A] dark:text-emerald-200',
    avatarBg: 'bg-[#D8F3DC] dark:bg-[#153422]'
  }
];

const RANDOM_STUDENT_EXCUSES = [
  {
    name: 'Aryan M.',
    role: 'Thermodynamics Hostage · NIT Trichy',
    tag: '📐 Geometry Chaos',
    category: 'aesthetic' as const,
    text: "Used the pastel ruler to draw neat margins. Ended up creating an intricate 3D labyrinth instead of thermodynamics notes. Showed it to my professor, he sighed and said 'at least use grid paper next time'."
  },
  {
    name: 'Sneha G.',
    role: 'Architecture Sleepless · SPA Delhi',
    tag: '☕ 500mg Caffeine',
    category: 'tears' as const,
    text: "My hand was trembling from energy drinks while using the fine-liner. Created an accidental seismograph reading instead of a floor plan. Jury praised my 'organic parametric wave concept'. Passed!"
  },
  {
    name: 'Vikram K.',
    role: 'Competitive Exam Aspirant · Kota',
    tag: '📚 Neon Beacon',
    category: 'aesthetic' as const,
    text: "Highlighted every single sentence in my textbook because 'everything looked important'. Now my physics book glows in the dark and can be used as an emergency airport runway beacon."
  },
  {
    name: 'Ananya B.',
    role: "Biotech Master's · IISc",
    tag: '⏱️ Procrastination Art',
    category: 'procrastination' as const,
    text: 'Spent 4 hours organizing my sticky notes by color temperature, chromatic frequency, and vibe. Have I studied immunology? No. Is my bulletin board MoMA ready? Absolutely.'
  },
  {
    name: 'Harsh T.',
    role: 'Computer Science Sophomore · Bangalore',
    tag: '🧠 Placebo Miracle',
    category: 'placebo' as const,
    text: 'Switched from VS Code to jotting pseudo-code on the dot-grid pad. My code still has segfaults, but in 0.38mm quick-dry gel ink, the bugs look intentional and poetic.'
  }
];

const RAW_PRODUCTS = [
  // --- FOCUS KITS (1 to 10) ---
  {
    id: 'focus-deep',
    category: 'focus',
    name: 'The Deep Focus Kit',
    tag: 'Bestseller for Long Sessions',
    price: 449,
    emoji: '🧘',
    color: '#CDE7FF',
    tilt: 'rotate-[-1deg]',
    bestseller: true,
    blurb: 'Engineered for zero-distraction 3-hour study blocks and effortless flow state.',
    items: [
      'Pastel Gradient Sticky Notes (300 sheets)',
      'Dual-tip Mild Color Highlighters (5-pack)',
      'A5 Daily Pomodoro Habit Tracker Journal',
      'Ultra-fine 0.38mm Quick-Dry Gel Pens (3-pack)'
    ]
  },
  {
    id: 'focus-pomodoro',
    category: 'focus',
    name: 'The Pomodoro Power Sprint Box',
    tag: '25m Sprint & 5m Break System',
    price: 499,
    emoji: '⏱️',
    color: '#FFF2C6',
    tilt: 'rotate-[1deg]',
    bestseller: true,
    blurb: 'Master the 25/5 interval method with dedicated session tear-off pads and goal cards.',
    items: [
      '60-Day Pomodoro Tear-off Desk Pad',
      'Soft-touch Mechanical Timer Sticker Set',
      'Vibrant Coral & Teal Focus Highlighters',
      'Sprint Goal Check-off Bookmark'
    ]
  },
  {
    id: 'focus-midnight',
    category: 'focus',
    name: 'Midnight Grind Survival Kit',
    tag: 'For 2 AM Cram Sessions',
    price: 579,
    emoji: '🌙',
    color: '#E2ECE9',
    tilt: 'rotate-[-1.5deg]',
    bestseller: false,
    blurb: 'Designed for nocturnal learners fighting fatigue and conquering difficult concepts.',
    items: [
      'Dark-mode Black Paper Journal & Metallic Pens',
      'Glow-in-the-Dark Edge Sticky Flags',
      'Low-Glare Soft Amber Reading Highlighters',
      'Midnight Coffee Mood Doodle Stickers'
    ]
  },
  {
    id: 'focus-minimalist',
    category: 'focus',
    name: 'The Minimalist Flow Starter',
    tag: 'Distraction-Free Study Setup',
    price: 379,
    emoji: '🍵',
    color: '#D8F3DC',
    tilt: 'rotate-[1.5deg]',
    bestseller: false,
    blurb: 'Clean, stripped-down monochrome stationery that completely removes visual clutter.',
    items: [
      'Minimalist Dot Grid Spiral Notebook',
      'Muted Grey & Sage Gel Ink Pens (0.5mm)',
      'Semi-transparent Vellum Sticky Notes',
      'Matte Black Steel Wire Clips (10-pack)'
    ]
  },
  {
    id: 'focus-detox',
    category: 'focus',
    name: 'Dopamine Detox Study Pack',
    tag: 'Lock In Without Phone Addiction',
    price: 429,
    emoji: '📵',
    color: '#FFD6E0',
    tilt: 'rotate-[-0.5deg]',
    bestseller: false,
    blurb: 'Includes physical phone-parking sleeve and tactile tools to crush wandering impulses.',
    items: [
      'Felt Phone-Parking Desk Sleeve',
      'Hourglass Habit Tracker Log Sheet',
      'Tactile Textured Focus Sticky Strips',
      'Urge-Surfing Scratchpad for Distracting Thoughts'
    ]
  },
  {
    id: 'focus-marathon',
    category: 'focus',
    name: 'The 3-Hour Marathon Box',
    tag: 'Sustained Energy & Active Tracking',
    price: 549,
    emoji: '🏃',
    color: '#CDE7FF',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'Built for intense weekend mock test marathons and marathon syllabus coverages.',
    items: [
      'Hydration & Micro-Break Schedule Card',
      '3-Block Subject Rotation Matrix Pad',
      'Quick-Refill Mechanical Pencil & Leads (2B)',
      'Post-it Index Flags in 8 High-Contrast Colors'
    ]
  },
  {
    id: 'focus-zen',
    category: 'focus',
    name: 'Zen Desk Calming Study Kit',
    tag: 'Soothing Pastel Tones & Mindful Notes',
    price: 459,
    emoji: '🪷',
    color: '#FFE5D9',
    tilt: 'rotate-[-1deg]',
    bestseller: false,
    blurb: 'Relieve pre-study anxiety with relaxing pastel tones and breathing prompt cards.',
    items: [
      'Pastel Lavender & Mint Gel Ink Fineliners',
      'Calming 4-7-8 Breathing Desk Card',
      'Aesthetic Washi Tape in Calming Wave Motifs',
      'Undated Daily Gratitude & Target Journal'
    ]
  },
  {
    id: 'focus-binaural',
    category: 'focus',
    name: 'Binaural Beats Silent Study Set',
    tag: 'Silent Desk Tools for Library Grinds',
    price: 399,
    emoji: '🎧',
    color: '#E8D7FF',
    tilt: 'rotate-[0.5deg]',
    bestseller: false,
    blurb: 'Zero-click silent pens, noiseless flip notebooks, and smooth gliding highlighters.',
    items: [
      'Silent Click Quick-Dry Gel Pens (3-pack)',
      'Noiseless Soft-Turn Wirebound Notepad',
      'Vibration-Damping Silicone Pen Grips (4x)',
      'Color-Coded Audio Track Study Log'
    ]
  },
  {
    id: 'focus-habit',
    category: 'focus',
    name: 'Habit Mastery & Daily Sprint Box',
    tag: 'Daily Micro-Habits & Consistency',
    price: 469,
    emoji: '📈',
    color: '#FFF2C6',
    tilt: 'rotate-[-1.5deg]',
    bestseller: false,
    blurb: 'Turn irregular studying into an automatic daily habit with gamified streak cards.',
    items: [
      '100-Day Streak Grid Poster (A3 size)',
      'Mini Star & Check Gold Foil Stickers (200x)',
      'A6 Pocket Daily Target Pocket Notepad',
      'Habit Stacking Prompt & Execution Guide'
    ]
  },
  {
    id: 'focus-reset',
    category: 'focus',
    name: 'Sunday Weekly Reset Kit',
    tag: 'Plan, Declutter & Schedule Ahead',
    price: 419,
    emoji: '🌿',
    color: '#D8F3DC',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'Clear mental fog every Sunday evening and enter Monday with crystal clarity.',
    items: [
      'Weekly Master Planner with Timeboxing Grid',
      'Subject Syllabus Coverage Roadmap Sheet',
      'Prioritization Matrix (Eisenhower) Sticky Pad',
      'Desk Clean-Up Checklist Card'
    ]
  },

  // --- EXAM KITS (11 to 20) ---
  {
    id: 'exam-sprint',
    category: 'exam',
    name: 'The Final Exam Sprint Kit',
    tag: 'Crunch Time Savior',
    price: 549,
    emoji: '⭐',
    color: '#FFD6E0',
    tilt: 'rotate-[1deg]',
    bestseller: true,
    blurb: 'Everything you need to conquer revision week without panic or tears.',
    items: [
      'Flashcards Ring Deck (150 color-coded cards)',
      'Mistake Notebook & Formula Summary Journal',
      'High-Yield Sticky Flags & Chapter Index Tabs',
      'Motivational Doodle Stickers Sheet'
    ]
  },
  {
    id: 'exam-memory',
    category: 'exam',
    name: 'The Flashcard & Memory Box',
    tag: 'Active Recall Champ',
    price: 399,
    emoji: '🧠',
    color: '#FFF2C6',
    tilt: 'rotate-[-1deg]',
    bestseller: true,
    blurb: 'Retain 2x more definitions, formulas, and vocabulary with Leitner spaced repetition.',
    items: [
      '200 Heavy-weight Revision Cards with Ring',
      'Leitner 3-Box Spaced Repetition Divider Set',
      'Waterproof Gel Marker for Card Note Taking',
      'Key Formula Pocket Companion Sleeve'
    ]
  },
  {
    id: 'exam-neet',
    category: 'exam',
    name: 'NEET & Bio High-Yield Revision Kit',
    tag: 'Diagram & Anatomy Stickies',
    price: 649,
    emoji: '🧬',
    color: '#D8F3DC',
    tilt: 'rotate-[1.5deg]',
    bestseller: true,
    blurb: 'Crafted specifically for medical aspirants memorizing NCERT biology diagrams & cycles.',
    items: [
      'Transparent Anatomy Overlay Sticky Sheets (50x)',
      'NCERT Chapter-Wise Revision Index Tabs',
      'Dual-Color Medical Highlighting Duo (Pink/Cyan)',
      'Mnemonics & Cycle Summary Flashcard Ring'
    ]
  },
  {
    id: 'exam-jee',
    category: 'exam',
    name: 'JEE & STEM Formula Mastery Pack',
    tag: 'Quick Reference Sheets & Grids',
    price: 599,
    emoji: '📐',
    color: '#CDE7FF',
    tilt: 'rotate-[-1.5deg]',
    bestseller: false,
    blurb: 'Precision coordinate grid paper, theorem tabs, and rapid derivation sheets.',
    items: [
      'Isometric & Coordinate Grid Tear Pads',
      'Formula Derivation Foldable Accordion Sheets',
      '0.3mm Needle-point Mechanical Drafting Pencil',
      'Tear-Proof Math Symbol & Unit Sticky Strips'
    ]
  },
  {
    id: 'exam-upsc',
    category: 'exam',
    name: 'UPSC & Civil Services Mega Dossier',
    tag: 'Multi-Color High-Yield Index Flags',
    price: 799,
    emoji: '🏛️',
    color: '#E8D7FF',
    tilt: 'rotate-[0.5deg]',
    bestseller: true,
    blurb: 'High-volume syllabus organization for GS papers, current affairs, and optional notes.',
    items: [
      '12-Divider High-Capacity Subject Folder',
      '1,000 Morandi Repositionable Index Arrow Flags',
      'Editorial Synthesis & Mains Answer Writing Grid',
      'Government Scheme Key Fact Flashcards'
    ]
  },
  {
    id: 'exam-panic',
    category: 'exam',
    name: 'Last-Minute Panic Savior',
    tag: '24-Hour Cramming Rescue',
    price: 349,
    emoji: '🚨',
    color: '#FFD6E0',
    tilt: 'rotate-[-1deg]',
    bestseller: false,
    blurb: 'Down to the wire? Bulletproof cheat-sheet pads and rapid summary templates.',
    items: [
      'Ultra-compact 1-Page Summary Canvas Pad',
      'Fluorescent Neon Quick-Warning Highlighters',
      '10-Point Crucial Question Sticky Cards',
      'Emergency Focus Mindset Pocket Guide'
    ]
  },
  {
    id: 'exam-mistake',
    category: 'exam',
    name: 'Mistake Log & PYQ Analysis Kit',
    tag: 'Error Tracking & PYQ Journal',
    price: 489,
    emoji: '🔍',
    color: '#FFE5D9',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'Never repeat the same error twice across previous year question papers and mocks.',
    items: [
      'Hardcover "Why I Got This Wrong" Analysis Journal',
      'Red Penalty & Green Correction Fine Pens',
      'Silly Mistake vs Concept Gap Tag Stickers',
      'Mock Score Tracking & Percentile Graph Sheet'
    ]
  },
  {
    id: 'exam-law',
    category: 'exam',
    name: 'Law & Case Citation Deck',
    tag: 'Color-Coded Article & Citation Tabs',
    price: 529,
    emoji: '⚖️',
    color: '#FFF2C6',
    tilt: 'rotate-[-0.5deg]',
    bestseller: false,
    blurb: 'Keep landmark judgments, constitutional articles, and statutes organized at lightning speed.',
    items: [
      'Numbered Section Index Tabs (1–200)',
      'Bare Act Companion Sticky Note Strips',
      'Case Law Ratio Decidendi Briefing Cards',
      'Highlighter Safe for Ultra-Thin Bible Paper'
    ]
  },
  {
    id: 'exam-blurting',
    category: 'exam',
    name: 'Active Recall Blurting Pack',
    tag: 'Blank Brain-Dump Revision Pads',
    price: 389,
    emoji: '💡',
    color: '#D8F3DC',
    tilt: 'rotate-[1.5deg]',
    bestseller: false,
    blurb: 'The viral science-backed blurting technique: read, close book, and brain-dump on paper.',
    items: [
      '100-Sheet Oversized Blurting Canvas Pad (A4)',
      'Two-Tone Correction & Verification Markers',
      'Active Recall Confidence Level Checklist',
      'Concept Gap Diagnostic Grid'
    ]
  },
  {
    id: 'exam-viva',
    category: 'exam',
    name: 'Oral Exam & Viva Defense Kit',
    tag: 'Presentation Cue Sheets & Prompts',
    price: 429,
    emoji: '🎙️',
    color: '#CDE7FF',
    tilt: 'rotate-[-1deg]',
    bestseller: false,
    blurb: 'Conquer project presentations, board vivas, and oral thesis evaluations.',
    items: [
      'Heavyweight Palm-Sized Presentation Cue Cards',
      'Anticipated Question & Defense Answer Worksheets',
      'Speech Pacing & Confidence Time Tracker',
      'Key Takeaway Ring Binder Clip'
    ]
  },

  // --- CUSTOM & AESTHETIC BUNDLES (21 to 30) ---
  {
    id: 'custom-desk',
    category: 'custom',
    name: 'The Aesthetic Desk Starter Kit',
    tag: 'Clean & Aesthetic Vibes',
    price: 499,
    emoji: '✨',
    color: '#D8F3DC',
    tilt: 'rotate-[-1.5deg]',
    bestseller: true,
    blurb: 'Make your desk look like a cozy Pinterest study vlog and stay organized.',
    items: [
      'Minimalist Weekly Undated Desk Planner Pad',
      'Pastel Aesthetic Highlighter Set (6-pack)',
      'Transparent Sticky Notes Pad (50 sheets)',
      'Wire Binder Clips & Aesthetic Washi Tape Duo'
    ]
  },
  {
    id: 'custom-pastel',
    category: 'custom',
    name: 'Pastel Dream Stationery Box',
    tag: 'Soft Morandi & Pastel Highlighters Duo',
    price: 479,
    emoji: '🌸',
    color: '#FFD6E0',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'Milky pastel inks that will not strain your eyes during 8-hour marathon study sessions.',
    items: [
      '6-Piece Soft Milk Pastel Highlighter Set',
      'Pastel Border Memo Notepads (3 pads)',
      'Coordinating Color Page Flag Bookmarks',
      'Pastel Cloud Correction Tape Roller'
    ]
  },
  {
    id: 'custom-vintage',
    category: 'custom',
    name: 'Retro Vintage Scholar Trunk',
    tag: 'Kraft Paper, Wax Seals & Brass Clips',
    price: 599,
    emoji: '📜',
    color: '#FFE5D9',
    tilt: 'rotate-[-1deg]',
    bestseller: false,
    blurb: 'Old-school dark academic aesthetics with authentic unbleached kraft paper.',
    items: [
      'Antique Brown Kraft Paper Dotted Notebook',
      'Solid Brass Vintage Bookmark Clips (4x)',
      'Sepia & Walnut Gel Inks (0.5mm)',
      'Self-Adhesive Wax Seal Emblem Stickers'
    ]
  },
  {
    id: 'custom-bujo',
    category: 'custom',
    name: 'Bullet Journaling & Doodling Kit',
    tag: 'Dotted 120 GSM Journal & Pens',
    price: 519,
    emoji: '🎨',
    color: '#E8D7FF',
    tilt: 'rotate-[1.5deg]',
    bestseller: false,
    blurb: 'Heavyweight bleed-proof paper for students who love hand-drawn trackers and notes.',
    items: [
      'A5 Hardcover Dotted Journal (120 GSM, 160 pages)',
      'Fine-Liner Pens Set (0.1mm, 0.3mm, 0.5mm)',
      'Geometric Study Template Stencil Ruler',
      'Minimalist Dotted Washi Tape Strip'
    ]
  },
  {
    id: 'custom-kawaii',
    category: 'custom',
    name: 'Cute Kawaii Mascot Study Bundle',
    tag: 'Animal Tabs & Shaped Notes',
    price: 469,
    emoji: '🐻',
    color: '#FFF2C6',
    tilt: 'rotate-[-0.5deg]',
    bestseller: false,
    blurb: 'Adorably cute animal stationery that brings instant serotonin to heavy homework loads.',
    items: [
      'Die-Cut Kawaii Animal Shaped Sticky Notes (4 pads)',
      'Pastel Paw Print Correction Tape & Eraser Duo',
      'Cute Mascot Gel Ink Pens (Set of 4)',
      'Holographic Study Reward Stickers'
    ]
  },
  {
    id: 'custom-waterproof',
    category: 'custom',
    name: 'Transparent & Waterproof Study Pack',
    tag: 'See-Through Notes & Pens',
    price: 389,
    emoji: '💧',
    color: '#CDE7FF',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'Annotate expensive textbooks and library books without leaving any permanent ink marks.',
    items: [
      'Clear Waterproof PET Sticky Notes (100 sheets)',
      'Fast-Drying Alcohol Ink Micro-Tip Markers',
      'Smudge-Proof Transparent Highlighter Strips',
      'Water-Resistant Zipper Mesh Pouch'
    ]
  },
  {
    id: 'custom-washi',
    category: 'custom',
    name: 'Washi Tape & Aesthetic Collage Kit',
    tag: '10-Roll Morandi & Grid Tapes',
    price: 329,
    emoji: '🎀',
    color: '#FFD6E0',
    tilt: 'rotate-[-1.5deg]',
    bestseller: false,
    blurb: 'Frame summary cards, color-code subjects, and pin mind-maps to your study board.',
    items: [
      '10 Rolls of Japanese Paper Washi Tape (Mix Grid & Pastels)',
      'Mini Washi Tape Dispenser & Cutter',
      'Aesthetic Photo Frame Corner Stickers',
      'Grid Paper Color-Coding Index Sheet'
    ]
  },
  {
    id: 'custom-cornell',
    category: 'custom',
    name: 'Ultimate Cornell Note-Taking Suite',
    tag: 'Cornell Ruling Notebooks',
    price: 529,
    emoji: '📋',
    color: '#D8F3DC',
    tilt: 'rotate-[1deg]',
    bestseller: false,
    blurb: 'The gold-standard university lecture system: cues, notes, and instant summary boxes.',
    items: [
      'Two Spiral-bound Cornell Grid Notebooks (80 pages each)',
      'Cue-Column Highlighter Markers (Dual-Tone)',
      'Chapter Summary Header Stamp Sticker Sheet',
      'Cornell Quick-Method Guide Book'
    ]
  },
  {
    id: 'custom-pocket',
    category: 'custom',
    name: 'Compact Pocket Study Sprint Kit',
    tag: 'Commute & Bus Flashcards',
    price: 299,
    emoji: '🎒',
    color: '#FFE5D9',
    tilt: 'rotate-[-1deg]',
    bestseller: false,
    blurb: 'Turn metro rides, bus commutes, and cafeteria queues into 10-minute revision wins.',
    items: [
      'Pocket-Sized Flip Ring Flashcard Deck (100 cards)',
      'Mini Retractable 4-in-1 Multicolor Pen',
      'Slip-Proof Silicone Bookmark Strap',
      'Pocket Vocabulary & Formula Quick Sleeve'
    ]
  },
  {
    id: 'custom-topper',
    category: 'custom',
    name: 'Topper Deluxe Complete Arsenal',
    tag: 'Complete 12-Piece All-Star Vault',
    price: 899,
    emoji: '👑',
    color: '#FFF2C6',
    tilt: 'rotate-[0.5deg]',
    bestseller: true,
    blurb: 'The ultimate gift box packed with our top-selling items from every single category.',
    items: [
      'Hardcover Study Sprint Master Planner',
      'Full 5-Piece Morandi Pastel Highlighter Set',
      '200-Card Spaced Repetition Ring Deck',
      'Transparent Sticky Notes Pad (50 sheets)',
      'Mistake Analysis Notebook & Fine Gel Pens'
    ]
  }
];

const RAW_BUILDER_ITEMS = [
  { id: 'b1', name: 'Pastel Gradient Sticky Notes', price: 79, emoji: '📝', category: 'Notes' },
  { id: 'b2', name: 'Dual-tip Mild Highlighters (5pc)', price: 129, emoji: '🖍️', category: 'Pens' },
  { id: 'b3', name: 'Pomodoro Daily Planner Journal', price: 149, emoji: '⏱️', category: 'Planners' },
  { id: 'b4', name: '100 Flashcards Ring Deck', price: 89, emoji: '📇', category: 'Study Tools' },
  { id: 'b5', name: 'Transparent Sticky Notes Pad', price: 69, emoji: '🔍', category: 'Notes' },
  { id: 'b6', name: '0.38mm Quick-Dry Pens (3pc)', price: 89, emoji: '✒️', category: 'Pens' },
  { id: 'b7', name: 'Cute Washi Tape Duo (Grid+Pastel)', price: 59, emoji: '🎀', category: 'Aesthetic' },
  { id: 'b8', name: 'Mistake Analysis Notebook', price: 119, emoji: '📖', category: 'Planners' },
];

const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const imgInfo = (productImagesData as Record<string, any>)[p.id];
  return {
    ...p,
    category: p.category as 'focus' | 'exam' | 'custom',
    image: imgInfo?.image || null,
    imageSource: imgInfo?.imageSource || null,
    sourcePage: imgInfo?.sourcePage || null,
    imageAlt: imgInfo?.imageAlt || `${p.name} - StudySprint stationery`,
    verified: imgInfo?.verified || false
  };
});

const BUILDER_ITEMS: BuilderItem[] = RAW_BUILDER_ITEMS.map((b) => {
  const imgInfo = (productImagesData as Record<string, any>)[b.id];
  return {
    ...b,
    image: imgInfo?.image || null,
    imageSource: imgInfo?.imageSource || null,
    sourcePage: imgInfo?.sourcePage || null,
    imageAlt: imgInfo?.imageAlt || `${b.name} - StudySprint custom kit item`,
    verified: imgInfo?.verified || false
  };
});

const TRACK_STAGES = [
  { icon: '✅', label: 'Order Confirmed' },
  { icon: '📦', label: 'Packed' },
  { icon: '🚚', label: 'Courier Dispatched' },
  { icon: '🛣️', label: 'Out for Delivery' },
  { icon: '📍', label: 'Delivered' }
];

function AppContent() {
  const {
    funMode,
    addXP,
    unlockAchievement,
    discoverEasterEgg,
    recordClick,
    recordProductInspection,
    openModal,
    showFunToast
  } = useFun();

  // Easter egg & fun states
  const [logoClicks, setLogoClicks] = useState(0);
  const [fictionalTrackingStep, setFictionalTrackingStep] = useState<number>(-1);

  // Theme state: initialized from localStorage or system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ss-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPopping, setCartPopping] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // Funny Reviews State
  const [reviews, setReviews] = useState<FunnyReview[]>(() => {
    try {
      const saved = localStorage.getItem('ss-funny-reviews');
      return saved ? JSON.parse(saved) : DEFAULT_FUNNY_REVIEWS;
    } catch {
      return DEFAULT_FUNNY_REVIEWS;
    }
  });
  const [reviewFilter, setReviewFilter] = useState<'all' | 'aesthetic' | 'procrastination' | 'placebo' | 'tears'>('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ss-liked-reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review Submission Form
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    tag: '🎨 Aesthetic Failure',
    category: 'aesthetic' as 'aesthetic' | 'procrastination' | 'placebo' | 'tears',
    text: '',
  });

  // Save reviews and likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ss-funny-reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ss-liked-reviews', JSON.stringify(likedReviews));
    } catch {
      // ignore
    }
  }, [likedReviews]);

  const toggleLikeReview = (id: string) => {
    setLikedReviews((prev) => {
      const isLiked = !!prev[id];
      const next = { ...prev, [id]: !isLiked };
      setReviews((rList) =>
        rList.map((r) =>
          r.id === id ? { ...r, likes: r.likes + (isLiked ? -1 : 1) } : r
        )
      );
      return next;
    });
  };

  const rollRandomExcuse = () => {
    const randomItem = RANDOM_STUDENT_EXCUSES[Math.floor(Math.random() * RANDOM_STUDENT_EXCUSES.length)];
    setReviewForm({
      name: randomItem.name,
      role: randomItem.role,
      tag: randomItem.tag,
      category: randomItem.category,
      text: randomItem.text,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      showToast('⚠️ Please provide at least your alter-ego name and review!');
      return;
    }

    const words = reviewForm.name.trim().split(' ');
    const initials = (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase() || 'XD';

    const tilts = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[0.5deg]', 'rotate-[-0.5deg]'];
    const randomTilt = tilts[Math.floor(Math.random() * tilts.length)];

    const colorPairs = [
      { badgeBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]', badgeText: 'text-[#1E2A4A] dark:text-pink-200', avatarBg: 'bg-[#FFD6E0] dark:bg-[#381B2B]' },
      { badgeBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]', badgeText: 'text-[#1E2A4A] dark:text-blue-200', avatarBg: 'bg-[#CDE7FF] dark:bg-[#172E4C]' },
      { badgeBg: 'bg-[#D8F3DC] dark:bg-[#153422]', badgeText: 'text-[#1E2A4A] dark:text-emerald-200', avatarBg: 'bg-[#D8F3DC] dark:bg-[#153422]' },
      { badgeBg: 'bg-[#FFF2C6] dark:bg-[#342A16]', badgeText: 'text-[#1E2A4A] dark:text-amber-200', avatarBg: 'bg-[#FFF2C6] dark:bg-[#342A16]' },
      { badgeBg: 'bg-[#E2D9F3] dark:bg-[#2C213D]', badgeText: 'text-[#1E2A4A] dark:text-purple-200', avatarBg: 'bg-[#E2D9F3] dark:bg-[#2C213D]' },
      { badgeBg: 'bg-[#FFE5D9] dark:bg-[#3B251D]', badgeText: 'text-[#1E2A4A] dark:text-orange-200', avatarBg: 'bg-[#FFE5D9] dark:bg-[#3B251D]' }
    ];
    const pickedTheme = colorPairs[Math.floor(Math.random() * colorPairs.length)];

    const newRev: FunnyReview = {
      id: 'rev-' + Date.now(),
      name: reviewForm.name.trim(),
      role: reviewForm.role.trim() || 'Professional Procrastinator',
      initials,
      tag: reviewForm.tag.trim() || '🎓 Dubious Claim',
      category: reviewForm.category,
      rating: 5,
      text: reviewForm.text.trim(),
      likes: 1,
      tilt: randomTilt,
      ...pickedTheme
    };

    setReviews((prev) => [newRev, ...prev]);
    setReviewModalOpen(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast('Review submitted! Thank you. ✨');
    setReviewForm({
      name: '',
      role: '',
      tag: '🎨 Aesthetic Failure',
      category: 'aesthetic',
      text: '',
    });
  };

  // Trigger subtle tactile pop animation on cart icon
  const triggerCartPop = () => {
    setCartPopping(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCartPopping(true);
      });
    });
  };

  // Synchronize theme to <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ss-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper for product card pastel backgrounds in dark mode
  const getProductCardBg = (lightColor: string) => {
    if (theme !== 'dark') return lightColor;
    switch (lightColor.toUpperCase()) {
      case '#CDE7FF': // Focus blue
        return '#14233D';
      case '#FFF2C6': // Amber / sprint yellow
        return '#252114';
      case '#E2ECE9': // Midnight sage
        return '#142523';
      case '#FFE5D9': // Vintage peach
        return '#281C18';
      case '#E8D7FF': // Bujo lavender
        return '#211833';
      case '#FFD6E0': // Washi pink
        return '#291623';
      case '#D8F3DC': // Cornell mint
        return '#12271C';
      default:
        return '#1A2234';
    }
  };

  // Cart & Orders state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ss-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'f1',
        name: 'Deep Focus Kit',
        price: 499,
        emoji: '🎯',
        quantity: 2,
        image: (productImagesData as Record<string, any>)['f1']?.image || null
      },
      {
        id: 'f2',
        name: 'Pomodoro Power Pack',
        price: 349,
        emoji: '⏱️',
        quantity: 2,
        image: (productImagesData as Record<string, any>)['f2']?.image || null
      }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ss-orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State persisted in localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ss-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ss-wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const isWishlisted = (id: string) => wishlist.some((item) => item.id === id);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      addXP(25, 'Saved study kit to wishlist');
      showToast(`💖 Saved "${product.name}" to Wishlist! (+25 XP)`);
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 }
      });
    }
  };

  const removeFromWishlist = (id: string) => {
    const target = wishlist.find((item) => item.id === id);
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      showToast(`Removed "${target.name}" from Wishlist`);
    }
  };

  const handleAddWishlistToCart = (product: any) => {
    addToCart(product);
    showToast(`🛒 Added "${product.name}" to Cart!`);
  };

  const handleMoveAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((p) => {
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.id === p.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [
          ...prev,
          {
            id: p.id,
            name: p.name,
            price: p.price,
            emoji: p.emoji,
            quantity: 1,
            image: p.image || null,
            imageAlt: p.imageAlt
          }
        ];
      });
    });
    triggerCartPop();
    showToast(`🛒 Moved ${wishlist.length} item(s) from Wishlist to Cart!`);
    setWishlist([]);
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared');
  };

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'focus' | 'exam' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'bestsellers'>('featured');

  // Custom Builder State
  const [selectedBuilderIds, setSelectedBuilderIds] = useState<string[]>(['b1', 'b2', 'b4']);

  // Checkout State
  const [ckName, setCkName] = useState('');
  const [ckAddress, setCkAddress] = useState('');
  const [ckPin, setCkPin] = useState('');
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiPaid, setUpiPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order tracking state
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const trackingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('ss-cart', JSON.stringify(cart));
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('ss-orders', JSON.stringify(orders));
  }, [orders]);

  // Set default placeholder for track order input if order exists
  useEffect(() => {
    if (orders.length > 0 && !trackInput) {
      setTrackInput(orders[0].id);
    }
  }, [orders]);

  // Clean Notification utility routed through toast queue
  const showToast = (msg: string) => {
    showFunToast({
      title: '',
      description: msg,
      emoji: '🛍️',
      type: 'secret'
    });
  };

  // Cart helper calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 40;
  const cartTotal = cartSubtotal + shippingFee;

  // Keyboard shortcut listener to close any open modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (checkoutOpen) setCheckoutOpen(false);
        else if (reviewModalOpen) setReviewModalOpen(false);
        else if (infoModalData) setInfoModalData(null);
        else if (successModalOpen) setSuccessModalOpen(false);
        else if (cartOpen) setCartOpen(false);
        else if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkoutOpen, reviewModalOpen, infoModalData, successModalOpen, cartOpen, mobileMenuOpen]);

  // Search query Easter Egg trigger
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q === 'procrastination' || q === 'coffee' || q === 'exam') {
      discoverEasterEgg('search_procrastination');
    }
  }, [searchQuery, discoverEasterEgg]);

  // Add to cart handler
  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    triggerCartPop();
    recordClick('add-to-bag');
    addXP(25, `Packed ${product.name} into study bag`);

    if (cartCount + 1 >= 5) {
      unlockAchievement('cart_overthinker');
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          quantity: 1,
          image: product.image,
          imageAlt: product.imageAlt
        }
      ];
    });
    showToast(`Added ${product.name} to cart! 🛍️`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Builder calculation
  const builderSelectedItems = BUILDER_ITEMS.filter((item) => selectedBuilderIds.includes(item.id));
  const rawBuilderTotal = builderSelectedItems.reduce((acc, item) => acc + item.price, 0);
  // Special deal: 5+ items locks in flat ₹499
  const isBuilderDealUnlocked = builderSelectedItems.length >= 5;
  const finalBuilderPrice = isBuilderDealUnlocked ? 499 : rawBuilderTotal;

  const toggleBuilderItem = (id: string) => {
    recordClick('builder-toggle');
    setSelectedBuilderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addCustomBoxToCart = () => {
    if (builderSelectedItems.length === 0) {
      showToast('Pick at least one item for your custom box! ✏️');
      return;
    }
    triggerCartPop();
    addXP(35, 'Customized personalized stationery box');
    if (builderSelectedItems.length >= 5) {
      unlockAchievement('cart_overthinker');
    }
    const customId = `custom-box-${Date.now()}`;
    const firstBuilderWithImg = builderSelectedItems.find((i) => i.image);
    const newItem: CartItem = {
      id: customId,
      name: `Custom Study Box (${builderSelectedItems.length} items)`,
      price: finalBuilderPrice,
      emoji: '🛠️',
      quantity: 1,
      customDetails: builderSelectedItems.map((i) => `${i.emoji} ${i.name}`),
      image: firstBuilderWithImg?.image || null,
      imageAlt: 'Custom Study Sprint Box'
    };
    setCart((prev) => [...prev, newItem]);
    showToast('Custom kit packed into cart! 🎁');
    setCartOpen(true);
  };

  // Filtered and Sorted Products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeFilter === 'all' ? true : p.category === activeFilter;
    const searchHaystack = `${p.name} ${p.tag} ${p.blurb} ${p.items.join(' ')}`.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' || searchHaystack.includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'bestsellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    return 0;
  });

  // Calculate simulated stage based on timestamp (1 stage / minute)
  const getOrderStage = (timestamp: number) => {
    const mins = Math.floor((Date.now() - timestamp) / 60000);
    return Math.min(4, Math.max(0, mins));
  };

  // Order tracking handler with playful sequence
  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    trackOrderById(trackInput);
  };

  const trackOrderById = (idRaw: string) => {
    const cleanId = (idRaw || '').toUpperCase().trim();
    setTrackInput(cleanId);
    setTrackSearched(true);
    const found = orders.find((o) => o.id === cleanId);
    setTrackedOrder(found || null);

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    if (funMode) {
      setFictionalTrackingStep(0);
      let step = 0;
      trackingIntervalRef.current = setInterval(() => {
        step += 1;
        if (step >= 6) {
          if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
            trackingIntervalRef.current = null;
          }
          setFictionalTrackingStep(6);
        } else {
          setFictionalTrackingStep(step);
        }
      }, 300);
    } else {
      setFictionalTrackingStep(6);
    }

    const deliverySec = document.getElementById('delivery');
    if (deliverySec) {
      deliverySec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Checkout handling
  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty! Add some stationery first 📚');
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const simulateUpiPayment = () => {
    setUpiPaid(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFC93C', '#FFD6E0', '#D8F3DC', '#CDE7FF']
    });
    showToast('Simulated UPI payment received! 🎉');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (payMethod === 'UPI' && !upiPaid) {
      showToast('Complete the UPI payment first 📲 (demo)');
      return;
    }

    const newId = `SS${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newId,
      ts: Date.now(),
      pay: payMethod,
      name: ckName,
      total: cartTotal,
      items: cartCount
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderId(newId);
    setTrackInput(newId);

    // Reset checkout & cart
    setCart([]);
    setCheckoutOpen(false);
    setUpiPaid(false);

    // Open Success Modal
    setSuccessModalOpen(true);
    confetti({
      particleCount: 220,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#FFC93C', '#FFD6E0', '#D8F3DC', '#CDE7FF']
    });
  };

  // Info Modals (FAQ, Contact, Shipping)
  const openInfo = (type: 'contact' | 'faq' | 'shipping') => {
    if (type === 'contact') {
      setInfoModalData({
        title: '📬 Contact Us',
        content: (
          <div className="space-y-4 font-body">
            <p className="text-base font-semibold text-[#1E2A4A] dark:text-slate-100">We reply fast — promise! ⚡</p>
            <div className="bg-[#FFFDF7] dark:bg-[#1E293B] p-4 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 space-y-2 text-[#1E2A4A] dark:text-slate-200">
              <p>📧 <b>Email:</b> hello@studysprint.in</p>
              <p>📱 <b>Helpline:</b> +91 98765 43210 (10am–8pm IST)</p>
              <p>📍 <b>Dispatch Hub:</b> StudySprint HQ, Indiranagar, Bangalore, KA - 560038</p>
            </div>
            <p className="font-hand text-xl text-center text-[#1E2A4A]/80 dark:text-slate-300">
              or slide into our DMs on Instagram <span className="text-pink-500">@studysprint.in</span> 💖
            </p>
          </div>
        )
      });
    } else if (type === 'faq') {
      setInfoModalData({
        title: '❓ Frequently Asked Questions',
        content: (
          <div className="space-y-3 font-body">
            <details className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 text-[#1E2A4A] dark:text-slate-100" open>
              <summary className="faq-q">What is inside each StudySprint kit?</summary>
              <p className="faq-a text-sm opacity-85 dark:text-slate-300">Each kit is carefully curated for specific grind modes (long sessions, exam cramming, habit tracking). The exact checklist is displayed right on each product card.</p>
            </details>
            <details className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 text-[#1E2A4A] dark:text-slate-100">
              <summary className="faq-q">Can I customize my study kit?</summary>
              <p className="faq-a text-sm opacity-85 dark:text-slate-300">Yes! Check out our Custom Kit Builder on this page. Pick any items you need — when you pick 5 or more items, you unlock our flat ₹499 bundle deal!</p>
            </details>
            <details className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 text-[#1E2A4A] dark:text-slate-100">
              <summary className="faq-q">How long does shipping take?</summary>
              <p className="faq-a text-sm opacity-85 dark:text-slate-300">Orders are dispatched within 24 hours. Delivery takes 2–5 business days across India with real-time tracking.</p>
            </details>
            <details className="bg-white dark:bg-[#1E293B] p-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 text-[#1E2A4A] dark:text-slate-100">
              <summary className="faq-q">Do you offer refunds or replacements?</summary>
              <p className="faq-a text-sm opacity-85 dark:text-slate-300">Any damaged or incorrect item will be replaced immediately or refunded in full within 7 days of delivery — no questions asked.</p>
            </details>
          </div>
        )
      });
    } else if (type === 'shipping') {
      setInfoModalData({
        title: '🚚 Shipping & Delivery Policy',
        content: (
          <div className="space-y-4 font-body leading-relaxed text-[#1E2A4A] dark:text-slate-200">
            <div className="bg-[#D8F3DC] dark:bg-[#133020] p-4 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-400 text-[#1E2A4A] dark:text-emerald-100">
              <p className="font-display font-semibold text-base mb-1">🎉 FREE Shipping on all orders over ₹500!</p>
              <p className="text-sm opacity-80 dark:text-emerald-200/80">For orders under ₹500, a flat nominal courier fee of ₹40 is added at checkout.</p>
            </div>
            <ul className="space-y-2 text-sm text-[#1E2A4A] dark:text-slate-200">
              <li className="flex items-start gap-2"><span>📦</span> <b>Same-Day/24h Dispatch:</b> Packed with bubble-wrap & doodle sticker freebies.</li>
              <li className="flex items-start gap-2"><span>🚚</span> <b>Transit Time:</b> Metro cities: 2–3 days; Rest of India: 3–5 days.</li>
              <li className="flex items-start gap-2"><span>📱</span> <b>SMS & Web Tracking:</b> Track your shipment live directly in our Delivery section.</li>
              <li className="flex items-start gap-2"><span>↩️</span> <b>7-Day Easy Returns:</b> Return or exchange stress-free if anything isn&apos;t 100% perfect.</li>
            </ul>
          </div>
        )
      });
    }
  };

  return (
    <div className="min-h-screen doodle-pattern text-[#1E2A4A] dark:text-[#F1F5F9] flex flex-col font-body transition-colors duration-200">
      {/* ⚡ REDESIGNED STUDYSPRINT MOBILE-FIRST HEADER (Sections A, B, C, D) */}
      <StudySprintHeader
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={cartCount}
        cartPopping={cartPopping}
        setCartOpen={setCartOpen}
        setCartPopping={setCartPopping}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setWishlistOpen(true)}
        onLogoClick={(e) => {
          recordClick('logo-bolt');
          const next = logoClicks + 1;
          setLogoClicks(next);
          if (next >= 5) {
            e.preventDefault();
            discoverEasterEgg('logo_doodle');
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.2 }
            });
            showToast('⚡ Bzzzt! You supercharged the StudySprint logo! (+100 XP)');
            setLogoClicks(0);
          }
        }}
      />

      {/* HERO SECTION */}
      <section id="home" className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#D8F3DC] dark:bg-[#133020] border-2 border-[#1E2A4A] dark:border-slate-300 px-4 py-1.5 rounded-full shadow-[2px_2px_0_#1E2A4A] dark:shadow-[2px_2px_0_#000000] text-[#1E2A4A] dark:text-emerald-200">
              <span className="text-base">🎒</span>
              <span className="font-display font-semibold text-xs sm:text-sm">
                Exam Season Survival Kit · Free Shipping &gt; ₹500
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-[#1E2A4A] dark:text-white">
              Supercharge your grind with stationery you&apos;ll{' '}
              <span className="hl-underline text-[#1E2A4A] dark:text-white">actually love</span>.
            </h1>

            <p className="text-lg sm:text-xl text-[#1E2A4A]/80 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
              Say goodbye to boring study desks. Aesthetic pastel highlighters, active-recall flashcard rings, and Pomodoro planners designed to help you ace your exams.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a href="#kits" className="btn-doodle btn-primary px-7 py-3 text-lg">
                Explore Kits 📦
              </a>
              <a href="#builder" className="btn-doodle btn-ghost px-6 py-3 text-lg">
                Build Custom Box 🛠️
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-display font-medium text-[#1E2A4A]/80 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> 100% Student Tested
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> 2–5 Day Fast Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> 7-Day Easy Returns
              </div>
            </div>
          </div>

          {/* Interactive Hero Showcase / Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="doodle-card bg-[#CDE7FF] dark:bg-[#14233D] p-6 max-w-md w-full rotate-1 hover-lift">
              {/* Laptop / Desk screen header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#1E2A4A] dark:border-slate-300">
                <div className="flex gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFD6E0] border border-[#1E2A4A] dark:border-slate-400" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFC93C] border border-[#1E2A4A] dark:border-slate-400" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#D8F3DC] border border-[#1E2A4A] dark:border-slate-400" />
                </div>
                <span className="font-hand font-bold text-sm text-[#1E2A4A] dark:text-slate-200">studysprint.in/today</span>
                <span className="text-xs bg-white dark:bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#1E2A4A] dark:border-slate-300 text-[#1E2A4A] dark:text-slate-200">Live</span>
              </div>

              {/* Fake Interactive Search Input (as requested in prompt) */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="🔍 Search study kits... (tap to browse)"
                  readOnly
                  onFocus={() => {
                    const searchEl = document.getElementById('kit-search');
                    if (searchEl) {
                      searchEl.focus();
                    }
                    window.location.hash = '#kits';
                  }}
                  className="w-full bg-white dark:bg-[#0F172A] px-4 py-2.5 rounded-full border-2 border-[#1E2A4A] dark:border-slate-300 text-xs font-display text-[#1E2A4A] dark:text-slate-200 cursor-pointer hover:bg-amber-50 dark:hover:bg-slate-800"
                />
              </div>

              {/* Sample Floating Kit Showcase */}
              <div className="mt-5 bg-white dark:bg-[#0F172A] p-5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 text-center space-y-3">
                <div className="w-full max-h-48 overflow-hidden rounded-lg">
                  <ProductImage
                    src={PRODUCTS[0].image}
                    alt={PRODUCTS[0].imageAlt || PRODUCTS[0].name}
                    fallbackEmoji={PRODUCTS[0].emoji}
                    aspectRatio="wide"
                    sourcePage={PRODUCTS[0].sourcePage || undefined}
                    sourceLabel={PRODUCTS[0].imageSource || undefined}
                    showBadge={false}
                  />
                </div>
                <h2 className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">The Deep Focus Box</h2>
                <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300">
                  Includes 300 pastel stickies, 5 mild highlighters & Pomodoro tracker pad.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-display font-bold text-xl text-emerald-700 dark:text-emerald-400">₹449</span>
                  <button
                    onClick={() => addToCart(PRODUCTS[0])}
                    className="btn-doodle btn-primary px-4 py-1.5 text-sm"
                  >
                    Quick Add +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs font-hand text-[#1E2A4A]/80 dark:text-slate-300 font-bold px-1">
                <span>⭐ 4.9/5 Rating (1,240+ students)</span>
                <span>📦 Dispatched today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ KITS SECTION (WORKING SEARCH + CATEGORY FILTERS) */}
      <section id="kits" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-hand text-2xl text-amber-700 dark:text-amber-400 font-bold block">ready to pack</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A4A] dark:text-white">
            Curated Study Kits 📦
          </h2>
          <p className="mt-3 opacity-75 dark:opacity-90 font-body text-base text-[#1E2A4A]/75 dark:text-slate-300">
            Pinned to the board… Picked for your grind.
          </p>

          {/* Search + Category Filter Bar (Exact HTML structure matching prompt requirements) */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input
                id="kit-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search 30 kits or items… (try 'planner' or 'bio')"
                className="px-5 py-3 rounded-full bg-white dark:bg-[#1E293B] outline-none w-full sm:w-80 font-body text-sm text-[#1E2A4A] dark:text-slate-100 placeholder:text-slate-400"
                style={{ border: theme === 'dark' ? '3px solid #CBD5E1' : '3px solid #1E2A4A' }}
                aria-label="Search kits"
              />
              <div className="flex flex-wrap gap-2 justify-center" id="kit-filters">
                <button
                  type="button"
                  className={`chip ${activeFilter === 'all' ? 'active' : ''}`}
                  data-filter="all"
                  onClick={() => setActiveFilter('all')}
                >
                  All ({PRODUCTS.length})
                </button>
                <button
                  type="button"
                  className={`chip ${activeFilter === 'focus' ? 'active' : ''}`}
                  data-filter="focus"
                  onClick={() => setActiveFilter('focus')}
                >
                  📘 Focus ({PRODUCTS.filter((p) => p.category === 'focus').length})
                </button>
                <button
                  type="button"
                  className={`chip ${activeFilter === 'exam' ? 'active' : ''}`}
                  data-filter="exam"
                  onClick={() => setActiveFilter('exam')}
                >
                  ⭐ Exam ({PRODUCTS.filter((p) => p.category === 'exam').length})
                </button>
                <button
                  type="button"
                  className={`chip ${activeFilter === 'custom' ? 'active' : ''}`}
                  data-filter="custom"
                  onClick={() => setActiveFilter('custom')}
                >
                  🛠️ Custom ({PRODUCTS.filter((p) => p.category === 'custom').length})
                </button>
              </div>
            </div>

            {/* Quick Search Tag Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-xs font-display">
              <span className="text-[#1E2A4A]/60 dark:text-slate-400 mr-1 font-semibold">Quick find:</span>
              {['Sticky Notes', 'Highlighters', 'Flashcards', 'Pomodoro', 'Bio', 'Planner'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag.toLowerCase())}
                  className="px-2.5 py-1 bg-white dark:bg-[#1E293B] hover:bg-amber-100 dark:hover:bg-slate-700 rounded-lg border border-[#1E2A4A]/30 dark:border-slate-600 text-[#1E2A4A]/80 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1 text-red-600 hover:underline font-bold ml-1"
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* Result count & sorting bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-[#1E2A4A]/15 dark:border-slate-700 text-xs font-display">
              <span className="text-[#1E2A4A]/75 dark:text-slate-300 font-semibold">
                Showing <b className="text-[#1E2A4A] dark:text-white">{filteredProducts.length}</b> of {PRODUCTS.length} study kits
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#1E2A4A]/60 dark:text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 font-display font-semibold outline-none cursor-pointer text-[#1E2A4A] dark:text-slate-100"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="bestsellers">⭐ Bestsellers First</option>
                  <option value="price-asc">💵 Price: Low to High</option>
                  <option value="price-desc">💎 Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Playful Search Callout Easter Egg */}
            {(() => {
              const q = searchQuery.toLowerCase().trim();
              if (!q || !funMode) return null;
              if (q.includes('procrastinat')) {
                return (
                  <div className="mt-3 p-3 bg-[#FFD6E0] dark:bg-[#381B2B] rounded-xl border-2 border-pink-400 text-xs font-body text-[#1E2A4A] dark:text-pink-100 flex items-center justify-between gap-2 animate-in fade-in">
                    <span><b>Search result:</b> We found exactly what you were looking for: a way to avoid studying. Unfortunately, we sell stationery. 🎨</span>
                    <span className="font-display text-[10px] bg-pink-200 dark:bg-pink-900 px-2 py-0.5 rounded-full font-bold shrink-0">🥚 Egg Found!</span>
                  </div>
                );
              }
              if (q.includes('coffee')) {
                return (
                  <div className="mt-3 p-3 bg-[#FFF2C6] dark:bg-[#2B2313] rounded-xl border-2 border-amber-400 text-xs font-body text-[#1E2A4A] dark:text-amber-100 flex items-center justify-between gap-2 animate-in fade-in">
                    <span><b>Coffee Protocol:</b> 0mg caffeine in paper, but 100% placebo boost when opening unblemished dot-grid notebooks! ☕</span>
                    <span className="font-display text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded-full font-bold shrink-0">🥚 Egg Found!</span>
                  </div>
                );
              }
              if (q.includes('exam')) {
                return (
                  <div className="mt-3 p-3 bg-[#CDE7FF] dark:bg-[#162D4A] rounded-xl border-2 border-blue-400 text-xs font-body text-[#1E2A4A] dark:text-blue-100 flex items-center justify-between gap-2 animate-in fade-in">
                    <span><b>🚨 Exam Panic Detected:</b> Recommended student response: Panic responsibly, open fresh pastel highlighters. 📚</span>
                    <span className="font-display text-[10px] bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded-full font-bold shrink-0">🥚 Egg Found!</span>
                  </div>
                );
              }
              if (q.includes('homework')) {
                return (
                  <div className="mt-3 p-3 bg-[#D8F3DC] dark:bg-[#133020] rounded-xl border-2 border-emerald-400 text-xs font-body text-[#1E2A4A] dark:text-emerald-100 flex items-center justify-between gap-2 animate-in fade-in">
                    <span><b>Homework Alert:</b> Have you considered spending 3 hours color-coding the title instead of doing question 1? ✏️</span>
                  </div>
                );
              }
              return null;
            })()}

            {/* No Results Message */}
            <p
              id="no-results"
              className={`${
                filteredProducts.length === 0 ? 'block' : 'hidden'
              } text-center font-hand text-2xl mt-6 opacity-60 text-[#1E2A4A]/60 dark:text-slate-400`}
            >
              no kits match… try &quot;cards&quot; or &quot;notes&quot; 🤔
            </p>
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredProducts.map((p) => (
            <article
              key={p.id}
              className={`doodle-card ${p.tilt} p-8 flex flex-col justify-between hover-lift cursor-default relative`}
              style={{ backgroundColor: getProductCardBg(p.color) }}
              data-id={p.id}
              onClick={() => recordProductInspection(p.id)}
            >
              {/* Heart Wishlist Toggle Button (Top-left floating badge) */}
              <button
                type="button"
                data-wishlist-toggle={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(p);
                }}
                className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                  isWishlisted(p.id)
                    ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-500 border-2 border-rose-500 shadow-[2px_2px_0_#f43f5e] scale-105'
                    : 'bg-white/95 dark:bg-slate-800/95 text-slate-400 hover:text-rose-500 border-2 border-[#1E2A4A] dark:border-slate-400 shadow-[2px_2px_0_#1E2A4A] dark:shadow-[2px_2px_0_#000000] hover:scale-105'
                }`}
                aria-label={isWishlisted(p.id) ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                title={isWishlisted(p.id) ? 'Saved in Wishlist ❤️' : 'Save for later 🤍'}
              >
                <span className="text-lg leading-none select-none" aria-hidden="true">
                  {isWishlisted(p.id) ? '❤️' : '🤍'}
                </span>
              </button>

              {p.bestseller && (
                <span
                  className="absolute -top-4 -right-3 bg-[#FFC93C] text-[#1E2A4A] rounded-full px-4 py-1 font-display font-semibold rotate-6 text-sm shadow-[2px_2px_0_#1E2A4A] dark:shadow-[2px_2px_0_#000000]"
                  style={{ border: theme === 'dark' ? '3px solid #CBD5E1' : '3px solid #1E2A4A' }}
                >
                  ⭐ Bestseller
                </span>
              )}

              <div>
                <div className="my-4">
                  <ProductImage
                    src={p.image}
                    alt={p.imageAlt || p.name}
                    fallbackEmoji={p.emoji}
                    aspectRatio="wide"
                    sourcePage={p.sourcePage || undefined}
                    sourceLabel={p.imageSource || undefined}
                    showBadge={true}
                  />
                </div>
                <span className="font-hand text-xl opacity-75 dark:opacity-90 font-semibold block text-[#1E2A4A] dark:text-amber-300">{p.tag}</span>
                <h3 className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white mt-1">{p.name}</h3>
                <p className="text-sm opacity-80 dark:opacity-90 mt-1 mb-4 leading-relaxed font-body text-[#1E2A4A] dark:text-slate-200">{p.blurb}</p>

                <ul className="kit-check flex-1 mb-4 space-y-1">
                  {p.items.map((item, idx) => (
                    <li key={idx} className="font-body text-[#1E2A4A]/90 dark:text-slate-200">{item}</li>
                  ))}
                </ul>

                {/* Playful Interactive Product Buttons */}
                {funMode && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('compatibilityModal', { product: p });
                      }}
                      className="px-2.5 py-1 bg-white/90 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-[11px] font-display font-semibold rounded-lg border border-[#1E2A4A]/30 dark:border-slate-500 text-[#1E2A4A] dark:text-emerald-300 transition-all hover:scale-105 cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Check student compatibility percentage"
                    >
                      <span>🔍</span>
                      <span>Compatibility</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('labModal', { product: p });
                      }}
                      className="px-2.5 py-1 bg-white/90 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-[11px] font-display font-semibold rounded-lg border border-[#1E2A4A]/30 dark:border-slate-500 text-[#1E2A4A] dark:text-purple-300 transition-all hover:scale-105 cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="View RPG Stationery stats"
                    >
                      <span>🧪</span>
                      <span>Lab Stats</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-[#1E2A4A]/15 dark:border-slate-700 gap-2">
                <span className="price-tag">₹{p.price}</span>
                <div className="flex items-center gap-2">
                  {/* Secondary Heart Toggle Button beside Add to Cart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    className={`p-2 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center text-sm ${
                      isWishlisted(p.id)
                        ? 'border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/80 shadow-[1px_1px_0_#f43f5e]'
                        : 'border-[#1E2A4A]/40 dark:border-slate-500 text-slate-400 hover:text-rose-500 bg-white/70 dark:bg-slate-800/70'
                    }`}
                    title={isWishlisted(p.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-label={isWishlisted(p.id) ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
                  >
                    <span>{isWishlisted(p.id) ? '❤️' : '🤍'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-doodle btn-primary px-5 py-2 text-base"
                    onClick={(e) => addToCart(p, e)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CUSTOM KIT BUILDER SECTION */}
      <section id="builder" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#FFFDF7] dark:bg-[#0B0F19] transition-colors">
        <div className="doodle-card bg-[#FFF2C6] dark:bg-[#1A2234] p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="font-hand text-2xl text-amber-800 dark:text-amber-400 font-bold block">mix & match your grind</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E2A4A] dark:text-white">
              🛠️ Build Your Own Custom Sprint Box
            </h2>
            <p className="text-[#1E2A4A]/80 dark:text-slate-300 mt-2 font-body text-base">
              Pick the exact items you need. Pick <b>5 or more items</b> to unlock our flat{' '}
              <span className="font-display font-bold bg-[#FFC93C] text-[#1E2A4A] px-2 py-0.5 rounded-md border border-[#1E2A4A] dark:border-slate-300">
                ₹499 Deal
              </span>{' '}
              (Save up to 40%)!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {BUILDER_ITEMS.map((item) => {
              const isSelected = selectedBuilderIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleBuilderItem(item.id)}
                  className={`doodle-card p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-3 ring-[#1E2A4A] dark:ring-emerald-400 bg-[#D8F3DC] dark:bg-[#133020] translate-y-[-2px]'
                      : 'bg-white dark:bg-[#0F172A] hover:bg-amber-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-14 h-14 shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.imageAlt || item.name}
                        fallbackEmoji={item.emoji}
                        aspectRatio="square"
                        containerClassName="w-14 h-14 rounded-lg"
                      />
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full border-2 border-[#1E2A4A] dark:border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-[#FFC93C] text-[#1E2A4A]' : 'bg-white dark:bg-slate-800 text-[#1E2A4A] dark:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                  <h4 className="font-display font-semibold text-base mt-2 text-[#1E2A4A] dark:text-white">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-xs text-[#1E2A4A]/60 dark:text-slate-400 font-medium">{item.category}</span>
                    <span className="font-display font-bold text-emerald-800 dark:text-emerald-400">₹{item.price}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Builder Summary Bar */}
          <div className="mt-8 bg-white dark:bg-[#0F172A] p-6 rounded-2xl border-3 border-[#1E2A4A] dark:border-slate-300 shadow-[4px_4px_0_#1E2A4A] dark:shadow-[4px_4px_0_#000000] flex flex-col md:flex-row items-center justify-between gap-6 text-[#1E2A4A] dark:text-slate-100">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">
                  {selectedBuilderIds.length} items chosen
                </span>
                {isBuilderDealUnlocked ? (
                  <span className="bg-[#D8F3DC] dark:bg-[#133020] text-emerald-900 dark:text-emerald-200 border border-[#1E2A4A] dark:border-slate-300 text-xs font-display font-bold px-2.5 py-1 rounded-full">
                    🎉 Flat ₹499 Unlocked!
                  </span>
                ) : (
                  <span className="text-xs font-hand text-amber-700 dark:text-amber-400 font-bold">
                    Add {5 - selectedBuilderIds.length} more for ₹499 flat deal
                  </span>
                )}
              </div>
              <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full border border-[#1E2A4A] dark:border-slate-300 overflow-hidden mt-2">
                <div
                  className="bg-[#FFC93C] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedBuilderIds.length / 5) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-xs text-[#1E2A4A]/70 dark:text-slate-400 block font-body">Custom Box Price</span>
                <div className="flex items-center gap-2">
                  {isBuilderDealUnlocked && (
                    <span className="text-sm line-through text-red-500 font-bold">
                      ₹{rawBuilderTotal}
                    </span>
                  )}
                  <span className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">
                    ₹{finalBuilderPrice}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={addCustomBoxToCart}
                className="btn-doodle btn-primary px-6 py-2.5 text-base"
              >
                Add Box to Cart 🎁
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION (FUNNY & SELF-AWARE REVIEWS) */}
      <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-hand text-2xl text-amber-700 dark:text-amber-400 font-bold block">
            wall of unverified claims 🤫
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E2A4A] dark:text-white">
            Reviews From People Who Should Be Studying 😂
          </h2>
          <p className="mt-2 text-[#1E2A4A]/70 dark:text-slate-300 text-sm sm:text-base font-body">
            We haven&apos;t raised $10M or paid famous influencers, so here are 100% genuine unfiltered thoughts from caffeine-fueled friends and 3 AM study survivors.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-[#FFF2C6] dark:bg-[#1F2937] border-2 border-dashed border-[#1E2A4A] dark:border-slate-500 px-3.5 py-1 rounded-full text-xs font-hand text-[#1E2A4A] dark:text-amber-300 font-bold">
            <span>⚠️ Disclaimer:</span>
            <span>Stationery cannot take your exams for you. We tried. It failed.</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: `All Claims (${reviews.length})` },
            { id: 'aesthetic', label: '🎨 Aesthetic Fails' },
            { id: 'procrastination', label: '⏱️ Pomodoro Excuses' },
            { id: 'placebo', label: '🧠 Pure Placebo' },
            { id: 'tears', label: '💧 3 AM Panic & Tears' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReviewFilter(tab.id as any)}
              className={`btn-doodle px-4 py-1.5 text-xs sm:text-sm cursor-pointer transition-all ${
                reviewFilter === tab.id
                  ? 'bg-[#FFC93C] text-[#1E2A4A] font-bold scale-105'
                  : 'bg-white dark:bg-[#162032] text-[#1E2A4A] dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews
            .filter((r) => reviewFilter === 'all' || r.category === reviewFilter)
            .map((r) => (
              <div
                key={r.id}
                className={`doodle-card bg-white dark:bg-[#162032] p-6 ${r.tilt} flex flex-col justify-between hover-lift transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#FFC93C] text-base">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <span
                      className={`${r.badgeBg} ${r.badgeText} text-xs font-display font-bold px-2.5 py-0.5 rounded-full border border-[#1E2A4A] dark:border-slate-400`}
                    >
                      {r.tag}
                    </span>
                  </div>
                  <p className="text-sm text-[#1E2A4A]/90 dark:text-slate-200 italic font-body leading-relaxed">
                    &quot;{r.text}&quot;
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1E2A4A]/10 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${r.avatarBg} border-2 border-[#1E2A4A] dark:border-slate-300 flex items-center justify-center font-display font-bold text-sm text-[#1E2A4A] dark:text-white shrink-0`}
                    >
                      {r.initials}
                    </div>
                    <div className="min-w-0">
                      <b className="font-display text-sm block text-[#1E2A4A] dark:text-white truncate">
                        {r.name}
                      </b>
                      <span className="text-xs text-[#1E2A4A]/60 dark:text-slate-400 block truncate">
                        {r.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleLikeReview(r.id)}
                    className={`btn-doodle px-2.5 py-1 text-xs shrink-0 cursor-pointer transition-transform ${
                      likedReviews[r.id]
                        ? 'bg-[#FFD6E0] dark:bg-[#431A2D] text-pink-700 dark:text-pink-200 font-bold scale-105'
                        : 'bg-slate-50 dark:bg-slate-800 text-[#1E2A4A] dark:text-slate-300 hover:scale-105'
                    }`}
                    title="Mark as relatable"
                  >
                    {likedReviews[r.id] ? '❤️' : '😂'} {r.likes}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Interactive Action Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            className="btn-doodle btn-primary px-6 py-2.5 text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>✍️ Leave an Equally Dubious Review</span>
            <span>✨</span>
          </button>

          <button
            type="button"
            onClick={() => {
              rollRandomExcuse();
              setReviewModalOpen(true);
            }}
            className="btn-doodle btn-ghost px-5 py-2.5 text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-amber-100 dark:hover:bg-slate-800"
          >
            <span>🎲 Roll a Random Student Excuse</span>
          </button>
        </div>
      </section>

      {/* 3️⃣ DELIVERY & LIVE ORDER TRACKER SECTION */}
      <section id="delivery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#FFFDF7] dark:bg-[#0B0F19] transition-colors">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-hand text-2xl text-amber-700 dark:text-amber-400 font-bold block">from our desk to yours</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A4A] dark:text-white">
            Express Courier Delivery 🚚
          </h2>
          <p className="mt-2 text-[#1E2A4A]/70 dark:text-slate-300">
            Speedy dispatch within 24 hours so you never lose your study momentum.
          </p>
        </div>

        {/* Checkpoint grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="doodle-card bg-white dark:bg-[#162032] p-6 text-center text-[#1E2A4A] dark:text-slate-100">
            <span className="text-4xl block mb-2">⚡</span>
            <h4 className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">24h Express Dispatch</h4>
            <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-1">Packaged with care and love from our Bangalore fulfillment hub.</p>
          </div>
          <div className="doodle-card bg-white dark:bg-[#162032] p-6 text-center text-[#1E2A4A] dark:text-slate-100">
            <span className="text-4xl block mb-2">📱</span>
            <h4 className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">Real-Time Tracking</h4>
            <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-1">Live SMS updates and online tracker for every single parcel.</p>
          </div>
          <div className="doodle-card bg-white dark:bg-[#162032] p-6 text-center text-[#1E2A4A] dark:text-slate-100">
            <span className="text-4xl block mb-2">🛡️</span>
            <h4 className="font-display font-bold text-lg text-[#1E2A4A] dark:text-white">Damage-Free Guarantee</h4>
            <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-1">Sturdy bubble wrap and rigid boxes ensure zero bent corners.</p>
          </div>
        </div>

        {/* Exact Order Tracker Block (Matching Requirement #3) */}
        <div className="doodle-card bg-white dark:bg-[#162032] p-8 mt-14 max-w-xl mx-auto tilt-1 text-[#1E2A4A] dark:text-slate-100">
          <h3 className="font-display font-semibold text-xl mb-4 text-center text-[#1E2A4A] dark:text-white">
            📱 Track Your Order
          </h3>
          <form className="flex gap-3" onSubmit={handleTrackSubmit}>
            <input
              id="track-input"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="Enter Order ID (e.g. SS1234)"
              className="flex-1 px-4 py-3 rounded-full bg-[#FFFDF7] dark:bg-[#0F172A] outline-none text-sm uppercase font-body text-[#1E2A4A] dark:text-slate-100"
              style={{ border: theme === 'dark' ? '3px solid #CBD5E1' : '3px solid #1E2A4A' }}
              aria-label="Order ID"
            />
            <button type="submit" className="btn-doodle btn-primary px-5 py-2">
              Track
            </button>
          </form>

          {/* Results container */}
          <div id="track-result" className="mt-6">
            {trackSearched && (
              <>
                {/* Playful Fictional Tracking Check Sequence (Requirement #7) */}
                {funMode && fictionalTrackingStep >= 0 && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 font-mono text-xs text-left animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-amber-200 dark:border-slate-700 pb-2 mb-2 font-display font-bold text-amber-900 dark:text-amber-300">
                      <span>🛰️ SCANNING ACADEMIC LOGISTICS...</span>
                      {fictionalTrackingStep < 6 ? (
                        <span className="text-[10px] animate-pulse">SEARCHING...</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">COMPLETE ✓</span>
                      )}
                    </div>
                    <div className="space-y-1 text-slate-700 dark:text-slate-300">
                      {fictionalTrackingStep >= 0 && <p>✓ Locating Bangalore fulfillment warehouse...</p>}
                      {fictionalTrackingStep >= 1 && <p>✓ Checking pastel stationery inventory...</p>}
                      {fictionalTrackingStep >= 2 && <p>✓ Consulting delivery department speedsters...</p>}
                      {fictionalTrackingStep >= 3 && <p>✓ Verifying whether student actually intends to study...</p>}
                      {fictionalTrackingStep >= 4 && <p>✓ Detecting mid-semester panic level: ELEVATED...</p>}
                      {fictionalTrackingStep >= 5 && <p>✓ Searching for lost motivation...</p>}
                    </div>
                    {fictionalTrackingStep >= 6 && (
                      <div className="mt-3 pt-2 border-t border-amber-200 dark:border-slate-700 font-body text-xs">
                        <b className="font-display text-amber-900 dark:text-amber-200 block">STATUS:</b>
                        <p className="italic text-slate-700 dark:text-slate-300">
                          &quot;Your Study Kit is somewhere between &apos;Preparation&apos; and &apos;I should have started studying 3 weeks earlier.&apos;&quot;
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">📍 Current Dimension: Academic Sector #7</p>
                      </div>
                    )}
                  </div>
                )}

                {!trackedOrder ? (
                  <p className="font-hand text-2xl text-center opacity-60 dark:opacity-80 text-[#1E2A4A]/60 dark:text-slate-400 pt-2">
                    hmm… no order &quot;{trackInput || '???'}&quot; found 🤔<br />
                    <span className="text-lg">place an order to get your ID!</span>
                  </p>
                ) : (
                  (() => {
                    const stage = getOrderStage(trackedOrder.ts);
                    return (
                      <div
                        className="doodle-card bg-white dark:bg-[#0F172A] p-5 animate-in fade-in duration-300 text-[#1E2A4A] dark:text-slate-100"
                        style={{ boxShadow: '3px 3px 0 rgba(0,0,0,.2)' }}
                      >
                        <div className="flex justify-between text-sm mb-3 border-b pb-2 border-[#1E2A4A]/10 dark:border-slate-700">
                          <b className="font-display text-base text-[#1E2A4A] dark:text-white">{trackedOrder.id}</b>
                          <span className="opacity-70 dark:opacity-85 text-xs sm:text-sm text-[#1E2A4A]/80 dark:text-slate-300">
                            {trackedOrder.items} item(s) · ₹{trackedOrder.total} · {trackedOrder.pay}
                          </span>
                        </div>
                        {TRACK_STAGES.map((s, i) => (
                          <div
                            key={i}
                            className={`track-step ${i <= stage ? 'done' : ''} ${
                              i === stage ? 'current done' : ''
                            }`}
                          >
                            <span className="dot">{i <= stage ? s.icon : ''}</span>
                            <span
                              className={`text-sm ${
                                i === stage ? 'font-display font-semibold text-[#1E2A4A] dark:text-white' : 'text-[#1E2A4A]/80 dark:text-slate-300'
                              }`}
                            >
                              {s.label}
                              {i === stage && stage < 4 ? ' — happening now!' : ''}
                            </span>
                          </div>
                        ))}
                        <div className="h-3 rounded-full border-2 border-[#1E2A4A] dark:border-slate-300 overflow-hidden bg-white dark:bg-slate-800 mt-3">
                          <div
                            className="h-full transition-all duration-700 bg-[#FFC93C]"
                            style={{ width: `${((stage + 1) / 5) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs opacity-60 dark:opacity-80 mt-2 font-body text-center text-[#1E2A4A]/70 dark:text-slate-400">
                          {stage >= 4
                            ? '📍 Delivered! Happy studying ⚡'
                            : 'Demo: status advances ~1 step per minute after ordering.'}
                        </p>
                      </div>
                    );
                  })()
                )}
              </>
            )}
          </div>
        </div>

        <p className="text-center opacity-70 dark:opacity-80 mt-8 text-xs font-body text-[#1E2A4A]/70 dark:text-slate-400">
          Need priority dispatch or bulk class orders? Reach out via our Contact modal in the footer.
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="doodle-card bg-[#CDE7FF] dark:bg-[#14233D] p-8 sm:p-12 text-[#1E2A4A] dark:text-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="font-hand text-2xl text-blue-900 dark:text-blue-300 font-bold block">our small story</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E2A4A] dark:text-white mt-1">
                Stationery Made by Students, for Students 💡
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#1E2A4A]/80 dark:text-slate-200 font-body">
                StudySprint was born during late-night revision sessions in engineering hostel rooms. Tired of dull black pens, ink bleeding through cheap notebooks, and flimsy flashcards, we built what we wished existed: stationery that feels fun, cute, and genuinely boosts focus.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="bg-white dark:bg-[#0F172A] border-2 border-[#1E2A4A] dark:border-slate-300 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-[#1E2A4A] dark:text-slate-200">
                  🌱 Eco-friendly Recycled Kraft Paper
                </span>
                <span className="bg-white dark:bg-[#0F172A] border-2 border-[#1E2A4A] dark:border-slate-300 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-[#1E2A4A] dark:text-slate-200">
                  ✏️ Zero-Bleed 100 GSM Paper
                </span>
                <span className="bg-white dark:bg-[#0F172A] border-2 border-[#1E2A4A] dark:border-slate-300 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-[#1E2A4A] dark:text-slate-200">
                  💌 Free Sticker Sheet in Every Box
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="doodle-card bg-white dark:bg-[#0F172A] p-6 max-w-sm rotate-2 text-center text-[#1E2A4A] dark:text-slate-100">
                <div className="text-6xl mb-3">🎒📖</div>
                <h4 className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">The StudySprint Pledge</h4>
                <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-2 font-body leading-relaxed">
                  &quot;If any pen dries out prematurely or any kit item is defective, we send an instant replacement without asking you to ship it back.&quot;
                </p>
                <div className="mt-4 pt-3 border-t border-[#1E2A4A]/10 dark:border-slate-700 font-hand text-lg text-amber-800 dark:text-amber-400 font-bold">
                  — Sachin & Team StudySprint
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#1E2A4A] dark:bg-[#060910] text-white py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-[#FFC93C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-3">
              <span className="font-display font-bold text-2xl tracking-tight text-[#FFC93C]">
                StudySprint ⚡
              </span>
              <a
                href="https://www.linkedin.com/in/proffesionalsachin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#FFC93C] text-xs font-display font-semibold text-white hover:text-[#1E2A4A] border border-white/20 transition-all hover:scale-105 shadow-sm"
                title="Sachin's LinkedIn Profile"
              >
                <span>Store by Sachin</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-white/70 mt-1 font-body">
              Aesthetic stationery kits and active recall essentials for top scorers.
            </p>
          </div>

          {/* 5️⃣ Footer Links with working info modals */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-display text-sm font-medium">
            <a href="#about" className="hover:text-[#FFC93C] transition-colors">
              About
            </a>
            <button
              type="button"
              onClick={() => openInfo('contact')}
              className="hover:text-[#FFC93C] transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => openInfo('faq')}
              className="hover:text-[#FFC93C] transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => openInfo('shipping')}
              className="hover:text-[#FFC93C] transition-colors cursor-pointer"
            >
              Shipping Policy
            </button>
            <a
              href="https://www.linkedin.com/in/proffesionalsachin/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => discoverEasterEgg('footer_sachin_heart')}
              className="text-[#FFC93C] hover:underline transition-colors inline-flex items-center gap-1"
            >
              Store by Sachin ↗
            </a>
          </div>
        </div>

        {/* Footer info area */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/60 dark:text-slate-400 font-body">
            <span>StudySprint™ — Cute stationery that works 💡</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white/5 text-center text-xs text-white/50 dark:text-slate-400 font-body flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Made for learners everywhere ✏️ 💖</span>
          <a
            href="https://www.linkedin.com/in/proffesionalsachin/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => discoverEasterEgg('footer_sachin_heart')}
            className="text-[#FFC93C] hover:underline font-medium inline-flex items-center gap-1"
          >
            Store by Sachin ↗
          </a>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[105] flex justify-end bg-[#1E2A4A]/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="bg-[#FFFDF7] dark:bg-[#0B0F19] w-full max-w-md h-full flex flex-col border-l-4 border-[#1E2A4A] dark:border-slate-300 shadow-2xl p-6 overflow-y-auto text-[#1E2A4A] dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#1E2A4A] dark:border-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <h3 className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">Your Study Bag</h3>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="btn-doodle btn-ghost px-3 py-1 text-sm"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Cart Personality Box (Requirement #11) */}
            {funMode && (
              <div className="my-3 p-3 rounded-xl border-2 border-[#1E2A4A]/20 dark:border-slate-700 bg-amber-50 dark:bg-slate-800/70 text-xs font-body animate-in fade-in">
                <div className="flex items-center justify-between mb-0.5">
                  <b className="font-display text-xs text-[#1E2A4A] dark:text-amber-300">
                    {cart.length === 0
                      ? CART_PERSONALITY_MESSAGES.empty.title
                      : cart.length === 1
                      ? CART_PERSONALITY_MESSAGES.one.title
                      : cart.length <= 3
                      ? CART_PERSONALITY_MESSAGES.few.title
                      : cart.length <= 5
                      ? CART_PERSONALITY_MESSAGES.heavy.title
                      : CART_PERSONALITY_MESSAGES.boss.title}
                  </b>
                  <span className="text-[10px] font-display font-semibold bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-[#1E2A4A]/20 dark:border-slate-600">
                    {cart.length === 0
                      ? CART_PERSONALITY_MESSAGES.empty.tag
                      : cart.length === 1
                      ? CART_PERSONALITY_MESSAGES.one.tag
                      : cart.length <= 3
                      ? CART_PERSONALITY_MESSAGES.few.tag
                      : cart.length <= 5
                      ? CART_PERSONALITY_MESSAGES.heavy.tag
                      : CART_PERSONALITY_MESSAGES.boss.tag}
                  </span>
                </div>
                <p className="text-[#1E2A4A]/70 dark:text-slate-300 italic text-[11px]">
                  {cart.length === 0
                    ? CART_PERSONALITY_MESSAGES.empty.subtitle
                    : cart.length === 1
                    ? CART_PERSONALITY_MESSAGES.one.subtitle
                    : cart.length <= 3
                    ? CART_PERSONALITY_MESSAGES.few.subtitle
                    : cart.length <= 5
                    ? CART_PERSONALITY_MESSAGES.heavy.subtitle
                    : CART_PERSONALITY_MESSAGES.boss.subtitle}
                </p>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-3">🎒</div>
                  <h4 className="font-display font-bold text-xl text-[#1E2A4A] dark:text-white">Your bag is empty</h4>
                  <p className="text-xs text-[#1E2A4A]/70 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                    Fill it with sticky notes, memory flashcards, or custom study bundles!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      window.location.hash = '#kits';
                    }}
                    className="btn-doodle btn-primary px-5 py-2 mt-4 text-sm"
                  >
                    Browse Kits ⚡
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="doodle-card bg-white dark:bg-[#162032] p-4 flex items-center justify-between gap-3 text-[#1E2A4A] dark:text-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          fallbackEmoji={item.emoji}
                          aspectRatio="square"
                          containerClassName="w-12 h-12 rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <b className="font-display text-sm text-[#1E2A4A] dark:text-white block leading-tight truncate">
                          {item.name}
                        </b>
                        <span className="font-display font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                          ₹{item.price} each
                        </span>
                        {item.customDetails && (
                          <div className="text-[10px] text-[#1E2A4A]/60 dark:text-slate-400 mt-0.5 truncate">
                            {item.customDetails.slice(0, 2).join(', ')}...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border-2 border-[#1E2A4A] dark:border-slate-300 rounded-full overflow-hidden bg-slate-50 dark:bg-slate-800 text-[#1E2A4A] dark:text-slate-100">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2.5 py-0.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 font-display font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2.5 py-0.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 text-sm cursor-pointer"
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Free shipping progress in cart */}
            {cart.length > 0 && (
              <div className="bg-[#FFF2C6] dark:bg-[#252114] p-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 mb-4 text-xs font-body text-[#1E2A4A] dark:text-slate-200">
                {cartSubtotal >= 500 ? (
                  <span className="font-display font-bold text-emerald-800 dark:text-emerald-300">
                    🎉 You unlocked FREE Shipping!
                  </span>
                ) : (
                  <span>
                    Add <b>₹{500 - cartSubtotal}</b> more to get <b>FREE Shipping</b>!
                  </span>
                )}
                <div className="w-full bg-white dark:bg-slate-800 h-2 rounded-full border border-[#1E2A4A] dark:border-slate-300 overflow-hidden mt-1.5">
                  <div
                    className="bg-[#FFC93C] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 500) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t-2 border-[#1E2A4A] dark:border-slate-300 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1E2A4A]/70 dark:text-slate-300">Subtotal</span>
                  <span className="font-display font-semibold text-[#1E2A4A] dark:text-white">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#1E2A4A]/70 dark:text-slate-300">Delivery Fee</span>
                  <span className="font-display font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-display font-bold border-t border-[#1E2A4A]/10 dark:border-slate-700 pt-2 text-[#1E2A4A] dark:text-white">
                  <span>Total</span>
                  <span className="text-xl">₹{cartTotal}</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="btn-doodle btn-primary w-full py-3 text-lg mt-2 justify-center"
                >
                  Proceed to Checkout 💳
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4️⃣ CHECKOUT MODAL (EXACT STRUCTURE MATCHING PROMPT REQUIREMENT #4) */}
      <div
        id="checkout-modal"
        className={`fixed inset-0 z-[110] ${
          checkoutOpen ? 'flex' : 'hidden'
        } items-center justify-center p-4`}
        style={{ background: theme === 'dark' ? 'rgba(0,0,0,.7)' : 'rgba(30,42,74,.5)', backdropFilter: 'blur(4px)' }}
      >
        <div className="doodle-card bg-[#FFFDF7] dark:bg-[#0F172A] max-w-lg w-full p-8 max-h-[90dvh] overflow-y-auto text-[#1E2A4A] dark:text-slate-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">Checkout 💳</h3>
            <button
              type="button"
              className="btn-doodle btn-ghost px-3 py-1 cursor-pointer"
              onClick={() => setCheckoutOpen(false)}
              aria-label="Close checkout"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <input
              id="ck-name"
              required
              value={ckName}
              onChange={(e) => setCkName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
              aria-label="Full name"
            />
            <input
              id="ck-addr"
              required
              value={ckAddress}
              onChange={(e) => setCkAddress(e.target.value)}
              placeholder="Delivery address"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
              aria-label="Address"
            />
            <input
              id="ck-pin"
              required
              value={ckPin}
              onChange={(e) => setCkPin(e.target.value)}
              placeholder="Pincode"
              pattern="[0-9]{6}"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
              aria-label="Pincode"
            />
            <div>
              <b className="font-display block mb-2 text-[#1E2A4A] dark:text-white">Payment method</b>
              <div className="grid grid-cols-2 gap-3">
                <label className="doodle-card bg-[#CDE7FF] dark:bg-[#14233D] p-3 text-center cursor-pointer text-sm text-[#1E2A4A] dark:text-slate-100">
                  <input
                    type="radio"
                    name="pay"
                    value="UPI"
                    checked={payMethod === 'UPI'}
                    className="mr-1"
                    onChange={() => setPayMethod('UPI')}
                  />
                  📲 UPI
                </label>
                <label className="doodle-card bg-[#FFF2C6] dark:bg-[#252114] p-3 text-center cursor-pointer text-sm text-[#1E2A4A] dark:text-slate-100">
                  <input
                    type="radio"
                    name="pay"
                    value="Card"
                    checked={payMethod === 'Card'}
                    className="mr-1"
                    onChange={() => setPayMethod('Card')}
                  />
                  💳 Card
                </label>
                <label className="doodle-card bg-[#D8F3DC] dark:bg-[#12271C] p-3 text-center cursor-pointer text-sm text-[#1E2A4A] dark:text-slate-100">
                  <input
                    type="radio"
                    name="pay"
                    value="NetBanking"
                    checked={payMethod === 'NetBanking'}
                    className="mr-1"
                    onChange={() => setPayMethod('NetBanking')}
                  />
                  🏦 Net Banking
                </label>
                <label className="doodle-card bg-[#FFD6E0] dark:bg-[#291623] p-3 text-center cursor-pointer text-sm text-[#1E2A4A] dark:text-slate-100">
                  <input
                    type="radio"
                    name="pay"
                    value="COD"
                    checked={payMethod === 'COD'}
                    className="mr-1"
                    onChange={() => setPayMethod('COD')}
                  />
                  💵 COD
                </label>
              </div>
            </div>

            {/* ░░░ UPI PLACEHOLDER — wire Razorpay / UPI intent here ░░░ */}
            <div
              id="upi-box"
              className={`doodle-card bg-[#CDE7FF] dark:bg-[#14233D] p-5 text-center text-[#1E2A4A] dark:text-slate-100 ${
                payMethod === 'UPI' ? 'block' : 'hidden'
              }`}
            >
              <div
                className="mx-auto w-32 h-32 bg-white dark:bg-[#0F172A] rounded-xl border-3 border-[#1E2A4A] dark:border-slate-300 grid place-items-center text-5xl mb-3 text-[#1E2A4A] dark:text-slate-100"
                style={{ border: theme === 'dark' ? '3px dashed #CBD5E1' : '3px dashed #1E2A4A' }}
              >
                ▦
              </div>
              <p className="text-sm opacity-70 dark:opacity-85 mb-1 font-body">UPI QR / intent placeholder</p>
              <p className="text-xs opacity-60 dark:opacity-80 mb-3 font-mono">
                Integrate Razorpay <code>upi://pay</code> intent here
              </p>
              <button
                type="button"
                id="upi-sim-btn"
                className="btn-doodle btn-ghost px-4 py-2 text-sm cursor-pointer"
                onClick={simulateUpiPayment}
              >
                {upiPaid ? 'Paid ✓' : 'Simulate UPI Payment (demo)'}
              </button>
              <p
                id="upi-status"
                className={`mt-2 font-display font-semibold text-emerald-800 dark:text-emerald-300 ${
                  upiPaid ? 'block' : 'hidden'
                }`}
              >
                ✅ Payment received (demo)
              </p>
            </div>
            {/* ░░░ END UPI PLACEHOLDER ░░░ */}

            <div
              id="card-box"
              className={`space-y-3 ${payMethod === 'Card' ? 'block' : 'hidden'}`}
            >
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card number (demo)"
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
                />
                <input
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength={3}
                  type="password"
                  className="px-4 py-3 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 dark:placeholder-slate-400 font-body outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between font-display font-bold text-lg pt-2 text-[#1E2A4A] dark:text-white">
              <span>Order Total</span>
              <span id="checkout-total">₹{cartTotal}</span>
            </div>
            <button
              type="submit"
              className="btn-doodle btn-primary w-full justify-center py-3 text-lg cursor-pointer"
            >
              Place Order 🎉
            </button>
          </form>
        </div>
      </div>

      {/* ORDER SUCCESS MODAL */}
      <div
        id="success-modal"
        className={`fixed inset-0 z-[115] ${
          successModalOpen ? 'flex' : 'hidden'
        } items-center justify-center p-4`}
        style={{ background: theme === 'dark' ? 'rgba(0,0,0,.7)' : 'rgba(30,42,74,.5)', backdropFilter: 'blur(4px)' }}
      >
        <div className="doodle-card bg-[#D8F3DC] dark:bg-[#12271C] max-w-md w-full p-10 text-center animate-in zoom-in-95 duration-200 text-[#1E2A4A] dark:text-emerald-100">
          <div className="text-6xl mb-3">🎉</div>
          <h3 className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">Order Placed!</h3>
          <p className="mt-2 opacity-80 font-body text-[#1E2A4A] dark:text-slate-200">Order ID:</p>
          <p id="success-order-id" className="font-display font-bold text-3xl my-2 hl-underline text-[#1E2A4A] dark:text-white">
            {lastOrderId || 'SS0000'}
          </p>
          <p className="text-sm opacity-70 dark:opacity-85 mb-6 font-body text-[#1E2A4A] dark:text-slate-200">
            Save this ID to track your delivery 🚚
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              className="btn-doodle btn-ghost px-5 py-2 cursor-pointer"
              onClick={() => setSuccessModalOpen(false)}
            >
              Keep Shopping
            </button>
            <button
              type="button"
              className="btn-doodle btn-primary px-5 py-2 cursor-pointer"
              onClick={() => {
                setSuccessModalOpen(false);
                if (lastOrderId) {
                  trackOrderById(lastOrderId);
                }
              }}
            >
              Track It 📱
            </button>
          </div>
        </div>
      </div>

      {/* 5️⃣ INFO MODAL (Contact / FAQ / Shipping) */}
      <div
        id="info-modal"
        className={`fixed inset-0 z-[110] ${
          infoModalData ? 'flex' : 'hidden'
        } items-center justify-center p-4`}
        style={{ background: theme === 'dark' ? 'rgba(0,0,0,.7)' : 'rgba(30,42,74,.5)', backdropFilter: 'blur(4px)' }}
        onClick={() => setInfoModalData(null)}
      >
        <div
          className="doodle-card bg-[#FFFDF7] dark:bg-[#0F172A] max-w-lg w-full p-8 max-h-[85dvh] overflow-y-auto animate-in zoom-in-95 duration-150 text-[#1E2A4A] dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 id="info-title" className="font-display font-bold text-2xl text-[#1E2A4A] dark:text-white">
              {infoModalData?.title}
            </h3>
            <button
              type="button"
              className="btn-doodle btn-ghost px-3 py-1 cursor-pointer"
              onClick={() => setInfoModalData(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div id="info-body" className="space-y-3 text-sm leading-relaxed font-body text-[#1E2A4A] dark:text-slate-200">
            {infoModalData?.content}
          </div>
        </div>
      </div>

      {/* 6️⃣ DUBIOUS REVIEW SUBMISSION MODAL */}
      <div
        id="review-modal"
        className={`fixed inset-0 z-[110] ${
          reviewModalOpen ? 'flex' : 'hidden'
        } items-center justify-center p-4`}
        style={{
          background: theme === 'dark' ? 'rgba(0,0,0,.75)' : 'rgba(30,42,74,.55)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => setReviewModalOpen(false)}
      >
        <div
          className="doodle-card bg-[#FFFDF7] dark:bg-[#0F172A] max-w-xl w-full p-6 sm:p-8 max-h-[90dvh] overflow-y-auto animate-in zoom-in-95 duration-150 text-[#1E2A4A] dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-hand text-lg text-amber-700 dark:text-amber-400 font-bold block">
                admit your study sins 🙈
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1E2A4A] dark:text-white">
                Submit A Dubious Review ✍️
              </h3>
            </div>
            <button
              type="button"
              className="btn-doodle btn-ghost px-3 py-1 cursor-pointer"
              onClick={() => setReviewModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#1E2A4A]/80 dark:text-slate-300 font-body mb-5">
            Real corporate reviews are boring. Confess your stationery crimes, 3 AM study delusions, or accidental artistic masterpieces!
          </p>

          {/* Quick random generator banner */}
          <div className="bg-[#FFF2C6] dark:bg-[#1E293B] border-2 border-dashed border-[#1E2A4A] dark:border-slate-500 rounded-xl p-3.5 mb-5 flex items-center justify-between gap-3">
            <div className="text-xs font-body text-[#1E2A4A] dark:text-slate-200">
              <span className="font-bold block">Feeling uninspired?</span>
              <span className="opacity-80">Generate a relatable student study excuse in 1 tap.</span>
            </div>
            <button
              type="button"
              onClick={rollRandomExcuse}
              className="btn-doodle bg-white dark:bg-slate-700 text-[#1E2A4A] dark:text-white px-3 py-1 text-xs shrink-0 cursor-pointer font-display"
            >
              🎲 Roll Random
            </button>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-bold mb-1 text-[#1E2A4A] dark:text-slate-200">
                  Your Name / Alter Ego *
                </label>
                <input
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="e.g. Kabir D. or Sleepy Crammer"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 text-sm font-body outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold mb-1 text-[#1E2A4A] dark:text-slate-200">
                  College / Major / Life Situation
                </label>
                <input
                  value={reviewForm.role}
                  onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                  placeholder="e.g. CA Finalist · Overthinking Dept"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 text-sm font-body outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-bold mb-1 text-[#1E2A4A] dark:text-slate-200">
                  Review Category
                </label>
                <select
                  value={reviewForm.category}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 text-sm font-body outline-none cursor-pointer"
                >
                  <option value="aesthetic">🎨 Aesthetic Fails</option>
                  <option value="procrastination">⏱️ Pomodoro Excuses</option>
                  <option value="placebo">🧠 Pure Placebo</option>
                  <option value="tears">💧 3 AM Panic & Tears</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-display font-bold mb-1 text-[#1E2A4A] dark:text-slate-200">
                  Tag Badge
                </label>
                <input
                  value={reviewForm.tag}
                  onChange={(e) => setReviewForm({ ...reviewForm, tag: e.target.value })}
                  placeholder="e.g. 🎨 Aesthetic Failure, ☕ 400mg Caffeine"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 text-sm font-body outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold mb-1 text-[#1E2A4A] dark:text-slate-200">
                Your Dubious Review / Study Excuse *
              </label>
              <textarea
                required
                rows={4}
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                placeholder="Tell us what actually happened when you bought study supplies..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2A4A] dark:border-slate-300 bg-white dark:bg-[#1E293B] text-[#1E2A4A] dark:text-slate-100 text-sm font-body outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#1E2A4A]/80 dark:text-slate-300 font-display">
                <span>Rating:</span>
                <span className="text-[#FFC93C] text-base">⭐⭐⭐⭐⭐</span>
                <span className="text-[11px] opacity-70 font-hand">(5 stars mandatory by Dean&apos;s decree)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="btn-doodle btn-ghost px-4 py-2 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-doodle btn-primary px-6 py-2 text-sm sm:text-base cursor-pointer"
              >
                Publish Dubious Review 🎉
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🎭 Fun Layer Modals & Interactive Widgets */}
      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={removeFromWishlist}
        onAddToCart={handleAddWishlistToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
        onClearWishlist={handleClearWishlist}
      />
      <AchievementModal />
      <BrainBatteryModal />
      <BehaviorAnalysisModal cartCount={cartCount} />
      <DegreeGeneratorModal />
      <FuturePredictorModal />
      <DevDiagnosticsModal />
      <CatchTheBooksGameModal />
      <ExamSurvivalGameModal />
      <ProductLabModal />
      <CompatibilityScannerModal />
      <FunToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <FunProvider>
      <AppContent />
    </FunProvider>
  );
}
