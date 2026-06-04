import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { handsLeafId } from './ids';
import type { Roadmap, Week } from '../types/roadmap';

/**
 * Global, track-independent exercise numbering.
 *
 * Every day that has a hands-on item gets a unique number that does NOT reset
 * between plans: the Complete Plan is walked first (in roadmap.json order),
 * then the Fast-Track (fasttrack.json order). Numbers are keyed by the day's
 * handsLeafId (e.g. `w0-0-h`, `ft3-2-h`) so they stay stable regardless of how
 * the views are composed, and are derived here (not baked into the JSON).
 */
const numberByLeaf: Record<string, number> = {};

let n = 0;
const register = (weeks: Week[]) => {
  weeks.forEach((w) => {
    w.days.forEach((d, di) => {
      // Only days with a structured exercise are numbered. (The capstone's
      // phase rows have `hands` text but no `exercise` — they're one project.)
      if (d.exercise) {
        n += 1;
        numberByLeaf[handsLeafId(w.id, di)] = n;
      }
    });
  });
};

register((roadmap as Roadmap).weeks);
register((fasttrack as { weeks: Week[] }).weeks);

export const TOTAL_EXERCISES = n;

export function exerciseNumber(handsLeaf: string): number | undefined {
  return numberByLeaf[handsLeaf];
}

export function exerciseCode(num: number): string {
  return `EX-${String(num).padStart(3, '0')}`;
}
