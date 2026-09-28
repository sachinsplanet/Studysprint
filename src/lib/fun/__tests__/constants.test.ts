import { describe, it, expect } from 'vitest';
import { STUDENT_LEVELS, INITIAL_ACHIEVEMENTS, INITIAL_EASTER_EGGS } from '../constants';

describe('Game Constants & Leveling Configuration', () => {
  it('defines ascending XP thresholds across all student levels', () => {
    expect(STUDENT_LEVELS.length).toBeGreaterThan(5);
    for (let i = 1; i < STUDENT_LEVELS.length; i++) {
      expect(STUDENT_LEVELS[i].minXP).toBeGreaterThan(STUDENT_LEVELS[i - 1].minXP);
      expect(STUDENT_LEVELS[i].level).toBe(STUDENT_LEVELS[i - 1].level + 1);
    }
  });

  it('contains the game_champ achievement with mastery category', () => {
    const gameChamp = INITIAL_ACHIEVEMENTS.find((a) => a.id === 'game_champ');
    expect(gameChamp).toBeDefined();
    expect(gameChamp?.category).toBe('mastery');
    expect(gameChamp?.title).toContain('Mini-Game Champion');
  });

  it('contains registered easter eggs with valid identifiers', () => {
    expect(INITIAL_EASTER_EGGS.length).toBeGreaterThanOrEqual(5);
    const ids = INITIAL_EASTER_EGGS.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
