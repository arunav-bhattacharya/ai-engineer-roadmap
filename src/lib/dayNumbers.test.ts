import { describe, expect, it } from 'vitest';
import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { dayLabel } from './dayNumbers';
import type { Roadmap, Week } from '../types/roadmap';

const complete = (roadmap as Roadmap).weeks;
const fast = (fasttrack as { weeks: Week[] }).weeks;

const SINGLE = /^\d+$/;
const RANGE = /^(\d+)\s*[–—-]\s*(\d+)$/;

/** Re-derive the expected continuous sequence and assert dayLabel matches it. */
function checkTrack(weeks: Week[]): number {
  let counter = 0;
  for (const w of weeks) {
    w.days.forEach((d, di) => {
      const raw = (d.n ?? '').trim();
      const range = RANGE.exec(raw);
      if (SINGLE.test(raw)) {
        counter += 1;
        expect(dayLabel(w.id, di)).toBe(String(counter));
      } else if (range) {
        const span = Number(range[2]) - Number(range[1]) + 1;
        expect(dayLabel(w.id, di)).toBe(`${counter + 1}–${counter + span}`);
        counter += span;
      } else {
        expect(dayLabel(w.id, di)).toBe(raw); // passthrough, counter unchanged
      }
    });
  }
  return counter;
}

describe('continuous day numbering', () => {
  it('runs one sequence per track without resetting each week', () => {
    expect(dayLabel('w0', 0)).toBe('1');
    expect(dayLabel('w0', 4)).toBe('5');
    expect(dayLabel('w1', 0)).toBe('6'); // continues across the week boundary
    expect(dayLabel('ft0', 0)).toBe('1'); // Fast-Track is its own sequence
  });

  it('matches the derived sequence across every complete-plan day', () => {
    expect(checkTrack(complete)).toBeGreaterThan(20);
  });

  it('matches the derived sequence across every fast-track day', () => {
    expect(checkTrack(fast)).toBeGreaterThan(10);
  });

  it('passes capstone phase labels through unchanged', () => {
    const w15 = complete.find((w) => w.id === 'w15')!;
    expect(dayLabel('w15', 0)).toBe(w15.days[0].n);
  });
});
