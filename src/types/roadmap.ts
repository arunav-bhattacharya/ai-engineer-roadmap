export type ChipClass = 'read' | 'course' | 'vid' | 'tool' | 'book' | 'cohort';
export type WeekVariant = 'default' | 'claude';

export interface Resource {
  typeClass: ChipClass;
  typeLabel: string;
  label: string;
  url?: string;
  trailing?: string;
}

export interface Exercise {
  goal: string;
  steps: string[];
  acceptance: string[];
  stretch?: string;
}

export interface Day {
  n: string;
  focusTitle: string;
  focusSub?: string;
  resources: Resource[];
  est: string;
  hands?: string;
  exercise?: Exercise;
}

export interface CapstoneSpec {
  kind: 'pick' | 'alt';
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface Week {
  id: string;
  tag: string;
  title: string;
  hours: string;
  goal: string;
  variant: WeekVariant;
  star: boolean;
  days: Day[];
  udemy: string;
  udemyNone: boolean;
  deliverable: string;
  specs?: CapstoneSpec[];
}

export interface KeyTopic {
  label: string;
  star: boolean;
  raw: string;
}

export interface Course {
  name: string;
  description: string;
  url: string;
}

export interface ResourceMapRow {
  name: string;
  url?: string;
  bestFor: string;
  drives: string;
}

export interface HowToStudy {
  paragraphs: string[];
  bullets: string[];
}

export interface SetupBlock {
  items: string[];
}

export interface TimeSummaryRow {
  wk: string;
  topic: string;
  build: number;
  read: number;
  deliverable: string;
  star: boolean;
}

export interface Notes {
  paidCourses: string[];
  buyingTip: string;
  pitfalls: string[];
  sig: string;
}

export interface Roadmap {
  meta: Record<string, string>;
  kicker: string;
  titleHtml: string;
  lede: string;
  courses: Course[];
  keyTopics: KeyTopic[];
  resourceMap: ResourceMapRow[];
  howToStudy: HowToStudy;
  setup: SetupBlock;
  weeks: Week[];
  timeSummary: TimeSummaryRow[];
  notes: Notes;
}
