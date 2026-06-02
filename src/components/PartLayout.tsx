import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import roadmap from '../data/roadmap.json';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForPart } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import type { Part, Roadmap } from '../types/roadmap';
import { OverallProgress } from './OverallProgress';
import { WeekCard } from './WeekCard';
import { WeekSidebar } from './WeekSidebar';
import { WeekToolbar } from './WeekToolbar';

const r = roadmap as Roadmap;

interface Props {
  part: Part;
  intro?: React.ReactNode;
}

export function PartLayout({ part, intro }: Props) {
  const { pct } = useProgress();
  const { expand } = useCollapse();
  const location = useLocation();
  const s = pct(leavesForPart(part));
  const weekIds = part.weeks.map((w) => w.id);

  // Deep-link from the Overview roadmap: navigate(state:{jump}) → expand + scroll.
  // Guard on location.key so each navigation is handled exactly once (and we
  // never clear router state, which would re-run this effect and cancel the scroll).
  const jump = (location.state as { jump?: string } | null)?.jump;
  const handledKey = useRef<string>('');
  useEffect(() => {
    if (!jump || !weekIds.includes(jump)) return;
    if (handledKey.current === location.key) return;
    handledKey.current = location.key;
    expand(jump);
    // Let the expanded week body render before scrolling; scroll-margin-top
    // on .week clears the sticky header.
    const t = setTimeout(() => {
      document.getElementById(jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, location.key]);

  return (
    <>
      <OverallProgress roadmap={r} />
      <div className="partbar">
        <span className="pn">{part.pn}</span>
        <h2>{part.title}</h2>
        <span className="psub">{s.pct}% done</span>
        <span className="sub">{part.sub}</span>
      </div>

      <div className="partlayout">
        <WeekSidebar weeks={part.weeks} />
        <div className="weekcol">
          <WeekToolbar weekIds={weekIds} />
          {intro}
          {part.weeks.map((w) => (
            <WeekCard key={w.id} week={w} />
          ))}
        </div>
      </div>
    </>
  );
}
