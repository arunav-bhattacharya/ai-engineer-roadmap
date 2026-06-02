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
  exportJSON as exportJSONFile,
  importJSON as importJSONFile,
  loadProgress,
  pct as pctOf,
  saveProgress,
  setMany as setManyState,
  toggle as toggleState,
  type PctSummary,
  type ProgressState,
} from './progress';

interface ProgressCtx {
  state: ProgressState;
  isChecked: (id: string) => boolean;
  toggleOne: (id: string) => void;
  toggleMany: (ids: string[], on: boolean) => void;
  pct: (leafIds: string[]) => PctSummary;
  exportNow: () => void;
  importNow: (file: File) => Promise<void>;
  reset: () => void;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const isChecked = useCallback((id: string) => Boolean(state[id]), [state]);
  const toggleOne = useCallback((id: string) => setState((s) => toggleState(s, id)), []);
  const toggleMany = useCallback(
    (ids: string[], on: boolean) => setState((s) => setManyState(s, ids, on)),
    [],
  );
  const pct = useCallback((ids: string[]) => pctOf(state, ids), [state]);

  const exportNow = useCallback(() => exportJSONFile(state), [state]);
  const importNow = useCallback(async (file: File) => {
    const next = await importJSONFile(file);
    setState(next);
  }, []);
  const reset = useCallback(() => setState({}), []);

  const value = useMemo<ProgressCtx>(
    () => ({ state, isChecked, toggleOne, toggleMany, pct, exportNow, importNow, reset }),
    [state, isChecked, toggleOne, toggleMany, pct, exportNow, importNow, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be used within ProgressProvider');
  return v;
}
