import type { Unit } from "@/content/types";

/**
 * Unit 8: AI Infrastructure, Emerging Technologies, and the Future
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
export const unit8: Unit = {
  id: "ais-u8",
  slug: "infrastructure-and-future",
  title: "AI Infrastructure, Emerging Technologies, and the Future",
  summary:
    "What it takes to actually run these systems, the architectures arriving next, and how to think about predictions without believing them.",
  lessons: [
    {
      id: "ais-u8-l1",
      slug: "infrastructure-and-deployment",
      title: "AI Infrastructure and Deployment",
      kind: "lesson",
      summary:
        "GPUs, inference cost, latency and scale: the engineering nobody demonstrates.",
      estimatedMinutes: 25,
      objectives: [
        "Describe what serving a model at scale requires",
        "Explain why inference cost dominates training cost over a product's life",
        "Identify the trade-off between latency, cost and quality",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-l2",
      slug: "efficient-and-on-device",
      title: "Efficient and On-Device AI",
      kind: "lesson",
      summary:
        "Small models, local inference, and why the gap to frontier models is closing.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what makes a small model viable for a task",
        "Describe the privacy and latency case for on-device inference",
        "Judge when a smaller local model beats a larger remote one",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-l3",
      slug: "emerging-architectures",
      title:
        "Emerging AI Architectures: Mixture of Experts and State-Space Models",
      kind: "lesson",
      summary:
        "Two routes past the transformer's costs, and what each one changes.",
      estimatedMinutes: 30,
      objectives: [
        "Explain how mixture of experts increases capacity without proportional cost",
        "Describe what state-space models do differently with sequences",
        "Say what problem each is responding to",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-l4",
      slug: "the-future",
      title: "The Future of Artificial Intelligence",
      kind: "lesson",
      summary:
        "AGI, scaling limits, and how to read a confident prediction about any of it.",
      estimatedMinutes: 30,
      objectives: [
        "Summarize the main positions on whether scaling reaches general intelligence",
        "Identify the constraints that could stop current trends",
        "Evaluate a public prediction against its assumptions",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-l5",
      slug: "trends-and-innovations",
      title: "AI Trends and Emerging Innovations",
      kind: "lesson",
      summary:
        "Where the field is moving, separated from where it is being marketed.",
      estimatedMinutes: 25,
      objectives: [
        "Identify a current trend and the evidence behind it",
        "Distinguish a demonstrated capability from an announced one",
        "Describe what you would need to see to believe a claim",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-c1",
      slug: "make-a-prediction",
      title: "Make a Prediction You Can Check",
      kind: "connection",
      summary:
        "Write down a specific, dated, falsifiable prediction about AI, with your reasoning, so you can be wrong on the record.",
      estimatedMinutes: 35,
      objectives: [
        "Write a prediction specific enough to be checked",
        "State the reasoning and the evidence it rests on",
        "Identify what would change your mind",
      ],
      blocks: [],
    },
    {
      id: "ais-u8-q1",
      slug: "unit-quiz",
      title: "Unit 8 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 20,
      blocks: [],
    },
  ],
};
