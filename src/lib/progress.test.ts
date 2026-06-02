import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  exportJSON,
  importJSON,
  loadProgress,
  pct,
  saveProgress,
  setMany,
  toggle,
  type ProgressState,
} from './progress';

describe('loadProgress', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty when key absent', () => {
    expect(loadProgress()).toEqual({});
  });

  it('parses valid JSON', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: true, b: true }));
    expect(loadProgress()).toEqual({ a: true, b: true });
  });

  it('tolerates malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json}');
    expect(loadProgress()).toEqual({});
  });

  it('rejects arrays', () => {
    localStorage.setItem(STORAGE_KEY, '[1,2,3]');
    expect(loadProgress()).toEqual({});
  });

  it('normalizes falsy values away', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: true, b: 0, c: false, d: 1 }));
    expect(loadProgress()).toEqual({ a: true, d: true });
  });
});

describe('saveProgress', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips via load', () => {
    const s: ProgressState = { x: true, y: true };
    saveProgress(s);
    expect(loadProgress()).toEqual(s);
  });
});

describe('toggle', () => {
  it('adds a missing id', () => {
    const next = toggle({}, 'a');
    expect(next).toEqual({ a: true });
  });

  it('removes an existing id', () => {
    const next = toggle({ a: true, b: true }, 'a');
    expect(next).toEqual({ b: true });
  });

  it('is pure (does not mutate input)', () => {
    const input: ProgressState = { a: true };
    const next = toggle(input, 'b');
    expect(input).toEqual({ a: true });
    expect(next).not.toBe(input);
  });
});

describe('setMany', () => {
  it('sets all to true', () => {
    expect(setMany({}, ['a', 'b', 'c'], true)).toEqual({ a: true, b: true, c: true });
  });

  it('clears all', () => {
    expect(setMany({ a: true, b: true, c: true, d: true }, ['a', 'c'], false)).toEqual({
      b: true,
      d: true,
    });
  });

  it('does not mutate input', () => {
    const input: ProgressState = { a: true };
    setMany(input, ['b'], true);
    expect(input).toEqual({ a: true });
  });
});

describe('pct', () => {
  it('returns 0 for empty leaf list', () => {
    expect(pct({}, [])).toEqual({ done: 0, total: 0, pct: 0 });
  });

  it('returns 0 when nothing checked', () => {
    expect(pct({}, ['a', 'b'])).toEqual({ done: 0, total: 2, pct: 0 });
  });

  it('handles partial completion with rounding', () => {
    expect(pct({ a: true }, ['a', 'b', 'c'])).toEqual({ done: 1, total: 3, pct: 33 });
  });

  it('returns 100 when fully complete', () => {
    expect(pct({ a: true, b: true }, ['a', 'b'])).toEqual({ done: 2, total: 2, pct: 100 });
  });

  it('ignores irrelevant checked items', () => {
    expect(pct({ a: true, z: true }, ['a', 'b'])).toEqual({ done: 1, total: 2, pct: 50 });
  });
});

describe('roll-up identity', () => {
  it('overall done count equals sum of week done counts', () => {
    const state: ProgressState = { 'w0-0-r0': true, 'w0-0-h': true, 'w1-0-h': true };
    const w0 = ['w0-0-r0', 'w0-0-r1', 'w0-0-h'];
    const w1 = ['w1-0-r0', 'w1-0-h'];
    const all = [...w0, ...w1];
    expect(pct(state, all).done).toBe(pct(state, w0).done + pct(state, w1).done);
    expect(pct(state, all).total).toBe(w0.length + w1.length);
  });
});

describe('importJSON / exportJSON', () => {
  afterEach(() => localStorage.clear());

  it('exportJSON triggers a download', async () => {
    const original = URL.createObjectURL;
    const revoke = URL.revokeObjectURL;
    let downloadName: string | undefined;
    URL.createObjectURL = () => 'blob:fake';
    URL.revokeObjectURL = () => {};
    const origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      downloadName = (this as HTMLAnchorElement).download;
    };
    try {
      exportJSON({ a: true });
      expect(downloadName).toBe('ai-roadmap-progress.json');
    } finally {
      URL.createObjectURL = original;
      URL.revokeObjectURL = revoke;
      HTMLAnchorElement.prototype.click = origClick;
    }
  });

  it('importJSON parses a file into state', async () => {
    const json = JSON.stringify({ x: true, y: true, z: 0 });
    const file = new File([json], 'p.json', { type: 'application/json' });
    const out = await importJSON(file);
    expect(out).toEqual({ x: true, y: true });
  });

  it('importJSON rejects malformed json', async () => {
    const file = new File(['{nope'], 'p.json', { type: 'application/json' });
    await expect(importJSON(file)).rejects.toThrow();
  });

  it('importJSON rejects arrays', async () => {
    const file = new File(['[1,2,3]'], 'p.json', { type: 'application/json' });
    await expect(importJSON(file)).rejects.toThrow();
  });
});
