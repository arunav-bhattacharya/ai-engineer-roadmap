import { describe, expect, it } from 'vitest';
import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { TOTAL_EXERCISES, exerciseCode, exerciseNumber } from './exercises';
import { handsLeafId } from './ids';
import type { Roadmap, Week } from '../types/roadmap';

const completeWeeks = (roadmap as Roadmap).weeks;
const fastWeeks = (fasttrack as { weeks: Week[] }).weeks;

const handsLeaves = (weeks: Week[]): string[] =>
  weeks.flatMap((w) => w.days.flatMap((d, di) => (d.exercise ? [handsLeafId(w.id, di)] : [])));

describe('exercise numbering', () => {
  const completeLeaves = handsLeaves(completeWeeks);
  const fastLeaves = handsLeaves(fastWeeks);
  const allLeaves = [...completeLeaves, ...fastLeaves];

  it('numbers every hands-on day', () => {
    expect(TOTAL_EXERCISES).toBe(allLeaves.length);
    for (const leaf of allLeaves) {
      expect(exerciseNumber(leaf)).toBeTypeOf('number');
    }
  });

  it('assigns unique, contiguous numbers 1..N', () => {
    const nums = allLeaves.map((l) => exerciseNumber(l)!);
    expect(new Set(nums).size).toBe(nums.length);
    expect([...nums].sort((a, b) => a - b)).toEqual(
      Array.from({ length: allLeaves.length }, (_, i) => i + 1),
    );
  });

  it('does not reset between tracks — Complete first, then Fast-Track', () => {
    expect(exerciseNumber(completeLeaves[0])).toBe(1);
    const lastComplete = exerciseNumber(completeLeaves[completeLeaves.length - 1])!;
    expect(exerciseNumber(fastLeaves[0])).toBe(lastComplete + 1);
  });

  it('formats codes zero-padded', () => {
    expect(exerciseCode(1)).toBe('EX-001');
    expect(exerciseCode(137)).toBe('EX-137');
  });
});
