import type { GlossaryEntry } from '../types/roadmap';

/** Alphabetical glossary of the specialized acronyms used across the roadmap. */
export function Glossary({ entries }: { entries: GlossaryEntry[] }) {
  if (!entries || entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) =>
    a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }),
  );
  return (
    <div className="block">
      <h3>Glossary</h3>
      <dl className="glossary">
        {sorted.map((e) => (
          <div className="glossary-row" key={e.term}>
            <dt>
              <span className="glossary-term mono">{e.term}</span>
              <span className="glossary-full">{e.full}</span>
            </dt>
            {e.def ? <dd>{e.def}</dd> : null}
          </div>
        ))}
      </dl>
    </div>
  );
}
