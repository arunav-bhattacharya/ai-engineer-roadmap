import roadmap from '../data/roadmap.json';
import { PartLayout } from '../components/PartLayout';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;
const part = r.parts[0];

export function PartI() {
  return <PartLayout part={part} />;
}
