import type { CloudlineRun } from './engine';

export interface CloudlineCareer { xp: number }

export const MAX_CAREER_XP = 1_000_000_000;
export const XP_PER_DELIVERY = 10;
export const XP_PER_CIRCUIT = 25;
export const XP_PER_CARGO = 5;
export const XP_PER_UPGRADE = 15;
export const XP_PER_DISTRICT = 100;

export interface CourierRank { rank: number; title: string; minXp: number }

export const COURIER_RANKS: readonly CourierRank[] = [
  { rank: 1, title: 'Apprentice Courier', minXp: 0 },
  { rank: 2, title: 'Dock Runner', minXp: 100 },
  { rank: 3, title: 'Windward Courier', minXp: 250 },
  { rank: 4, title: 'Route Keeper', minXp: 500 },
  { rank: 5, title: 'Skyway Pilot', minXp: 900 },
  { rank: 6, title: 'Charter Pilot', minXp: 1500 },
  { rank: 7, title: 'Cloudline Captain', minXp: 2400 },
  { rank: 8, title: 'Master of the Aerie', minXp: 3600 },
];

export interface RankStanding { rank: CourierRank; next: CourierRank | null; xpIntoRank: number; xpForNext: number | null }

export function rankStanding(xp: number): RankStanding {
  const safeXp = Number.isNaN(xp) || xp < 0 ? 0 : xp;
  let index = 0;
  for (let i = 1; i < COURIER_RANKS.length; i++) {
    if (COURIER_RANKS[i].minXp <= safeXp) index = i;
  }
  const rank = COURIER_RANKS[index];
  const next = COURIER_RANKS[index + 1] ?? null;
  return {
    rank,
    next,
    xpIntoRank: safeXp - rank.minXp,
    xpForNext: next ? next.minXp - rank.minXp : null,
  };
}

export function xpFromFlight(before: CloudlineRun, after: CloudlineRun): number {
  return Math.max(0, after.deliveries - before.deliveries) * XP_PER_DELIVERY + Math.max(0, after.circuits - before.circuits) * XP_PER_CIRCUIT;
}

export function xpForUpgrade(before: CloudlineRun, after: CloudlineRun): number {
  return XP_PER_UPGRADE + (after.district > before.district ? XP_PER_DISTRICT : 0);
}

export function xpFromRun(run: CloudlineRun): number {
  const landmarkStages = run.landmarks.reduce((sum, stage) => sum + stage, 0);
  return run.deliveries * XP_PER_DELIVERY + run.circuits * XP_PER_CIRCUIT + (run.district - 1) * XP_PER_DISTRICT + landmarkStages * XP_PER_UPGRADE;
}

export function awardXp(career: CloudlineCareer, amount: number): CloudlineCareer {
  if (!Number.isFinite(amount) || amount <= 0) return { ...career };
  return { ...career, xp: Math.min(MAX_CAREER_XP, career.xp + Math.floor(amount)) };
}
