import roadmap from '../data/roadmap.json';
import { ElectivesList } from '../components/ElectivesList';
import type { Roadmap } from '../types/roadmap';

const r = roadmap as Roadmap;

export function Electives() {
  return (
    <>
      <div className="partbar">
        <span className="pn">Electives</span>
        <h2>Optional, by interest</h2>
        <span className="sub">Pick by interest, not obligation</span>
      </div>
      <p className="page-intro">
        Side paths that round you out — a code-free LLM primer, low-code automation, a business briefing, and a
        deep transformer-mechanisms course. None are on the critical path to the capstone; pick what serves you.
      </p>
      <ElectivesList items={r.electives} />
    </>
  );
}
