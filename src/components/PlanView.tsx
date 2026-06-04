import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { WeekCard } from './WeekCard';
import { WeekSidebar, type SidebarSection } from './WeekSidebar';
import { WeekToolbar } from './WeekToolbar';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForWeek } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import type { TopicGroup } from '../lib/topics';
import type { Week } from '../types/roadmap';

const SIDEBAR_KEY = 'ai-roadmap-sidebar-v1';
const loadSidebarOpen = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== 'collapsed';
  } catch {
    return true;
  }
};

const sectionKey = (topicId: string) => `section-${topicId}`;

interface Props {
  topicGroups: TopicGroup[];
  weeks: Week[];
  header?: ReactNode;
}

/**
 * Shared plan layout used by both the Complete Plan and Fast-Track pages:
 * a collapsible-topic sidebar + a week column whose topic banners and week
 * cards are individually collapsible. Deep-links (location.state.jump) expand
 * the target week's enclosing topic before scrolling.
 */
export function PlanView({ topicGroups, weeks, header }: Props) {
  const { expand, isCollapsed, toggle } = useCollapse();
  const { pct } = useProgress();
  const location = useLocation();

  const weekById = useMemo(() => new Map<string, Week>(weeks.map((w) => [w.id, w])), [weeks]);
  const sections: SidebarSection[] = useMemo(
    () =>
      topicGroups.map((tg) => ({
        id: tg.id,
        label: tg.label,
        weeks: tg.weekIds.map((id) => weekById.get(id)).filter((w): w is Week => Boolean(w)),
      })),
    [topicGroups, weekById],
  );
  const weekIds = sections.flatMap((s) => s.weeks.map((w) => w.id));
  const sectionIds = topicGroups.map((tg) => sectionKey(tg.id));

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(loadSidebarOpen);
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? 'open' : 'collapsed');
    } catch {
      /* ignore */
    }
  }, [sidebarOpen]);

  // Deep-link: expand the week's enclosing topic + the week, then scroll.
  const jump = (location.state as { jump?: string } | null)?.jump;
  const handledKey = useRef<string>('');
  useEffect(() => {
    if (!jump || !weekIds.includes(jump)) return;
    if (handledKey.current === location.key) return;
    handledKey.current = location.key;
    const topic = topicGroups.find((tg) => tg.weekIds.includes(jump));
    if (topic) expand(sectionKey(topic.id));
    expand(jump);
    const t = setTimeout(() => {
      document.getElementById(jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, location.key]);

  return (
    <>
      {header}

      <div className={`partlayout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        {sidebarOpen ? <WeekSidebar sections={sections} /> : null}
        <div className="weekcol">
          <WeekToolbar
            weekIds={weekIds}
            extraIds={sectionIds}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />

          {topicGroups.map((tg, ti) => {
            const tgWeeks = tg.weekIds
              .map((id) => weekById.get(id))
              .filter((w): w is Week => Boolean(w));
            if (tgWeeks.length === 0) return null;
            const s = pct(tgWeeks.flatMap(leavesForWeek));
            const kicker = `TOPIC ${String(ti + 1).padStart(2, '0')}`;
            const key = sectionKey(tg.id);
            const collapsed = isCollapsed(key);
            const bodyId = `topicbody-${tg.id}`;
            return (
              <section
                key={tg.id}
                className={`studyplan-topic${collapsed ? ' collapsed' : ''}`}
                id={`section-${tg.id}`}
                style={{ '--wk-color': tg.color } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="topicbar"
                  onClick={() => toggle(key)}
                  aria-expanded={!collapsed}
                  aria-controls={bodyId}
                >
                  <span className="chevron" aria-hidden="true" />
                  <span className="tn mono">{kicker}</span>
                  <h2>{tg.label}</h2>
                  <span className="tpct mono">{s.pct}% done</span>
                  <span className="tsub">{tg.sub}</span>
                </button>
                <div className="studyplan-topic-body" id={bodyId} hidden={collapsed}>
                  {tgWeeks.map((w) => (
                    <WeekCard key={w.id} week={w} />
                  ))}
                </div>
                {collapsed ? null : (
                  <div className="topic-totop">
                    <button
                      type="button"
                      className="totop-link"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      ↑ Back to top
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
