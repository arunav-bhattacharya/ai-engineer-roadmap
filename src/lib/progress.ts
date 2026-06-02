export type ProgressState = Record<string, true>;

export const STORAGE_KEY = 'ai-roadmap-progress-v1';

export interface PctSummary {
  done: number;
  total: number;
  pct: number;
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return normalize(parsed);
    }
    return {};
  } catch {
    return {};
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode, quota); ignore.
  }
}

function normalize(obj: Record<string, unknown>): ProgressState {
  const out: ProgressState = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v) out[k] = true;
  }
  return out;
}

export function toggle(state: ProgressState, id: string): ProgressState {
  const next = { ...state };
  if (next[id]) delete next[id];
  else next[id] = true;
  return next;
}

export function setMany(
  state: ProgressState,
  ids: string[],
  on: boolean,
): ProgressState {
  const next = { ...state };
  if (on) {
    for (const id of ids) next[id] = true;
  } else {
    for (const id of ids) delete next[id];
  }
  return next;
}

export function pct(state: ProgressState, leafIds: string[]): PctSummary {
  const total = leafIds.length;
  if (total === 0) return { done: 0, total: 0, pct: 0 };
  let done = 0;
  for (const id of leafIds) if (state[id]) done += 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function exportJSON(state: ProgressState, filename = 'ai-roadmap-progress.json'): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<ProgressState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.onload = () => {
      try {
        const raw = String(reader.result ?? '');
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          reject(new Error('Invalid progress file.'));
          return;
        }
        resolve(normalize(parsed as Record<string, unknown>));
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Failed to parse JSON.'));
      }
    };
    reader.readAsText(file);
  });
}
