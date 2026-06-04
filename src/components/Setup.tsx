import type { SetupBlock } from '../types/roadmap';

export function Setup({ block }: { block: SetupBlock }) {
  return (
    <div className="block setup-card" id="setup">
      <h3>Day-0 setup</h3>
      <p className="setup-intro">Do these before Week 1.</p>
      <ul className="setup-list">
        {block.items.map((html, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </ul>
    </div>
  );
}
