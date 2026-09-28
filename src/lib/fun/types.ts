export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'discovery' | 'academic' | 'procrastination' | 'mastery';
}

export interface EasterEgg {
  id: string;
  name: string;
  hint: string;
  discovered: boolean;
  discoveredAt?: number;
}

export interface StudentLevel {
  level: number;
  title: string;
  minXP: number;
  perk: string;
  emoji: string;
}

export interface DegreeCertificate {
  degree: string;
  major: string;
  minor: string;
  specialization: string;
  cgpa: string;
  status: string;
  honors: string;
  issuedAt: string;
}

export interface AcademicPrediction {
  buyNotebooks: number;
  useNotebooks: number;
  researchHours: number;
  daysBeforeExam: number;
  confidence: number;
  quote: string;
}
