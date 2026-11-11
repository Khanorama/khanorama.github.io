import type { Unit } from "@/content/types";

/**
 * Unit 7: AI Evaluation, Reliability, and Safety
 *
 * Declared but not yet written. Every lesson carries its real title,
 * summary, objectives and estimate, so the outline shows the whole shape
 * of the course and an author picking up a lesson finds the brief already
 * here.
 *
 * Unit 1 is the written pilot. Follow its structure, and the conventions
 * settled on in AI Fundamentals: prose carrying the explanation, figures
 * where the idea has a shape, a quiz after each substantial idea rather
 * than only at the end, and no summary or objectives on a unit quiz, since
 * listing what a quiz checks tells the student what to recall before they
 * have answered anything.
 */
export const unit7: Unit = {
  id: "ais-u7",
  slug: "evaluation-and-safety",
  title: "AI Evaluation, Reliability, and Safety",
  summary:
    "Why models make things up, how you measure a system whose output is prose, and what alignment and guardrails actually do.",
  lessons: [
    {
      id: "ais-u7-l1",
      slug: "hallucinations",
      title: "Understanding AI Hallucinations",
      kind: "lesson",
      summary:
        "Why a next-token predictor produces confident fiction, and why it is not a bug to be patched.",
      estimatedMinutes: 30,
      objectives: [
        "Explain hallucination as a consequence of the training objective",
        "Say why confidence carries no information about correctness",
        "Identify conditions that make hallucination more likely",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-l2",
      slug: "evaluating-models",
      title: "Evaluating AI Models and Performance",
      kind: "lesson",
      summary:
        "Benchmarks, their contamination problem, and what a leaderboard does not tell you.",
      estimatedMinutes: 30,
      objectives: [
        "Describe how language models are benchmarked",
        "Explain benchmark contamination and why it inflates scores",
        "Say what an LLM-as-judge evaluation can and cannot establish",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-l3",
      slug: "evaluating-rag-and-agents",
      title: "Evaluating RAG Systems and AI Agents",
      kind: "lesson",
      summary:
        "Measuring systems with many stages, where the failure is rarely where it appears.",
      estimatedMinutes: 30,
      objectives: [
        "Evaluate retrieval separately from generation",
        "Describe groundedness and how it is measured",
        "Explain why agent evaluation has to consider trajectories, not just outcomes",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-l4",
      slug: "reliability-and-failure",
      title: "AI Reliability, Robustness, and Failure Analysis",
      kind: "lesson",
      summary:
        "How these systems fail in production, and why the failures are not the ones testing found.",
      estimatedMinutes: 25,
      objectives: [
        "Describe distribution shift in a deployed language system",
        "Explain why small input changes can produce large output changes",
        "Design a failure analysis for a specific deployment",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-l5",
      slug: "alignment-and-guardrails",
      title: "Advanced AI Safety, Alignment, and Guardrails",
      kind: "lesson",
      summary:
        "What alignment means technically, what guardrails are, and the limits of both.",
      estimatedMinutes: 30,
      objectives: [
        "Explain alignment as a training objective problem",
        "Describe what a guardrail does and where it sits",
        "Say why guardrails are mitigation rather than solution",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-c1",
      slug: "catch-a-hallucination",
      title: "Catch a Hallucination",
      kind: "connection",
      summary:
        "Get a model to state something false with full confidence, then work out exactly why it did.",
      estimatedMinutes: 30,
      objectives: [
        "Construct conditions that reliably produce hallucination",
        "Explain a specific fabrication in architectural terms",
        "Specify a verification process for a real use case",
      ],
      blocks: [],
    },
    {
      id: "ais-u7-q1",
      slug: "unit-quiz",
      title: "Unit 7 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
