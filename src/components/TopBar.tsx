import roadmap from '../data/roadmap.json';
import { leavesForRoadmap } from '../lib/ids';
import { useProgress } from '../lib/ProgressContext';
import type { Roadmap } from '../types/roadmap';

const allLeaves = leavesForRoadmap(roadmap as Roadmap);

export function TopBar() {
  const { pct } = useProgress();
  const summary = pct(allLeaves);
  return (
    <div id="topbar">
      <i style={{ width: `${summary.pct}%` }} />
    </div>
  );
}
