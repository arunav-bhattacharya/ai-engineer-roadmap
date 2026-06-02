import type { KeyTopic } from '../types/roadmap';

export function KeyTopics({ topics }: { topics: KeyTopic[] }) {
  const stars = topics.filter((t) => t.star);
  const rest = topics.filter((t) => !t.star);

  return (
    <section className="keytopics block">
      <div className="block-head">
        <h3>Key topics you'll master</h3>
        <span className="block-sub mono">{stars.length} are your moats ★</span>
      </div>
      <div className="topic-grid">
        {stars.map((t, i) => (
          <Tile key={`s${i}`} topic={t} star />
        ))}
        {rest.map((t, i) => (
          <Tile key={`r${i}`} topic={t} />
        ))}
      </div>
    </section>
  );
}

function Tile({ topic, star }: { topic: KeyTopic; star?: boolean }) {
  // Strip trailing ★/◇ markers from the label; we render our own marker.
  const label = topic.label.replace(/[★◇]\s*$/, '').trim();
  const diamond = topic.raw.includes('◇');
  return (
    <div className={`topic-tile${star ? ' star' : ''}`}>
      <span className="topic-tile-label">{label}</span>
      {star ? (
        <span className="topic-tile-mark" aria-label="moat" title="Your moat">
          ★
        </span>
      ) : diamond ? (
        <span className="topic-tile-mark diamond" aria-label="optional" title="Optional / elective">
          ◇
        </span>
      ) : null}
    </div>
  );
}
