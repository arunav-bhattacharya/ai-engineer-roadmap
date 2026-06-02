import type { ReactNode } from 'react';
import type { Roadmap } from '../types/roadmap';

interface Props {
  roadmap: Roadmap;
  aside?: ReactNode;
}

export function Header({ roadmap, aside }: Props) {
  const m = roadmap.meta;
  const order: { label: string; key: string }[] = [
    { label: 'Duration', key: 'duration' },
    { label: 'Pace', key: 'pace' },
    { label: 'Ratio', key: 'ratio' },
    { label: 'Prereq gap', key: 'prereq_gap' },
  ];

  return (
    <header className="hero">
      <div className="hero-main">
        <h1 dangerouslySetInnerHTML={{ __html: roadmap.titleHtml }} />
        <p className="lede" dangerouslySetInnerHTML={{ __html: roadmap.lede }} />
        <div className="herostats">
          {order.map((o) =>
            m[o.key] ? (
              <div key={o.key} className="herostat">
                <span>{o.label}</span>
                <strong>{m[o.key]}</strong>
              </div>
            ) : null,
          )}
        </div>
      </div>
      {aside ? <div className="hero-aside">{aside}</div> : null}
    </header>
  );
}
