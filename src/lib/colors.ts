import { TOPIC_GROUPS, topicForWeek } from './topics';

/**
 * Topic-based colour lookup. All weeks inside a topic share their topic's
 * colour, so the Overview roadmap reads as coloured topic bands and the Study
 * Plan sidebar dots match.
 */
export const TOPIC_PALETTE = TOPIC_GROUPS.map((t) => t.color);

const FALLBACK = '#e0913a';

export function weekColor(weekId: string): string {
  return topicForWeek(weekId)?.color ?? FALLBACK;
}

export function topicColor(topicId: string): string {
  const t = TOPIC_GROUPS.find((g) => g.id === topicId);
  return t?.color ?? FALLBACK;
}
