import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { getSafeStorage, setSafeStorage, STORAGE_KEYS } from '../storage';

describe('Storage Utility (Safe LocalStorage Wrapper)', () => {
  const store: Record<string, string> = {};

  beforeAll(() => {
    (globalThis as any).window = globalThis;
    (globalThis as any).localStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = String(v);
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    };
  });

  beforeEach(() => {
    (globalThis as any).localStorage.clear();
  });

  it('defines all required persistent storage keys', () => {
    expect(STORAGE_KEYS.XP).toBe('studyKitXP');
    expect(STORAGE_KEYS.LEVEL).toBe('studyKitLevel');
    expect(STORAGE_KEYS.ACHIEVEMENTS).toBe('studyKitAchievements');
    expect(STORAGE_KEYS.BRAIN_BATTERY).toBe('studyKitBrainBattery');
    expect(STORAGE_KEYS.GAME_SCORES).toBe('studyKitGameScores');
    expect(STORAGE_KEYS.SOUND).toBe('studyKitSound');
  });

  it('returns default value when item does not exist in localStorage', () => {
    const result = getSafeStorage('nonexistent-key', { count: 42 });
    expect(result).toEqual({ count: 42 });
  });

  it('stores and retrieves JSON serialized data safely', () => {
    const testData = { xp: 120, rank: 'Study Prodigy', unlocked: true };
    setSafeStorage('test-storage-key', testData);
    const retrieved = getSafeStorage('test-storage-key', null);
    expect(retrieved).toEqual(testData);
  });

  it('gracefully handles corrupted JSON in localStorage', () => {
    (globalThis as any).localStorage.setItem('corrupted-key', '{ invalid json ...');
    const result = getSafeStorage('corrupted-key', 'safe-fallback');
    expect(result).toBe('safe-fallback');
  });
});
