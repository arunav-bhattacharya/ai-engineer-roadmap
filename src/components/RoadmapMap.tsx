import { useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/ProgressContext';
import { leavesForWeek } from '../lib/ids';
import type { Roadmap, Week } from '../types/roadmap';

const routeForPart = (partId: string): string => (partId === 'part2' ? '/part-2' : '/part-1');

export function RoadmapMap({ roadmap }: { roadmap: Roadmap }) {
  const navigate = useNavigate();
  const { pct } = useProgress();
  let gi = 0; // running week index → continuous left/right zig-zag

  return (
    <section className="rmap" aria-label="Visual roadmap">
      <div className="block-head">
        <h3>The roadmap</h3>
        <span className="block-sub mono rmap-legend">
          <span className="lg star">★ moat</span>
          <span className="lg diamond">◇ elective</span>
          <span className="lg done">✓ done</span>
        </span>
      </div>

      <div className="rmap-track">
        {roadmap.parts.map((part) => (
          <div className="rmap-part" key={part.id}>
            <div className="rmap-partbadge">
              <span className="rmap-partpn mono">{part.pn}</span>
              <span className="rmap-parttitle">{part.title}</span>
              <span className="rmap-partsub mono">{part.sub}</span>
            </div>
            {part.weeks.map((w) => {
              const side = gi++ % 2 === 0 ? 'left' : 'right';
              const s = pct(leavesForWeek(w));
              return (
                <RoadmapNode
                  key={w.id}
                  week={w}
                  side={side}
                  pctVal={s.pct}
                  onClick={() => navigate(routeForPart(part.id), { state: { jump: w.id } })}
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
  pctVal,
  onClick,
}: {
  week: Week;
  side: 'left' | 'right';
  pctVal: number;
  onClick: () => void;
}) {
  const done = pctVal === 100;
  const tagBase = week.tag.replace(/\s*[★◇].*$/, '').trim();
  const focuses = week.days.map((d) => d.focusTitle).filter(Boolean);
  const cls = [
    'rmap-week',
    `side-${side}`,
    `v-${week.variant}`,
    done ? 'is-done' : '',
    pctVal === 0 ? 'is-empty' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <span className="rmap-dot" aria-hidden="true" />
      <button
        type="button"
        className="rmap-node"
        onClick={onClick}
        aria-label={`${week.tag}: ${week.title} — ${pctVal}% complete. Open this week.`}
      >
        <span className="rmap-nodehead">
          <span className="rmap-tag mono">{tagBase}</span>
          {week.variant === 'elective' ? (
            <span className="rmap-mark diamond" title="Elective">
              ◇
            </span>
          ) : week.star ? (
            <span className="rmap-mark star" title="Your moat">
              ★
            </span>
          ) : null}
          <span className="rmap-hours mono">{week.hours}</span>
        </span>

        <span className="rmap-title">{week.title}</span>

        {focuses.length > 0 ? (
          <span className="rmap-focus">
            {focuses.map((f, i) => (
              <span className="rmap-chip" key={i}>
                {f}
              </span>
            ))}
          </span>
        ) : null}

        <span className="rmap-prog">
          <span className="rmap-prog-bar">
            <i style={{ width: `${pctVal}%` }} />
          </span>
          <span className="rmap-prog-pct mono">{done ? '✓ done' : `${pctVal}%`}</span>
        </span>
      </button>
    </div>
  );
}
