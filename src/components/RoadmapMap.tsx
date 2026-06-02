import { useNavigate } from 'react-router-dom';
import { weekColor } from '../lib/colors';
import { useProgress } from '../lib/ProgressContext';
import { leavesForWeek } from '../lib/ids';
import type { Roadmap, Week } from '../types/roadmap';

const routeForPart = (partId: string): string => (partId === 'part2' ? '/part-2' : '/part-1');

export function RoadmapMap({ roadmap }: { roadmap: Roadmap }) {
  const navigate = useNavigate();
  const { pct } = useProgress();
  let gi = 0; // running week index → alternating side

  return (
    <section className="rmap" aria-label="Visual roadmap">
      <div className="section-head">
        <h2 className="sec-title">The roadmap</h2>
      </div>

      <div className="rmap-track">
        {roadmap.parts.map((part) => (
          <div className="rmap-part" key={part.id}>
            <div className="rmap-partbadge">
              <span className="rmap-partpn mono">{part.pn}</span>
              <span className="rmap-parttitle">{part.title}</span>
              <span className="rmap-partsub mono">{part.sub}</span>
            </div>
            {part.weeks.map((week) => {
              const side = gi++ % 2 === 0 ? 'left' : 'right';
              return (
                <RoadmapNode
                  key={week.id}
                  week={week}
                  side={side}
                  color={weekColor(week.id)}
                  pctVal={pct(leavesForWeek(week)).pct}
                  onClick={() => navigate(routeForPart(part.id), { state: { jump: week.id } })}
                />
              );
            })}
          </div>
        ))}
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
