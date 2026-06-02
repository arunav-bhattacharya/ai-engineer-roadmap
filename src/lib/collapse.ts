export type CollapsedSet = Set<string>;

export const COLLAPSE_KEY = 'ai-roadmap-collapsed-v1';

// We persist the set of COLLAPSED week IDs. Empty set => everything expanded.

export function loadCollapsed(): CollapsedSet {
  try {
    const raw = localStorage.getItem(COLLAPSE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

export function saveCollapsed(set: CollapsedSet): void {
  try {
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...set]));
  } catch {
    // storage unavailable; ignore
  }
}

export function toggle(set: CollapsedSet, id: string): CollapsedSet {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function collapseAll(set: CollapsedSet, ids: string[]): CollapsedSet {
  const next = new Set(set);
  for (const id of ids) next.add(id);
  return next;
}

export function expandAll(set: CollapsedSet, ids: string[]): CollapsedSet {
  const next = new Set(set);
  for (const id of ids) next.delete(id);
  return next;
}

export function isCollapsed(set: CollapsedSet, id: string): boolean {
  return set.has(id);
}
