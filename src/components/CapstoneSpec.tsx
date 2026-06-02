import type { CapstoneSpec as Spec } from '../types/roadmap';

export function CapstoneSpec({ spec }: { spec: Spec }) {
  return (
    <div className={`spec${spec.kind === 'pick' ? ' pick' : ''}`}>
      <h4>{spec.heading}</h4>
      {spec.body ? <p dangerouslySetInnerHTML={{ __html: spec.body }} /> : null}
      {spec.bullets && spec.bullets.length > 0 ? (
        <ul>
          {spec.bullets.map((b, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
