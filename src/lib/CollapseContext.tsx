import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  COLLAPSE_KEY,
  collapseAll as collapseAllSet,
  expandAll as expandAllSet,
  isCollapsed as isCollapsedSet,
  loadCollapsed,
  saveCollapsed,
  toggle as toggleSet,
  type CollapsedSet,
} from './collapse';
import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { FT_TOPIC_GROUPS, TOPIC_GROUPS } from './topics';
import type { Roadmap, Week } from '../types/roadmap';

/**
 * On a first-ever visit (no stored value) both plans open fully collapsed:
 * seed the set with every week id + every `section-<id>` topic key.
 */
function buildDefaultCollapsed(): CollapsedSet {
  const ids: string[] = [];
  for (const w of (roadmap as Roadmap).weeks) ids.push(w.id);
  for (const w of (fasttrack as { weeks: Week[] }).weeks) ids.push(w.id);
  for (const tg of [...TOPIC_GROUPS, ...FT_TOPIC_GROUPS]) ids.push(`section-${tg.id}`);
  return new Set(ids);
}

function initialCollapsed(): CollapsedSet {
  try {
    if (localStorage.getItem(COLLAPSE_KEY) === null) return buildDefaultCollapsed();
  } catch {
    /* storage unavailable — fall through to loadCollapsed */
  }
  return loadCollapsed();
}

interface CollapseCtx {
  collapsed: CollapsedSet;
  isCollapsed: (id: string) => boolean;
  toggle: (id: string) => void;
  expand: (id: string) => void;
  collapseAll: (ids: string[]) => void;
  expandAll: (ids: string[]) => void;
}

const Ctx = createContext<CollapseCtx | null>(null);

export function CollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<CollapsedSet>(initialCollapsed);

  useEffect(() => {
    saveCollapsed(collapsed);
  }, [collapsed]);

  const isCollapsed = useCallback((id: string) => isCollapsedSet(collapsed, id), [collapsed]);
  const toggle = useCallback((id: string) => setCollapsed((s) => toggleSet(s, id)), []);
  const expand = useCallback(
    (id: string) => setCollapsed((s) => expandAllSet(s, [id])),
    [],
  );
  const collapseAll = useCallback(
    (ids: string[]) => setCollapsed((s) => collapseAllSet(s, ids)),
    [],
  );
  const expandAll = useCallback(
    (ids: string[]) => setCollapsed((s) => expandAllSet(s, ids)),
    [],
  );

  const value = useMemo<CollapseCtx>(
    () => ({ collapsed, isCollapsed, toggle, expand, collapseAll, expandAll }),
    [collapsed, isCollapsed, toggle, expand, collapseAll, expandAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCollapse(): CollapseCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCollapse must be used within CollapseProvider');
  return v;
}
