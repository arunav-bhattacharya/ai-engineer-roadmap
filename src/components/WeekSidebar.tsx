import { useEffect, useState } from 'react';
import { useProgress } from '../lib/ProgressContext';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForWeek } from '../lib/ids';
import type { Week } from '../types/roadmap';

interface Props {
  weeks: Week[];
}

const dotClass = {
  default: 'dot-default',
  moat: 'dot-moat',
  claude: 'dot-claude',
  elective: 'dot-elective',
} as const;

export function WeekSidebar({ weeks }: Props) {
  const { pct } = useProgress();
  const { expand } = useCollapse();
  const [active, setActive] = useState<string>(weeks[0]?.id ?? '');

  useEffect(() => {
    const sections = weeks
      .map((w) => document.getElementById(w.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [weeks]);

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    expand(id); // make sure it's open before scrolling
    setActive(id);
    // allow the body to render before scrolling
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <aside className="weeksidebar" aria-label="Weeks">
      <div className="weeksidebar-inner">
        <div className="weeksidebar-head">On this page</div>
        <ul>
          {weeks.map((w) => {
            const s = pct(leavesForWeek(w));
            return (
              <li key={w.id}>
                <a
                  href={`#${w.id}`}
                  onClick={onJump(w.id)}
                  className={active === w.id ? 'active' : ''}
                >
                  <span className={`wk-dot ${dotClass[w.variant]}`} aria-hidden="true" />
                  <span className="wk-label">
                    <span className="wk-tag">{w.tag}</span>
                    <span className="wk-title">{w.title}</span>
                  </span>
                  <span className="wk-pct">{s.pct}%</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
