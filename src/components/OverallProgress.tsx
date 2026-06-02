import { useRef } from 'react';
import { useProgress } from '../lib/ProgressContext';
import { leavesForPart, leavesForRoadmap } from '../lib/ids';
import type { Roadmap } from '../types/roadmap';

export function OverallProgress({
  roadmap,
  variant = 'dash',
}: {
  roadmap: Roadmap;
  variant?: 'dash' | 'hero';
}) {
  const { pct, exportNow, importNow, reset } = useProgress();
  const all = leavesForRoadmap(roadmap);
  const p1 = leavesForPart(roadmap.parts[0]);
  const p2 = leavesForPart(roadmap.parts[1]);
  const o = pct(all);
  const s1 = pct(p1);
  const s2 = pct(p2);
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
      <div className="ring" style={{ '--p': o.pct } as React.CSSProperties}>
        <div>{o.pct}%</div>
      </div>
      <div className="dashinfo">
        <div className="t">Your progress</div>
        <div className="s">
          {o.done} of {o.total} items complete
        </div>
        <div className="partstats">
          <span>
            Part I — {s1.done}/{s1.total} ({s1.pct}%)
          </span>
          <span>
            Part II — {s2.done}/{s2.total} ({s2.pct}%)
          </span>
        </div>
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
