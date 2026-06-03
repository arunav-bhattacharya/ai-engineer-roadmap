import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import roadmap from '../data/roadmap.json';
import { OverallProgress } from '../components/OverallProgress';
import { WeekCard } from '../components/WeekCard';
import { WeekSidebar } from '../components/WeekSidebar';
import { WeekToolbar } from '../components/WeekToolbar';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForPart } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;

const SIDEBAR_KEY = 'ai-roadmap-sidebar-v1';
const loadSidebarOpen = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== 'collapsed';
  } catch {
    return true;
  }
};

const partIntros: Record<string, React.ReactNode> = {
  part2: (
    <p style={{ margin: 0 }}>
      <b>Spine for Part II:</b> Chip Huyen, <i>AI Engineering: Building Applications with Foundation Models</i>{' '}
      (O'Reilly, 2025). Each week maps to chapters and goes after the depth Part I deliberately skipped:{' '}
      <b>why</b> models behave as they do, rigorous evaluation, retrieval / agent internals, the data and
      fine-tuning math, inference performance, full production architecture, AI system design, and the
      portfolio polish that converts builds into offers.
    </p>
  ),
};

export function StudyPlan() {
  const { expand } = useCollapse();
  const { pct } = useProgress();
  const location = useLocation();
  const allWeeks = r.parts.flatMap((p) => p.weeks);
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
        {sidebarOpen ? <WeekSidebar parts={r.parts} /> : null}
        <div className="weekcol">
          <WeekToolbar
            weekIds={weekIds}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />

          {r.parts.map((part) => {
            const s = pct(leavesForPart(part));
            return (
              <section key={part.id} className="studyplan-part" id={`section-${part.id}`}>
                <div className="partbar">
                  <span className="pn">{part.pn}</span>
                  <h2>{part.title}</h2>
                  <span className="psub">{s.pct}% done</span>
                  <span className="sub">{part.sub}</span>
                </div>

                {partIntros[part.id] ? (
                  <div className="block intro-block">{partIntros[part.id]}</div>
                ) : null}

                {part.weeks.map((w) => (
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
