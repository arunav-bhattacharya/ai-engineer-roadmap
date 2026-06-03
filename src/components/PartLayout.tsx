import { useEffect, useRef, useState } from 'react';
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

const SIDEBAR_KEY = 'ai-roadmap-sidebar-v1';
const loadSidebarOpen = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== 'collapsed';
  } catch {
    return true;
  }
};

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

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(loadSidebarOpen);
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? 'open' : 'collapsed');
    } catch {
      /* ignore */
    }
  }, [sidebarOpen]);

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

      <div className={`partlayout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        {sidebarOpen ? <WeekSidebar weeks={part.weeks} /> : null}
        <div className="weekcol">
          <WeekToolbar
            weekIds={weekIds}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />
          {intro}
          {part.weeks.map((w) => (
            <WeekCard key={w.id} week={w} />
          ))}
        </div>
      </div>
    </>
  );
}
