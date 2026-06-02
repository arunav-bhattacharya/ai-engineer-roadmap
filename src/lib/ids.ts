import type { Day, Part, Roadmap, Week } from '../types/roadmap';

export const resourceLeafId = (weekId: string, dayIdx: number, resIdx: number): string =>
  `${weekId}-${dayIdx}-r${resIdx}`;

export const handsLeafId = (weekId: string, dayIdx: number): string =>
  `${weekId}-${dayIdx}-h`;

export const rowMasterId = (weekId: string, dayIdx: number): string =>
  `${weekId}-${dayIdx}`;

export function leavesForDay(weekId: string, dayIdx: number, day: Day): string[] {
  const ids: string[] = [];
  day.resources.forEach((_, ri) => ids.push(resourceLeafId(weekId, dayIdx, ri)));
  if (day.hands) ids.push(handsLeafId(weekId, dayIdx));
  return ids;
}

export function leavesForWeek(week: Week): string[] {
  const ids: string[] = [];
  week.days.forEach((d, di) => {
    ids.push(...leavesForDay(week.id, di, d));
  });
  return ids;
}

export function leavesForPart(part: Part): string[] {
  const ids: string[] = [];
  part.weeks.forEach((w) => ids.push(...leavesForWeek(w)));
  return ids;
}

export function leavesForRoadmap(roadmap: Roadmap): string[] {
  const ids: string[] = [];
  roadmap.parts.forEach((p) => ids.push(...leavesForPart(p)));
  return ids;
}

export function rowMastersForWeek(week: Week): string[] {
  return week.days.map((_, di) => rowMasterId(week.id, di));
}
