import { useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/ProgressContext';
import { leavesForWeek } from '../lib/ids';
import type { TopicGroup } from '../lib/topics';
import type { Week } from '../types/roadmap';

interface Props {
  groups: TopicGroup[];
  weeks: Week[];
  /** Route to deep-link into when a node is clicked. */
  route: string;
  /** Optional control rendered in the section header (e.g. the plan toggle). */
  control?: React.ReactNode;
}

export function RoadmapMap({ groups, weeks, route, control }: Props) {
  const navigate = useNavigate();
  const { pct } = useProgress();
  const weekById = new Map<string, Week>(weeks.map((w) => [w.id, w]));

  return (
    <section className="rmap" aria-label="Visual roadmap">
      <div className="section-head">
        <h2 className="sec-title">The roadmap</h2>
        {control}
      </div>

      <div className="rmap-track">
        {groups.map((tg, ti) => {
          const weeks = tg.weekIds
            .map((id) => weekById.get(id))
            .filter((w): w is Week => Boolean(w));
          // Whole topic stays on one side; alternate sides by topic index.
          const side: 'left' | 'right' = ti % 2 === 0 ? 'left' : 'right';
          const kicker = `TOPIC ${String(ti + 1).padStart(2, '0')}`;
          return (
            <div className="rmap-part" key={tg.id} style={{ '--wk-color': tg.color } as React.CSSProperties}>
              <div className="rmap-partbadge">
                <span className="rmap-partpn mono">{kicker}</span>
                <span className="rmap-parttitle">{tg.label}</span>
                <span className="rmap-partsub mono">{tg.sub}</span>
              </div>
              {weeks.map((week) => (
                <RoadmapNode
                  key={week.id}
                  week={week}
                  side={side}
                  color={tg.color}
                  pctVal={pct(leavesForWeek(week)).pct}
                  onClick={() => navigate(route, { state: { jump: week.id } })}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RoadmapNode({
  week,
  side,
  color,
  pctVal,
  onClick,
}: {
  week: Week;
  side: 'left' | 'right';
  color: string;
  pctVal: number;
  onClick: () => void;
}) {
  const done = pctVal === 100;
  const tagBase = week.tag.replace(/\s*[★◇].*$/, '').trim();
  const cls = ['rmap-week', `side-${side}`, done ? 'is-done' : '', pctVal === 0 ? 'is-empty' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={{ '--wk-color': color } as React.CSSProperties}>
      <span className="rmap-dot" aria-hidden="true" />
      <button
        type="button"
        className="rmap-node"
        onClick={onClick}
        aria-label={`${week.tag}: ${week.title} — ${pctVal}% complete. Open this week.`}
      >
        <span className="rmap-nodehead">
          <span className="rmap-tag mono">{tagBase}</span>
          <span className="rmap-hours mono">{week.hours}</span>
        </span>

        <span className="rmap-title">{week.title}</span>

        <span className="rmap-prog">
          <span className="rmap-prog-bar">
            <i style={{ width: `${pctVal}%` }} />
          </span>
          <span className="rmap-prog-pct mono">{pctVal}%</span>
        </span>
      </button>
    </div>
  );
}
