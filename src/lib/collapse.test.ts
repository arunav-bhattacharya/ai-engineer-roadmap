import { beforeEach, describe, expect, it } from 'vitest';
import {
  COLLAPSE_KEY,
  collapseAll,
  expandAll,
  isCollapsed,
  loadCollapsed,
  saveCollapsed,
  toggle,
} from './collapse';

describe('loadCollapsed', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty set when key absent', () => {
    expect([...loadCollapsed()]).toEqual([]);
  });

  it('parses an array of ids', () => {
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(['w0', 'w1']));
    expect([...loadCollapsed()].sort()).toEqual(['w0', 'w1']);
  });

  it('tolerates malformed JSON', () => {
    localStorage.setItem(COLLAPSE_KEY, '{bad');
    expect([...loadCollapsed()]).toEqual([]);
  });

  it('ignores non-array shapes', () => {
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify({ w0: true }));
    expect([...loadCollapsed()]).toEqual([]);
  });

  it('filters non-string members', () => {
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(['w0', 3, null, 'w2']));
    expect([...loadCollapsed()].sort()).toEqual(['w0', 'w2']);
  });
});

describe('saveCollapsed', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips via load', () => {
    saveCollapsed(new Set(['w5', 'w8']));
    expect([...loadCollapsed()].sort()).toEqual(['w5', 'w8']);
  });
});

describe('toggle', () => {
  it('adds a missing id', () => {
    expect([...toggle(new Set(), 'w0')]).toEqual(['w0']);
  });

  it('removes an existing id', () => {
    expect([...toggle(new Set(['w0', 'w1']), 'w0')].sort()).toEqual(['w1']);
  });

  it('is pure (does not mutate input)', () => {
    const input = new Set(['w0']);
    toggle(input, 'w1');
    expect([...input]).toEqual(['w0']);
  });
});

describe('collapseAll / expandAll', () => {
  it('collapseAll adds all ids', () => {
    expect([...collapseAll(new Set(), ['w0', 'w1', 'w2'])].sort()).toEqual(['w0', 'w1', 'w2']);
  });

  it('collapseAll merges with existing', () => {
    expect([...collapseAll(new Set(['w0']), ['w1'])].sort()).toEqual(['w0', 'w1']);
  });

  it('expandAll removes the given ids', () => {
    expect([...expandAll(new Set(['w0', 'w1', 'w2']), ['w0', 'w2'])]).toEqual(['w1']);
  });

  it('expandAll on all ids clears the set', () => {
    expect([...expandAll(new Set(['w0', 'w1']), ['w0', 'w1'])]).toEqual([]);
  });
});

describe('isCollapsed', () => {
  it('reflects membership', () => {
    const s = new Set(['w3']);
    expect(isCollapsed(s, 'w3')).toBe(true);
    expect(isCollapsed(s, 'w4')).toBe(false);
  });
});
