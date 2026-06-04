import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { rowMasterId } from './ids';
import type { Roadmap, Week } from '../types/roadmap';

/**
 * Continuous, per-track day numbering.
 *
 * Day labels run as a single sequence within each plan instead of resetting to
 * "1" at the start of every week. Labels are derived from each day's stored `n`
 * (which also encodes multi-day spans like `2–3`) and are not baked into the
 * JSON:
 *
 * - a plain number   → the next number in the running sequence
 * - a range (`2–3`)  → consumes the span, rendered as a continuous range (`8–9`)
 * - anything else    → the capstone's phase labels (e.g. `W15 · Mon–Tue`) pass
 *                      through unchanged and do not advance the counter.
 *
 * The Complete Plan and the Fast-Track each get their own sequence starting at 1.
 */
const labelByMaster: Record<string, string> = {};

const SINGLE = /^\d+$/;
const RANGE = /^(\d+)\s*[–—-]\s*(\d+)$/;

const register = (weeks: Week[]) => {
  let counter = 0;
  weeks.forEach((w) => {
    w.days.forEach((d, di) => {
      const key = rowMasterId(w.id, di);
      const raw = (d.n ?? '').trim();
      const range = RANGE.exec(raw);
      if (SINGLE.test(raw)) {
        counter += 1;
        labelByMaster[key] = String(counter);
      } else if (range) {
        const span = Math.max(1, Number(range[2]) - Number(range[1]) + 1);
        labelByMaster[key] = `${counter + 1}–${counter + span}`;
        counter += span;
      } else {
        // Non-numeric (capstone phase labels) — keep as authored, don't count.
        labelByMaster[key] = raw;
      }
    });
  });
};

register((roadmap as Roadmap).weeks);
register((fasttrack as { weeks: Week[] }).weeks);

export function dayLabel(weekId: string, dayIdx: number): string {
  return labelByMaster[rowMasterId(weekId, dayIdx)] ?? '';
}
