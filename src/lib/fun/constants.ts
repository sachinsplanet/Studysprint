import { Achievement, EasterEgg, StudentLevel } from './types';

export const STUDENT_LEVELS: StudentLevel[] = [
  { level: 1, title: 'Confused Freshman', minXP: 0, perk: 'Unlocked ability to stare blankly at syllabus', emoji: '🐣' },
  { level: 2, title: 'Stationery Apprentice', minXP: 50, perk: 'Learned that buying pens does not automatically transfer knowledge', emoji: '✏️' },
  { level: 3, title: 'Homework Survivor', minXP: 120, perk: 'Can color-code notes while crying', emoji: '🛡️' },
  { level: 4, title: 'Academic Explorer', minXP: 250, perk: 'Mastered opening 27 Wikipedia tabs and closing 0', emoji: '🧭' },
  { level: 5, title: 'Professional Student', minXP: 450, perk: 'Understands that 25-minute Pomodoro breaks usually take 4 days', emoji: '💼' },
  { level: 6, title: 'Academic Weapon', minXP: 750, perk: 'Able to cram a 4-month semester in 6 hours with 3 highlighters', emoji: '⚔️' },
  { level: 7, title: 'Exam Veteran', minXP: 1200, perk: 'Immune to existential dread between the hours of 2 AM and 5 AM', emoji: '🎖️' },
  { level: 8, title: 'Legendary Procrastinator', minXP: 2000, perk: 'Transcendence: achieved top grade without ever opening textbook', emoji: '👑' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_egg',
    title: '🥚 Easter Egg Hunter',
    description: 'Found your first hidden Easter egg across StudyKit.',
    emoji: '🥚',
    unlocked: false,
    category: 'discovery'
  },
  {
    id: 'forbidden_clicker',
    title: '🖱️ Professional Clicker',
    description: 'Clicked the forbidden DO NOT CLICK button despite explicit warnings.',
    emoji: '⚠️',
    unlocked: false,
    category: 'procrastination'
  },
  {
    id: 'academic_weapon',
    title: '📚 Academic Weapon',
    description: 'Accumulated enough Academic XP to reach Level 6 or beyond.',
    emoji: '⚔️',
    unlocked: false,
    category: 'academic'
  },
  {
    id: 'web_detective',
    title: '🕵️ Website Investigator',
    description: 'Discovered at least 5 hidden Easter eggs and secret features.',
    emoji: '🕵️',
    unlocked: false,
    category: 'discovery'
  },
  {
    id: 'lab_scientist',
    title: '🧪 Stationery Scientist',
    description: 'Ran a complete fictional laboratory compatibility scan on a study kit.',
    emoji: '🧪',
    unlocked: false,
    category: 'academic'
  },
  {
    id: 'degree_master',
    title: '🎓 Degree Collector',
    description: 'Generated 3 or more wildly dubious academic degrees.',
    emoji: '🎓',
    unlocked: false,
    category: 'procrastination'
  },
  {
    id: 'game_champ',
    title: '🎮 Mini-Game Champion',
    description: 'Scored 100+ points in the Catch The Books or Exam Survival mini-game.',
    emoji: '🎮',
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'hacker_mode',
    title: '💻 Secret Diagnostics Guru',
    description: 'Found Developer Mode via Ctrl+Shift+S or secret mobile tap.',
    emoji: '💻',
    unlocked: false,
    category: 'discovery'
  },
  {
    id: 'suspicious_visitor',
    title: '👀 Suspicious Visitor',
    description: 'Triggered the unusual student activity watcher by over-clicking.',
    emoji: '👀',
    unlocked: false,
    category: 'procrastination'
  },
  {
    id: 'battery_checker',
    title: '🧠 Neuro-Inspector',
    description: 'Checked your Brain Battery charge level to diagnose mental status.',
    emoji: '🧠',
    unlocked: false,
    category: 'academic'
  },
  {
    id: 'cart_overthinker',
    title: '🛒 Cart Overthinker',
    description: 'Packed 5+ items or custom kit into the cart like a true stationery hoarder.',
    emoji: '🛍️',
    unlocked: false,
    category: 'academic'
  },
  {
    id: 'oracle_believer',
    title: '🔮 Future Visionary',
    description: 'Consulted the Academic Future Predictor for exam fortune telling.',
    emoji: '🔮',
    unlocked: false,
    category: 'mastery'
  }
];

export const INITIAL_EASTER_EGGS: EasterEgg[] = [
  { id: 'logo_doodle', name: 'Lightning Bolt Tickle', hint: 'Click the StudySprint lightning bolt in header 5 times.', discovered: false },
  { id: 'secret_command_study', name: 'Secret Command: study', hint: 'Type "study" anywhere on your keyboard.', discovered: false },
  { id: 'secret_command_coffee', name: 'Secret Command: coffee', hint: 'Type "coffee" anywhere on your keyboard.', discovered: false },
  { id: 'secret_command_exam', name: 'Secret Command: exam', hint: 'Type "exam" on your keyboard.', discovered: false },
  { id: 'secret_command_admin', name: 'Secret Command: admin', hint: 'Type "admin" to attempt fake breach.', discovered: false },
  { id: 'forbidden_button_10', name: 'Button Defiance', hint: 'Keep clicking the Do Not Click widget until it gives up.', discovered: false },
  { id: 'footer_sachin_heart', name: 'Architect Appreciation', hint: 'Click the "Store by Sachin" link badge in footer.', discovered: false },
  { id: 'search_procrastination', name: 'Academic Search Query', hint: 'Search for "procrastination", "coffee", or "exam" in search bar.', discovered: false },
  { id: 'mascot_patter', name: 'Mascot Boop', hint: 'Click the doodle mascot directly 3 times.', discovered: false },
  { id: 'dev_diagnostics', name: 'Developer Portal', hint: 'Press Ctrl+Shift+S (or tap the Diagnostics button in Fun controls).', discovered: false },
];

export const CART_PERSONALITY_MESSAGES = {
  empty: {
    title: 'Your cart is empty.',
    subtitle: 'Just like your revision schedule.',
    tag: 'Zero Academic Baggage'
  },
  one: {
    title: 'A respectable beginning.',
    subtitle: 'Every 9.9 GPA journey starts with a single high-friction gel pen.',
    tag: 'Apprentice Energy'
  },
  few: {
    title: 'Someone is taking this semester seriously.',
    subtitle: 'We see the ambition. Don’t let these notebooks become bedroom decor.',
    tag: 'Study Grind Loading'
  },
  heavy: {
    title: 'Academic preparation detected.',
    subtitle: 'The stationery-to-effort ratio is approaching peak performance.',
    tag: 'Overprepared Scholar'
  },
  boss: {
    title: '🚨 ACADEMIC WEAPON DETECTED.',
    subtitle: 'With this much gear, you could teach the class and redesign the syllabus.',
    tag: 'Nuclear Grade Student'
  }
};
