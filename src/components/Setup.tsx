import type { SetupBlock } from '../types/roadmap';

export function Setup({ block }: { block: SetupBlock }) {
  return (
    <div className="block" id="setup">
      <h3>Day-0 setup — do before Week 0</h3>
      <ul>
        {block.items.map((html, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </ul>
    </div>
  );
}
