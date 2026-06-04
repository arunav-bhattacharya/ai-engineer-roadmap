import { useEffect, useState } from 'react';
import roadmap from '../data/roadmap.json';
import fasttrack from '../data/fasttrack.json';
import { Header } from '../components/Header';
import { HowToStudy } from '../components/HowToStudy';
import { OverallProgress } from '../components/OverallProgress';
import { RoadmapMap } from '../components/RoadmapMap';
import { Setup } from '../components/Setup';
import { FT_TOPIC_GROUPS, TOPIC_GROUPS } from '../lib/topics';
import type { Roadmap, Week } from '../types/roadmap';

const r = roadmap as Roadmap;
const ft = fasttrack as { lede: string; weeks: Week[] };

type PlanMode = 'fast' | 'complete';
const PLAN_KEY = 'ai-roadmap-overview-plan-v1';
const loadPlan = (): PlanMode => {
  try {
    return localStorage.getItem(PLAN_KEY) === 'complete' ? 'complete' : 'fast';
  } catch {
    return 'fast';
  }
};

export function Overview() {
  const [plan, setPlan] = useState<PlanMode>(loadPlan);
  useEffect(() => {
    try {
      localStorage.setItem(PLAN_KEY, plan);
    } catch {
      /* ignore */
    }
  }, [plan]);

  const toggle = (
    <div className="plan-toggle" role="tablist" aria-label="Roadmap plan">
      <button
        type="button"
        role="tab"
        aria-selected={plan === 'fast'}
        className={plan === 'fast' ? 'active' : ''}
        onClick={() => setPlan('fast')}
      >
        Fast-Track · 8 wks
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={plan === 'complete'}
        className={plan === 'complete' ? 'active' : ''}
        onClick={() => setPlan('complete')}
      >
        Complete Plan · 20 wks
      </button>
    </div>
  );

  return (
    <>
      <Header roadmap={r} aside={<OverallProgress roadmap={r} variant="hero" />} />

      {plan === 'fast' ? (
        <RoadmapMap groups={FT_TOPIC_GROUPS} weeks={ft.weeks} route="/fast-track" control={toggle} />
      ) : (
        <RoadmapMap groups={TOPIC_GROUPS} weeks={r.weeks} route="/complete-plan" control={toggle} />
      )}

      <div className="two-col">
        <HowToStudy block={r.howToStudy} />
        <Setup block={r.setup} />
      </div>
    </>
  );
}
