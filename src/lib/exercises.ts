import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { handsLeafId } from './ids';
import type { Roadmap, Week } from '../types/roadmap';

/**
 * Global, track-independent exercise numbering keyed by a stable per-exercise
 * identity (`exId`).
 *
 * An exercise that appears in both plans carries the *same* `exId`, so it gets
 * ONE number — its `EX-###` code matches across the Complete Plan and the
 * Fast-Track. Different exercises always get distinct numbers.
 *
 * Numbers are assigned in reading order — the Complete Plan first
 * (roadmap.json), then any Fast-Track-only exercises (fasttrack.json) — and are
 * derived here, not baked into the JSON. `numberByLeaf` maps each day's
 * handsLeafId (e.g. `w0-0-h`, `ft3-2-h`) to its number for the UI lookup.
 */
const slug = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const numberByExId: Record<string, number> = {};
const numberByLeaf: Record<string, number> = {};

let n = 0;
const register = (weeks: Week[]) => {
  weeks.forEach((w) => {
    w.days.forEach((d, di) => {
      // Only days with a structured exercise are numbered. (The capstone's
      // phase rows have `hands` text but no `exercise` — they're one project.)
      if (!d.exercise) return;
      const exId = d.exercise.exId ?? slug(d.focusTitle);
      if (numberByExId[exId] === undefined) {
        n += 1;
        numberByExId[exId] = n;
      }
      numberByLeaf[handsLeafId(w.id, di)] = numberByExId[exId];
    });
  });
};

register((roadmap as Roadmap).weeks);
register((fasttrack as { weeks: Week[] }).weeks);

/** Count of distinct exercises (an exercise shared across tracks is counted once). */
export const TOTAL_EXERCISES = n;

export function exerciseNumber(handsLeaf: string): number | undefined {
  return numberByLeaf[handsLeaf];
}

export function exerciseCode(num: number): string {
  return `EX-${String(num).padStart(3, '0')}`;
}
