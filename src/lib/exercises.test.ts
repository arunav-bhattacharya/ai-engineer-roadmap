import { describe, expect, it } from 'vitest';
import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { TOTAL_EXERCISES, exerciseCode, exerciseNumber } from './exercises';
import { handsLeafId } from './ids';
import type { Roadmap, Week } from '../types/roadmap';

const completeWeeks = (roadmap as Roadmap).weeks;
const fastWeeks = (fasttrack as { weeks: Week[] }).weeks;

interface Leaf {
  leaf: string;
  exId: string;
}
const leaves = (weeks: Week[]): Leaf[] =>
  weeks.flatMap((w) =>
    w.days.flatMap((d, di) =>
      d.exercise ? [{ leaf: handsLeafId(w.id, di), exId: d.exercise.exId }] : [],
    ),
  );

describe('exercise numbering', () => {
  const completeLeaves = leaves(completeWeeks);
  const fastLeaves = leaves(fastWeeks);
  const allLeaves = [...completeLeaves, ...fastLeaves];
  const uniqueExIds = new Set(allLeaves.map((l) => l.exId));

  it('numbers every hands-on day', () => {
    for (const { leaf } of allLeaves) {
      expect(exerciseNumber(leaf)).toBeTypeOf('number');
    }
  });

  it('gives every exercise a non-empty exId', () => {
    for (const { exId } of allLeaves) {
      expect(exId).toBeTruthy();
    }
  });

  it('counts distinct exercises in TOTAL_EXERCISES (shared counted once)', () => {
    expect(TOTAL_EXERCISES).toBe(uniqueExIds.size);
    // Some exercises are shared across tracks, so distinct < total leaves.
    expect(TOTAL_EXERCISES).toBeLessThan(allLeaves.length);
  });

  it('assigns a contiguous, unique number per distinct exercise (1..N)', () => {
    const firstLeafByExId = new Map<string, string>();
    for (const { exId, leaf } of allLeaves) {
      if (!firstLeafByExId.has(exId)) firstLeafByExId.set(exId, leaf);
    }
    const nums = [...firstLeafByExId.values()].map((leaf) => exerciseNumber(leaf)!);
    expect(new Set(nums).size).toBe(uniqueExIds.size);
    expect([...nums].sort((a, b) => a - b)).toEqual(
      Array.from({ length: uniqueExIds.size }, (_, i) => i + 1),
    );
  });

  it('gives the same number to an exercise that appears in both tracks', () => {
    const completeById = new Map(completeLeaves.map((l) => [l.exId, l.leaf]));
    const sharedPairs = fastLeaves.filter((l) => completeById.has(l.exId));
    expect(sharedPairs.length).toBe(7);
    for (const { exId, leaf } of sharedPairs) {
      expect(exerciseNumber(leaf)).toBe(exerciseNumber(completeById.get(exId)!));
    }
  });

  it('numbers the Complete Plan first (its first exercise is EX-001)', () => {
    expect(exerciseNumber(completeLeaves[0].leaf)).toBe(1);
  });

  it('formats codes zero-padded', () => {
    expect(exerciseCode(1)).toBe('EX-001');
    expect(exerciseCode(137)).toBe('EX-137');
  });
});
