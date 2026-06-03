/**
 * Topic groupings for the Overview roadmap.
 *
 * These collapse the underlying Part I / Part II split into thematic groups that
 * span weeks — e.g. LLM Fundamentals covers W2 (intro), W2B (JVM applied), and
 * W11 (theory deep-dive). The data model in roadmap.json keeps the parts
 * structure (used by Study Plan sidebar + OverallProgress); this file is the
 * single source of truth for how the Overview presents the journey.
 */
export interface TopicGroup {
  id: string;
  label: string;
  sub: string;
  weekIds: string[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    sub: 'Python · agentic coding tooling',
    weekIds: ['w0', 'w1'],
  },
  {
    id: 'llm-fundamentals',
    label: 'LLM Fundamentals',
    sub: 'How LLMs work · JVM-native applied · theory deep-dive',
    weekIds: ['w2', 'w2b', 'w11'],
  },
  {
    id: 'retrieval-rag',
    label: 'Retrieval & RAG',
    sub: 'From scratch · vector DBs · advanced retrieval and memory',
    weekIds: ['w3', 'w13'],
  },
  {
    id: 'agents-orchestration',
    label: 'Agents & Orchestration',
    sub: 'ReAct · multi-framework · MCP · durable workflows',
    weekIds: ['w4', 'w5', 'w8'],
  },
  {
    id: 'fine-tuning',
    label: 'Fine-Tuning & Data',
    sub: 'LoRA · dataset engineering · memory math',
    weekIds: ['w6', 'w14'],
  },
  {
    id: 'evals-mlops',
    label: 'Evals, Observability & MLOps',
    sub: 'Eval suites · MLflow / Langfuse · judges, Elo, CI gates',
    weekIds: ['w7', 'w7b', 'w12'],
  },
  {
    id: 'capstone',
    label: 'Capstone',
    sub: 'Ship one real, end-to-end agentic system',
    weekIds: ['w9'],
  },
  {
    id: 'production',
    label: 'System Design & Production at Scale',
    sub: 'AI system design · inference economics · AWS deploy',
    weekIds: ['w12b', 'w15', 'w16'],
  },
  {
    id: 'portfolio',
    label: 'Multimodal & Portfolio',
    sub: 'Diffusion · STAR stories · job search',
    weekIds: ['w17', 'w18'],
  },
];
