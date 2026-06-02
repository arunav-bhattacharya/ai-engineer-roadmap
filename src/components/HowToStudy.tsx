import type { HowToStudy as Block } from '../types/roadmap';

export function HowToStudy({ block }: { block: Block }) {
  // Condensed view: one-line intro + ratio bar + the 5-step pattern + a single
  // "watch-outs" line. The verbose "Part I vs Part II" paragraph is dropped
  // (the roadmap already conveys that). All copy is selected from the source data.
  const paras = block.paragraphs;
  const intro = paras[0];
  const patternLead = paras.find((p) => /pattern that works/i.test(p)) ?? paras[1];
  const avoid = paras.find((p) => /don.?t fall for/i.test(p));

  return (
    <div className="block study-card" id="how">
      <h3>How to study</h3>
      {intro ? <p className="study-intro" dangerouslySetInnerHTML={{ __html: intro }} /> : null}

      <div className="ratio" aria-label="70% build, 30% read">
        <span className="build">70% BUILD</span>
        <span className="read">30% READ</span>
      </div>

      {patternLead ? (
        <p className="study-lead" dangerouslySetInnerHTML={{ __html: patternLead }} />
      ) : null}
      <ol className="study-steps">
        {block.bullets.map((b, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
        ))}
      </ol>

      {avoid ? <p className="study-avoid" dangerouslySetInnerHTML={{ __html: avoid }} /> : null}
    </div>
  );
}
