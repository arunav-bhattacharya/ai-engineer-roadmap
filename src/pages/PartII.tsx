import roadmap from '../data/roadmap.json';
import { PartLayout } from '../components/PartLayout';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;
const part = r.parts[1];

const intro = (
  <div className="block intro-block">
    <p style={{ margin: 0 }}>
      <b>Spine for Part II:</b> Chip Huyen, <i>AI Engineering: Building Applications with Foundation Models</i>{' '}
      (O'Reilly, 2025). Each week maps to chapters and goes after the depth Part I deliberately skipped: <b>why</b>{' '}
      models behave as they do, rigorous evaluation, retrieval/agent internals, the data and fine-tuning math,
      inference performance, and the full production architecture.
    </p>
  </div>
);

export function PartII() {
  return <PartLayout part={part} intro={intro} />;
}
