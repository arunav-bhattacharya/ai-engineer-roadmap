import { useState } from 'react';
import type { Roadmap } from '../types/roadmap';
import { Notes } from './Notes';
import { ResourceMap } from './ResourceMap';
import { TimeSummaryTable } from './TimeSummaryTable';

/** Collapsed reference section. Default closed. */
export function Reference({ roadmap }: { roadmap: Roadmap }) {
  const [open, setOpen] = useState(false);
  return (
    <section className={`appendix${open ? ' open' : ''}`} aria-label="Reference">
      <button
        type="button"
        className="appendix-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="chevron" aria-hidden="true" />
        <span className="sec-title">Reference</span>
        <span className="appendix-hint">
          {open ? 'Hide' : 'Resource map · time budget · buying notes'}
        </span>
      </button>

      <div className="appendix-body" hidden={!open}>
        <ResourceMap rows={roadmap.resourceMap} />
        <div className="block">
          <h3>Time allocation summary</h3>
          <TimeSummaryTable rows={roadmap.timeSummary} />
        </div>
        <div className="block">
          <Notes notes={roadmap.notes} />
        </div>
      </div>
    </section>
  );
}
