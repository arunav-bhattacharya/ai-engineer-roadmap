import { useEffect, useMemo, useState } from 'react';
import { weekColor } from '../lib/colors';
import { useProgress } from '../lib/ProgressContext';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForWeek } from '../lib/ids';
import type { Week } from '../types/roadmap';

export interface SidebarSection {
  id: string;
  label: string;
  weeks: Week[];
}

interface Props {
  sections: SidebarSection[];
}

const EXPANDED_KEY = 'ai-roadmap-sidebar-topics-v1';
const loadExpanded = (): Set<string> => {
  try {
    const raw = localStorage.getItem(EXPANDED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
};

export function WeekSidebar({ sections }: Props) {
  const allWeeks: Week[] = useMemo(() => sections.flatMap((s) => s.weeks), [sections]);
  const { pct } = useProgress();
  const { expand } = useCollapse();
  const [active, setActive] = useState<string>(allWeeks[0]?.id ?? '');

  // Topic sections in the sidebar are collapsed by default; expansions persist.
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(loadExpanded);
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expandedTopics]));
    } catch {
      /* ignore */
    }
  }, [expandedTopics]);

  const toggleTopic = (id: string) =>
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  useEffect(() => {
    const sectionEls = allWeeks
      .map((w) => document.getElementById(w.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );
    sectionEls.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [allWeeks]);

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    expand(id);
    setActive(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <aside className="weeksidebar" aria-label="Weeks">
      <div className="weeksidebar-inner">
        <div className="weeksidebar-head">On this page</div>
        {sections.map((section, idx) => {
          const open = expandedTopics.has(section.id);
          const s = pct(section.weeks.flatMap(leavesForWeek));
          const listId = `sb-topic-${section.id}`;
          return (
            <div
              key={section.id}
              className={`weeksidebar-group${idx > 0 ? ' weeksidebar-group-sep' : ''}${
                open ? ' open' : ''
              }`}
            >
              <button
                type="button"
                className="weeksidebar-section"
                onClick={() => toggleTopic(section.id)}
                aria-expanded={open}
                aria-controls={listId}
              >
                <span className="chevron" aria-hidden="true" />
                <span className="weeksidebar-section-label">{section.label}</span>
                <span className="weeksidebar-section-pct mono">{s.pct}%</span>
              </button>
              <ul id={listId} hidden={!open}>
                {section.weeks.map((w) => {
                  const ws = pct(leavesForWeek(w));
                  return (
                    <li key={w.id}>
                      <a
                        href={`#${w.id}`}
                        onClick={onJump(w.id)}
                        className={active === w.id ? 'active' : ''}
                      >
                        <span
                          className="wk-dot"
                          style={{ background: weekColor(w.id) }}
                          aria-hidden="true"
                        />
                        <span className="wk-label">
                          <span className="wk-tag">{w.tag}</span>
                          <span className="wk-title">{w.title}</span>
                        </span>
                        <span className="wk-pct">{ws.pct}%</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
