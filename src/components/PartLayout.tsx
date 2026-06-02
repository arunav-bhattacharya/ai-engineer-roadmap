import roadmap from '../data/roadmap.json';
import { leavesForPart } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import type { Part, Roadmap } from '../types/roadmap';
import { OverallProgress } from './OverallProgress';
import { WeekCard } from './WeekCard';
import { WeekSidebar } from './WeekSidebar';
import { WeekToolbar } from './WeekToolbar';

const r = roadmap as Roadmap;

interface Props {
  part: Part;
  intro?: React.ReactNode;
}

export function PartLayout({ part, intro }: Props) {
  const { pct } = useProgress();
  const s = pct(leavesForPart(part));
  const weekIds = part.weeks.map((w) => w.id);

  return (
    <>
      <OverallProgress roadmap={r} />
      <div className="partbar">
        <span className="pn">{part.pn}</span>
        <h2>{part.title}</h2>
        <span className="psub">{s.pct}% done</span>
        <span className="sub">{part.sub}</span>
      </div>

      <div className="partlayout">
        <WeekSidebar weeks={part.weeks} />
        <div className="weekcol">
          <WeekToolbar weekIds={weekIds} />
          {intro}
          {part.weeks.map((w) => (
            <WeekCard key={w.id} week={w} />
          ))}
        </div>
      </div>
    </>
  );
}
