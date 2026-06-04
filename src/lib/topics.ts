/**
 * Topic groupings — the single source of truth for how weeks are organised on
 * both the Overview roadmap and the Study Plan. Each topic carries:
 *   - the weeks (by new sequential ID) it covers
 *   - a base colour that all weeks inside the topic share (with subtle per-week
 *     lightness variation handled at the consumer level if needed)
 */
export interface TopicGroup {
  id: string;
  label: string;
  sub: string;
  color: string;
  weekIds: string[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    sub: 'Python · agentic coding tooling',
    color: '#e0913a', // amber
    weekIds: ['w0', 'w1'],
  },
  {
    id: 'llm-fundamentals',
    label: 'LLM Fundamentals',
    sub: 'How LLMs work · JVM-native applied · theory deep-dive',
    color: '#4f9dd6', // blue
    weekIds: ['w2', 'w3', 'w4'],
  },
  {
    id: 'retrieval-rag',
    label: 'Retrieval & RAG',
    sub: 'From scratch · vector DBs · advanced retrieval and memory',
    color: '#56ab6c', // green
    weekIds: ['w5', 'w6'],
  },
  {
    id: 'agents-orchestration',
    label: 'Agents & Orchestration',
    sub: 'ReAct · multi-framework · MCP · durable workflows',
    color: '#9b7fe0', // violet
    weekIds: ['w7', 'w8', 'w9'],
  },
  {
    id: 'fine-tuning',
    label: 'Fine-Tuning & Data',
    sub: 'LoRA · dataset engineering · memory math',
    color: '#3bb6a6', // teal
    weekIds: ['w10', 'w11'],
  },
  {
    id: 'evals-mlops',
    label: 'Evals, Observability & MLOps',
    sub: 'Eval suites · MLflow / Langfuse · judges, Elo, CI gates',
    color: '#e07a9b', // rose
    weekIds: ['w12', 'w13', 'w14'],
  },
  {
    id: 'capstone',
    label: 'Capstone',
    sub: 'Ship one real, end-to-end agentic system',
    color: '#d9794a', // orange (milestone)
    weekIds: ['w15'],
  },
  {
    id: 'production',
    label: 'System Design & Production at Scale',
    sub: 'AI system design · inference economics · AWS deploy',
    color: '#5b8def', // indigo
    weekIds: ['w16', 'w17', 'w18'],
  },
  {
    id: 'portfolio',
    label: 'Multimodal & Portfolio',
    sub: 'Diffusion · STAR stories · job search',
    color: '#c77fd4', // orchid
    weekIds: ['w19', 'w20'],
  },
];

/**
 * Fast-Track topic groups — the 8-week condensed plan (ft0..ft7), four
 * thematic pairs. Ids are prefixed `ft-` so the `section-ft-*` collapse keys
 * never collide with the Complete Plan's section keys.
 */
export const FT_TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'ft-core',
    label: 'Core LLM Skills',
    sub: 'LLM APIs · retrieval & RAG',
    color: '#e0913a', // amber
    weekIds: ['ft0', 'ft1'],
  },
  {
    id: 'ft-agents',
    label: 'Agents & Evaluation',
    sub: 'agents / MCP · evals & observability',
    color: '#9b7fe0', // violet
    weekIds: ['ft2', 'ft3'],
  },
  {
    id: 'ft-models',
    label: 'Models & Performance',
    sub: 'fine-tuning · inference & cost',
    color: '#3bb6a6', // teal
    weekIds: ['ft4', 'ft5'],
  },
  {
    id: 'ft-ship',
    label: 'Ship & Showcase',
    sub: 'deploy / system design · capstone & portfolio',
    color: '#5b8def', // indigo
    weekIds: ['ft6', 'ft7'],
  },
];

const topicByWeekId: Record<string, TopicGroup> = {};
for (const tg of [...TOPIC_GROUPS, ...FT_TOPIC_GROUPS]) {
  for (const wid of tg.weekIds) {
    topicByWeekId[wid] = tg;
  }
}

export function topicForWeek(weekId: string): TopicGroup | undefined {
  return topicByWeekId[weekId];
}
