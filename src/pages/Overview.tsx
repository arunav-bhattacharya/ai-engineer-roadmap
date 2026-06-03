import roadmap from '../data/roadmap.json';
import { Header } from '../components/Header';
import { HowToStudy } from '../components/HowToStudy';
import { OverallProgress } from '../components/OverallProgress';
import { RoadmapMap } from '../components/RoadmapMap';
import { Setup } from '../components/Setup';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;

export function Overview() {
  return (
    <>
      <Header roadmap={r} aside={<OverallProgress roadmap={r} variant="hero" />} />

      <RoadmapMap roadmap={r} />

      <div className="two-col">
        <HowToStudy block={r.howToStudy} />
        <Setup block={r.setup} />
      </div>
    </>
  );
}
