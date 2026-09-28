export const STORAGE_KEYS = {
  XP: 'studyKitXP',
  LEVEL: 'studyKitLevel',
  ACHIEVEMENTS: 'studyKitAchievements',
  EASTER_EGGS: 'studyKitEasterEggs',
  BRAIN_BATTERY: 'studyKitBrainBattery',
  VISIT_COUNT: 'studyKitVisitCount',
  SECRET_COMMANDS: 'studyKitSecretCommands',
  GAME_SCORES: 'studyKitGameScores',
  FUN_MODE: 'studyKitFunMode',
  SOUND: 'studyKitSound',
  DO_NOT_CLICK: 'studyKitDoNotClickCount',
} as const;

export function getSafeStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function setSafeStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota or storage disabled errors
  }
}
