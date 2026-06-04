export interface CertificationLink {
  label: string;
  url: string;
}

export interface Certification {
  id: string;
  rank: number;
  name: string;
  provider: string;
  url: string;
  effort: string;
  cost: string;
  mapsTo: string[]; // week IDs (must match roadmap.json week.id)
  when: string; // human-readable scheduling guidance
  why: string; // why this fits the roadmap
  process: string[]; // ordered steps to complete
  links: CertificationLink[];
  tier: 'recommended' | 'optional-heavyweight';
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'hf-course',
    rank: 1,
    name: 'Hugging Face Course',
    provider: 'Hugging Face',
    url: 'https://huggingface.co/learn',
    effort: '~25 hours',
    cost: 'Free',
    mapsTo: ['w2', 'w10', 'w11', 'w19'],
    when: 'Spread across W3, W11, W12, W20 — modules align with the topic you are already studying that week.',
    why: 'Highest leverage cert in the list — covers transformers, tokenization, fine-tuning, datasets, and diffusers. If you actually do W11 and W12, you have done ~80% of the material already. Free, well-maintained, recognised everywhere.',
    process: [
      'Create a Hugging Face account; install <code>huggingface_hub</code> and log in via <code>huggingface-cli</code>.',
      'During W3 — finish the NLP / Transformers chapters (Ch 1–4).',
      'During W11 — work the fine-tuning chapters end-to-end (Ch 3, 7); run them against your own dataset.',
      'During W12 — datasets + LLM course depth (Ch 5–6 + LLM course modules on alignment / RLHF basics).',
      'During W20 — the Diffusion Models Course (separate track on the same learn hub).',
      'Each chapter has a quiz at the end — pass it to advance. No proctored exam.',
    ],
    links: [
      { label: 'Course hub', url: 'https://huggingface.co/learn' },
      { label: 'NLP / Transformers course', url: 'https://huggingface.co/learn/nlp-course' },
      { label: 'LLM course', url: 'https://huggingface.co/learn/llm-course' },
      { label: 'Diffusion course', url: 'https://huggingface.co/learn/diffusion-course' },
    ],
    tier: 'recommended',
  },
  {
    id: 'langgraph',
    rank: 2,
    name: 'LangChain Academy — LangGraph',
    provider: 'LangChain',
    url: 'https://academy.langchain.com/',
    effort: '~10 hours',
    cost: 'Free',
    mapsTo: ['w7', 'w8'],
    when: 'Finish during or right after W9 — that week already builds the same agent in LangGraph + 3 others.',
    why: 'LangGraph is the agent framework most commonly asked about in 2026 interviews. Short, focused, free, badge on completion. W9 builds in it already so net-new study is minimal.',
    process: [
      'Sign up at academy.langchain.com — free tier.',
      'Enrol in "Introduction to LangGraph".',
      'Work modules 1–6: chains, state, tools, human-in-the-loop, sub-graphs, memory.',
      'Submit the final project — usually a small agentic graph with conditional routing.',
      'Download the certificate of completion; share on LinkedIn.',
    ],
    links: [
      { label: 'LangChain Academy', url: 'https://academy.langchain.com/' },
      { label: 'LangGraph docs', url: 'https://langchain-ai.github.io/langgraph/' },
    ],
    tier: 'recommended',
  },
  {
    id: 'dlai-genai-llms',
    rank: 3,
    name: 'Generative AI with LLMs',
    provider: 'DeepLearning.AI · AWS · Coursera',
    url: 'https://www.coursera.org/learn/generative-ai-with-llms',
    effort: '~25 hours over 3 weeks',
    cost: 'Free to audit · ~$49 / mo for the cert',
    mapsTo: ['w2', 'w4'],
    when: 'Take after W5 (FM internals) when the theory is fresh — much of the course material is review at that point and you knock it out in two weekends.',
    why: 'Most brand-name LLM-specific cert on the list. Hands-on labs reinforce W3 (prompting, in-context learning) and W5 (scaling laws, RLHF, instruction tuning). Adds a recognisable name to your resume.',
    process: [
      'Enrol on Coursera — audit for free, upgrade when you want the cert.',
      'Week 1 — generative AI use cases, transformer architecture, prompting.',
      'Week 2 — fine-tuning, PEFT, evaluation.',
      'Week 3 — RLHF, model alignment, deployment considerations.',
      'Pass the 3 graded quizzes and labs; the cert is auto-issued.',
    ],
    links: [
      { label: 'Course page', url: 'https://www.coursera.org/learn/generative-ai-with-llms' },
      { label: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/' },
    ],
    tier: 'recommended',
  },
  {
    id: 'terraform-associate',
    rank: 4,
    name: 'HashiCorp Terraform Associate (003)',
    provider: 'HashiCorp',
    url: 'https://developer.hashicorp.com/certifications/infrastructure-automation',
    effort: '~2–3 weeks part-time',
    cost: '$70.50',
    mapsTo: ['w18'],
    when: 'Sit the exam the week after W19 — Day 4 of W19 has you writing Terraform; the exam prep is essentially that work plus the docs.',
    why: 'W19 already has you Terraform-ing AWS infra. The exam is multiple choice, accessible, and universally respected by hiring managers. Best dollar-per-resume-line ratio in the list.',
    process: [
      'Read the official exam objectives (IAC concepts, Terraform CLI, state, modules, providers).',
      'Work through HashiCorp Learn — "Terraform Associate Tutorials" (~10 hours).',
      'Take 2 free practice exams (Bryan Krausen on Udemy / Tutorials Dojo).',
      'Schedule the exam on PSI Online — proctored from home, 60 min, 57 questions.',
      'Pass mark is ~70% — most engineers with W19 experience pass comfortably.',
    ],
    links: [
      { label: 'Certification page', url: 'https://developer.hashicorp.com/certifications/infrastructure-automation' },
      { label: 'HashiCorp Learn — Terraform', url: 'https://developer.hashicorp.com/terraform/tutorials' },
      { label: 'Exam objectives PDF', url: 'https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-study-003' },
    ],
    tier: 'recommended',
  },
  {
    id: 'aws-ai-practitioner',
    rank: 5,
    name: 'AWS Certified AI Practitioner (AIF-C01)',
    provider: 'Amazon Web Services',
    url: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
    effort: '~2–3 weeks part-time',
    cost: '$100',
    mapsTo: ['w18'],
    when: 'Right after Terraform Associate — prep overlaps with W19 (Bedrock, SageMaker, AWS AI services). One cycle, two badges.',
    why: 'Entry-level AWS-AI cert (foundational tier — easier than ML Specialty / MLA). Your capstone ships on AWS, so this is the natural "I shipped AI on AWS" credential. Multiple choice, no labs, accessible.',
    process: [
      'Read the official exam guide — covers Bedrock, SageMaker, AI services (Comprehend, Rekognition, Transcribe), responsible AI, security.',
      'Work AWS Skill Builder — "AWS Certified AI Practitioner" learning plan (free, ~15 hours).',
      'Stephane Maarek / Tutorials Dojo practice exams (2 sets).',
      'Schedule with Pearson VUE — online or test centre, 90 min, 65 questions.',
      'Pass mark is 700/1000.',
    ],
    links: [
      { label: 'Certification page', url: 'https://aws.amazon.com/certification/certified-ai-practitioner/' },
      { label: 'AWS Skill Builder', url: 'https://skillbuilder.aws/' },
      { label: 'Exam guide PDF', url: 'https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf' },
    ],
    tier: 'recommended',
  },
  {
    id: 'aws-mla',
    rank: 6,
    name: 'AWS Certified Machine Learning Engineer — Associate (MLA-C01)',
    provider: 'Amazon Web Services',
    url: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/',
    effort: '~4–6 weeks part-time',
    cost: '$150',
    mapsTo: ['w10', 'w17', 'w18'],
    when: 'After the capstone ships and W21 is done — this is the heavyweight badge to chase in month 6–7, not during the build phase.',
    why: 'Replaces the retiring AWS ML Specialty with a more accessible exam focused on ML engineering (deployment, monitoring, security) rather than data science theory. Stack-aligned heavyweight credential that recruiters at AWS-heavy shops actually screen for. Optional but high-signal.',
    process: [
      'Read the exam guide — 4 domains: data prep, model dev, deploy + orchestrate, monitor + security.',
      'AWS Skill Builder — "AWS Certified Machine Learning Engineer – Associate" learning plan.',
      'Hands-on with SageMaker, Bedrock, Step Functions — much of W19 maps directly.',
      'Stephane Maarek / Tutorials Dojo practice exams (3 sets).',
      'Schedule with Pearson VUE — 130 min, 65 questions; pass mark 720/1000.',
    ],
    links: [
      { label: 'Certification page', url: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/' },
      { label: 'Exam guide PDF', url: 'https://d1.awsstatic.com/training-and-certification/docs-machine-learning-engineer-associate/AWS-Certified-Machine-Learning-Engineer-Associate_Exam-Guide.pdf' },
      { label: 'AWS Skill Builder', url: 'https://skillbuilder.aws/' },
    ],
    tier: 'optional-heavyweight',
  },
];
