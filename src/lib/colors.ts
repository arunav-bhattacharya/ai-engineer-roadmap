import { TOPIC_GROUPS, topicForWeek } from './topics';

/**
 * Topic-based colour lookup. All weeks inside a topic share their topic's
 * colour, so the Overview roadmap reads as coloured topic bands and the Study
 * Plan sidebar dots match.
 */
export const TOPIC_PALETTE = TOPIC_GROUPS.map((t) => t.color);

const FALLBACK = '#e0913a';

// Fast-track weeks (ft0..ft7) are not in TOPIC_GROUPS; give them their own hues.
const FT_PALETTE = [
  '#e0913a', // amber
  '#56ab6c', // green
  '#9b7fe0', // violet
  '#e07a9b', // rose
  '#3bb6a6', // teal
  '#4f9dd6', // blue
  '#5b8def', // indigo
  '#c77fd4', // orchid
];

export function weekColor(weekId: string): string {
  const fromTopic = topicForWeek(weekId)?.color;
  if (fromTopic) return fromTopic;
  const m = /^ft(\d+)$/.exec(weekId);
  if (m) return FT_PALETTE[Number(m[1]) % FT_PALETTE.length];
  return FALLBACK;
}

export function topicColor(topicId: string): string {
  const t = TOPIC_GROUPS.find((g) => g.id === topicId);
  return t?.color ?? FALLBACK;
}
