import roadmap from '../data/roadmap.json';
import { Collapsible } from '../components/Collapsible';
import { CourseBand } from '../components/CourseBand';
import { ElectivesList } from '../components/ElectivesList';
import { Header } from '../components/Header';
import { HowToStudy } from '../components/HowToStudy';
import { KeyTopics } from '../components/KeyTopics';
import { Notes } from '../components/Notes';
import { OverallProgress } from '../components/OverallProgress';
import { ResourceMap } from '../components/ResourceMap';
import { Setup } from '../components/Setup';
import { TimeSummaryTable } from '../components/TimeSummaryTable';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;

export function Overview() {
  return (
    <>
      <Header roadmap={r} aside={<OverallProgress roadmap={r} variant="hero" />} />
      <CourseBand courses={r.courses} />
      <KeyTopics topics={r.keyTopics} />

      <div className="two-col">
        <HowToStudy block={r.howToStudy} />
        <Setup block={r.setup} />
      </div>

      <ResourceMap rows={r.resourceMap} />

      <ElectivesList items={r.electives} />

      <Collapsible title="Time allocation summary" defaultOpen>
        <TimeSummaryTable rows={r.timeSummary} />
      </Collapsible>

      <Collapsible title="Courses worth the money & pitfalls" defaultOpen={false}>
        <Notes notes={r.notes} />
      </Collapsible>
    </>
  );
}
