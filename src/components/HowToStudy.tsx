import type { HowToStudy as Block } from '../types/roadmap';

export function HowToStudy({ block }: { block: Block }) {
  // Source has: intro para, ratio bar, "pattern" para, bullets, then closing paras.
  // We render: first paragraph, ratio bar, remaining paragraphs (with bullets inline after the second).
  const [first, ...rest] = block.paragraphs;
  return (
    <div className="block" id="how">
      <h3>How to study — read once, refer back</h3>
      {first ? <p dangerouslySetInnerHTML={{ __html: first }} /> : null}
      <div className="ratio">
        <span className="build">70% BUILD</span>
        <span className="read">30% READ</span>
      </div>
      {rest.map((p, i) => (
        <div key={i}>
          <p dangerouslySetInnerHTML={{ __html: p }} />
          {i === 0 && block.bullets.length > 0 ? (
            <ul>
              {block.bullets.map((b, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
