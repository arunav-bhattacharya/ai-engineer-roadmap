import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import roadmap from '../data/roadmap.json';
import { OverallProgress } from '../components/OverallProgress';
import { WeekCard } from '../components/WeekCard';
import { WeekSidebar, type SidebarSection } from '../components/WeekSidebar';
import { WeekToolbar } from '../components/WeekToolbar';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForWeek } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import { TOPIC_GROUPS } from '../lib/topics';
import type { Roadmap, Week } from '../types/roadmap';

const r = roadmap as Roadmap;

const SIDEBAR_KEY = 'ai-roadmap-sidebar-v1';
const loadSidebarOpen = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== 'collapsed';
  } catch {
    return true;
  }
};

export function StudyPlan() {
  const { expand } = useCollapse();
  const { pct } = useProgress();
  const location = useLocation();

  const weekById = useMemo(() => new Map<string, Week>(r.weeks.map((w) => [w.id, w])), []);
  const sections: SidebarSection[] = useMemo(
    () =>
      TOPIC_GROUPS.map((tg) => ({
        id: tg.id,
        label: tg.label,
        weeks: tg.weekIds.map((id) => weekById.get(id)).filter((w): w is Week => Boolean(w)),
      })),
    [weekById],
  );
  const allWeeks = sections.flatMap((s) => s.weeks);
  const weekIds = allWeeks.map((w) => w.id);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(loadSidebarOpen);
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? 'open' : 'collapsed');
    } catch {
      /* ignore */
    }
  }, [sidebarOpen]);

  // Deep-link from Overview RoadmapMap or Certifications page: navigate(state:{jump}).
  const jump = (location.state as { jump?: string } | null)?.jump;
  const handledKey = useRef<string>('');
  useEffect(() => {
    if (!jump || !weekIds.includes(jump)) return;
    if (handledKey.current === location.key) return;
    handledKey.current = location.key;
    expand(jump);
    const t = setTimeout(() => {
      document.getElementById(jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, location.key]);

  return (
    <>
      <OverallProgress roadmap={r} />

      <div className={`partlayout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        {sidebarOpen ? <WeekSidebar sections={sections} /> : null}
        <div className="weekcol">
          <WeekToolbar
            weekIds={weekIds}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />

          {TOPIC_GROUPS.map((tg, ti) => {
            const weeks = tg.weekIds
              .map((id) => weekById.get(id))
              .filter((w): w is Week => Boolean(w));
            if (weeks.length === 0) return null;
            const allLeaves = weeks.flatMap(leavesForWeek);
            const s = pct(allLeaves);
            const kicker = `TOPIC ${String(ti + 1).padStart(2, '0')}`;
            return (
              <section
                key={tg.id}
                className="studyplan-topic"
                id={`section-${tg.id}`}
                style={{ '--wk-color': tg.color } as React.CSSProperties}
              >
                <div className="topicbar">
                  <span className="tn mono">{kicker}</span>
                  <h2>{tg.label}</h2>
                  <span className="tpct mono">{s.pct}% done</span>
                  <span className="tsub">{tg.sub}</span>
                </div>
                {weeks.map((w) => (
                  <WeekCard key={w.id} week={w} />
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
