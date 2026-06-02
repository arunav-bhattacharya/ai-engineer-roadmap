import roadmap from '../data/roadmap.json';
import type { Roadmap } from '../types/roadmap';

/**
 * Single source of truth for per-week (per-topic) colours.
 * Used by the Overview roadmap nodes AND the Part I / Part II week cards +
 * sidebar dots, so a topic shows the same colour everywhere.
 */
export const WEEK_PALETTE = [
  '#e0913a', // amber
  '#4f9dd6', // blue
  '#56ab6c', // green
  '#9b7fe0', // violet
  '#e07a9b', // rose
  '#3bb6a6', // teal
  '#d9794a', // orange
  '#7fa653', // olive
  '#c77fd4', // orchid
  '#5b8def', // indigo
];

const colorById: Record<string, string> = {};
let i = 0;
for (const part of (roadmap as Roadmap).parts) {
  for (const week of part.weeks) {
    colorById[week.id] = WEEK_PALETTE[i % WEEK_PALETTE.length];
    i += 1;
  }
}

export function weekColor(weekId: string): string {
  return colorById[weekId] ?? WEEK_PALETTE[0];
}
