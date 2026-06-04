import roadmap from '../data/roadmap.json';
import { OverallProgress } from '../components/OverallProgress';
import { PlanView } from '../components/PlanView';
import { TOPIC_GROUPS } from '../lib/topics';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;

export function CompletePlan() {
  return (
    <PlanView
      topicGroups={TOPIC_GROUPS}
      weeks={r.weeks}
      header={<OverallProgress roadmap={r} />}
    />
  );
}
