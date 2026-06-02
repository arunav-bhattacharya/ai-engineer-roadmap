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
  collapseAll as collapseAllSet,
  expandAll as expandAllSet,
  isCollapsed as isCollapsedSet,
  loadCollapsed,
  saveCollapsed,
  toggle as toggleSet,
  type CollapsedSet,
} from './collapse';

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
  const [collapsed, setCollapsed] = useState<CollapsedSet>(() => loadCollapsed());

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
