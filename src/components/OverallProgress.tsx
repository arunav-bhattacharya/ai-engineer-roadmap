import { useRef } from 'react';
import { useProgress } from '../lib/ProgressContext';
import { leavesForPart, leavesForRoadmap } from '../lib/ids';
import type { Roadmap } from '../types/roadmap';

interface Stat {
  done: number;
  total: number;
  pct: number;
}

export function OverallProgress({
  roadmap,
  variant = 'dash',
}: {
  roadmap: Roadmap;
  variant?: 'dash' | 'hero';
}) {
  const { pct, exportNow, importNow, reset } = useProgress();
  const o = pct(leavesForRoadmap(roadmap));
  const s1 = pct(leavesForPart(roadmap.parts[0]));
  const s2 = pct(leavesForPart(roadmap.parts[1]));
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onImport = () => fileRef.current?.click();
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importNow(file);
    } catch {
      alert('Could not read that file.');
    } finally {
      e.target.value = '';
    }
  };
  const onReset = () => {
    if (confirm('Reset all progress?')) reset();
  };

  return (
    <div className={`dash${variant === 'hero' ? ' dash-hero' : ''}`}>
      <div className="dash-top">
        <div className="ring" style={{ '--p': o.pct } as React.CSSProperties}>
          <div>{o.pct}%</div>
        </div>
        <div className="dashinfo">
          <div className="t">Your progress</div>
          <div className="s">
            {o.done} of {o.total} items complete
          </div>
        </div>
      </div>

      <div className="partbars">
        <PartBar label="Build" s={s1} />
        <PartBar label="Depth" s={s2} />
      </div>

      <div className="toolbar">
        <button type="button" onClick={exportNow}>
          Export
        </button>
        <button type="button" onClick={onImport}>
          Import
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}

function PartBar({ label, s }: { label: string; s: Stat }) {
  return (
    <div className="partbar-row">
      <span className="partbar-label mono">{label}</span>
      <span className="partbar-track">
        <i style={{ width: `${s.pct}%` }} />
      </span>
      <span className="partbar-val mono">
        {s.done}/{s.total} · {s.pct}%
      </span>
    </div>
  );
}
