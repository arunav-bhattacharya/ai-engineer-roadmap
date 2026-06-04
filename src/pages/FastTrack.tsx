import { useMemo } from 'react';
import fasttrack from '../data/fasttrack.json';
import { WeekCard } from '../components/WeekCard';
import { useCollapse } from '../lib/CollapseContext';
import { useProgress } from '../lib/ProgressContext';
import { leavesForWeek } from '../lib/ids';
import type { Week } from '../types/roadmap';

interface FastTrackData {
  lede: string;
  weeks: Week[];
}

const ft = fasttrack as FastTrackData;

export function FastTrack() {
  const { pct } = useProgress();
  const { collapseAll, expandAll } = useCollapse();
  const weekIds = ft.weeks.map((w) => w.id);
  const leaves = useMemo(() => ft.weeks.flatMap(leavesForWeek), []);
  const s = pct(leaves);
  const totalHours = ft.weeks.reduce((acc, w) => {
    const m = /(\d+)/.exec(w.hours);
    return acc + (m ? Number(m[1]) : 0);
  }, 0);

  return (
    <>
      <section className="cert-hero ft-hero">
        <span className="kicker mono">Fast-track · 8 weeks · ~{totalHours} hrs</span>
        <h1 className="cert-title">
          Fast-Track<br />
          <em>AI Engineer in 8 weeks</em>
        </h1>
        <p className="cert-lede" dangerouslySetInnerHTML={{ __html: ft.lede }} />

        <div className="ft-progress">
          <div className="ring" style={{ '--p': s.pct } as React.CSSProperties}>
            <div>{s.pct}%</div>
          </div>
          <div className="dashinfo">
            <div className="t">Fast-track progress</div>
            <div className="s">
              {s.done} of {s.total} items complete
            </div>
          </div>
        </div>
      </section>

      <div className="weektoolbar ft-toolbar">
        <span className="weektoolbar-count mono">{ft.weeks.length} weeks · build-first</span>
        <div className="weektoolbar-btns">
          <button type="button" onClick={() => expandAll(weekIds)}>
            Expand all
          </button>
          <button type="button" onClick={() => collapseAll(weekIds)}>
            Collapse all
          </button>
        </div>
      </div>

      {ft.weeks.map((w) => (
        <WeekCard key={w.id} week={w} />
      ))}
    </>
  );
}
