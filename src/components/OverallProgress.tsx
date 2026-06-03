import { useRef } from 'react';
import { useProgress } from '../lib/ProgressContext';
import { leavesForRoadmap } from '../lib/ids';
import type { Roadmap } from '../types/roadmap';

export function OverallProgress({
  roadmap,
  variant = 'dash',
}: {
  roadmap: Roadmap;
  variant?: 'dash' | 'hero';
}) {
  const { pct, exportNow, importNow, reset } = useProgress();
  const o = pct(leavesForRoadmap(roadmap));
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
