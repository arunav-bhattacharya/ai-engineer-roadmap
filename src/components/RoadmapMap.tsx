import { useNavigate } from 'react-router-dom';
import { weekColor } from '../lib/colors';
import { useProgress } from '../lib/ProgressContext';
import { TOPIC_GROUPS } from '../lib/topics';
import { leavesForWeek } from '../lib/ids';
import type { Roadmap, Week } from '../types/roadmap';

export function RoadmapMap({ roadmap }: { roadmap: Roadmap }) {
  const navigate = useNavigate();
  const { pct } = useProgress();
  const weekById = new Map<string, Week>(
    roadmap.parts.flatMap((p) => p.weeks).map((w) => [w.id, w]),
  );
  let gi = 0; // running week index → alternating side

  return (
    <section className="rmap" aria-label="Visual roadmap">
      <div className="section-head">
        <h2 className="sec-title">The roadmap</h2>
      </div>

      <div className="rmap-track">
        {TOPIC_GROUPS.map((tg, ti) => {
          const weeks = tg.weekIds
            .map((id) => weekById.get(id))
            .filter((w): w is Week => Boolean(w));
          const kicker = `TOPIC ${String(ti + 1).padStart(2, '0')}`;
          return (
            <div className="rmap-part" key={tg.id}>
              <div className="rmap-partbadge">
                <span className="rmap-partpn mono">{kicker}</span>
                <span className="rmap-parttitle">{tg.label}</span>
                <span className="rmap-partsub mono">{tg.sub}</span>
              </div>
              {weeks.map((week) => {
                const side = gi++ % 2 === 0 ? 'left' : 'right';
                return (
                  <RoadmapNode
                    key={week.id}
                    week={week}
                    side={side}
                    color={weekColor(week.id)}
                    pctVal={pct(leavesForWeek(week)).pct}
                    onClick={() => navigate('/study-plan', { state: { jump: week.id } })}
                  />
                );
              })}
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
