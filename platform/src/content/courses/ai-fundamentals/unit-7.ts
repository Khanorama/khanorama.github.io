import type { Unit } from "@/content/types";

/**
 * Unit 7: AI Ethics and the Real World
 *
 * Declared but not yet written. Every lesson below carries its real title,
 * summary, objectives and estimate, so the course outline shows the whole
 * shape of what is coming and marks each entry as not written yet. That is
 * deliberate: a student deciding whether to start should be able to see
 * exactly what the course covers, and an author picking up a lesson should
 * find the brief for it already here.
 *
 * Unit 1 is the written pilot. Follow its structure: prose carrying the
 * explanation, figures where the idea has a shape, a quiz after each
 * substantial idea rather than only at the end, and a written answer where
 * the point is to put it in your own words.
 */
export const unit7: Unit = {
  id: "aif-u7",
  slug: "ethics-and-the-real-world",
  title: "AI Ethics and the Real World",
  summary:
    "Who these systems affect, who is accountable when they are wrong, and where they are already deployed at scale.",
  lessons: [
    {
      id: "aif-u7-l1",
      slug: "understanding-ai-ethics",
      title: "Understanding AI Ethics",
      kind: "lesson",
      summary:
        "What responsible AI means in practice, beyond a page on a company website.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what responsible AI commits a builder to",
        "Identify the stakeholders in a deployed system",
        "Apply an ethical question to a concrete system",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l2",
      slug: "bias-and-fairness",
      title: "Bias, Fairness, and Transparency",
      kind: "lesson",
      summary:
        "Where bias enters, why it survives training, and what explainability can and cannot deliver.",
      estimatedMinutes: 25,
      objectives: [
        "Trace bias from data through to outcome",
        "Explain why fairness has competing definitions",
        "Describe what explainable AI provides",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l3",
      slug: "privacy-and-security",
      title: "Privacy and Security",
      kind: "lesson",
      summary:
        "Consent, data ownership, surveillance, and what it means that a model remembers its training data.",
      estimatedMinutes: 25,
      objectives: [
        "Explain how training data creates privacy risk",
        "Describe meaningful consent for data use",
        "Identify surveillance applications and their trade-offs",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l4",
      slug: "safety-and-misinformation",
      title: "AI Safety and Misinformation",
      kind: "lesson",
      summary:
        "Deepfakes, synthetic media, prompt injection and adversarial inputs.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how synthetic media is produced and detected",
        "Explain prompt injection as an attack",
        "Assess a claim about AI-generated content",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l5",
      slug: "governance-and-regulation",
      title: "AI Governance and Regulation",
      kind: "lesson",
      summary:
        "Copyright, liability, the current regulatory landscape, and who is answerable.",
      estimatedMinutes: 25,
      objectives: [
        "Summarise the main regulatory approaches",
        "Explain the copyright questions around training data",
        "Say who is accountable when a system causes harm",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l6",
      slug: "ai-in-healthcare",
      title: "AI in Healthcare and Science",
      kind: "lesson",
      summary:
        "Medical imaging, diagnostics, drug discovery, and why the stakes change the engineering.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how AI is used in medical imaging",
        "Explain why clinical deployment demands more than accuracy",
        "Assess a medical AI claim critically",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l7",
      slug: "ai-in-business",
      title: "AI in Business and Finance",
      kind: "lesson",
      summary:
        "Fraud detection, forecasting, recommendation and credit scoring.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how fraud detection works",
        "Explain the risk in automated credit decisions",
        "Identify where a human must stay in the loop",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l8",
      slug: "ai-in-education",
      title: "AI in Education and Everyday Life",
      kind: "lesson",
      summary:
        "Personalised learning, tutoring systems, assistants, and what they measure.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how adaptive learning systems work",
        "Assess the evidence behind personalised learning claims",
        "Judge AI tools you use as a student",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l9",
      slug: "robotics",
      title: "Robotics and Autonomous Systems",
      kind: "lesson",
      summary:
        "Embodied AI, autonomous vehicles, and why the physical world is harder than the screen.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what makes embodied AI harder",
        "Describe the sensing and decision stack of an autonomous vehicle",
        "Assess an autonomy claim against its operating conditions",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-l10",
      slug: "emerging-technologies",
      title: "Emerging AI Technologies",
      kind: "lesson",
      summary:
        "Edge AI, AI in cybersecurity, and the industry-specific systems arriving now.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what edge AI is and why it matters",
        "Describe AI's role on both sides of cybersecurity",
        "Identify an emerging application and its risks",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-c1",
      slug: "who-does-it-affect",
      title: "Who Does It Affect?",
      kind: "connection",
      summary:
        "Return to the app from Unit 1, with everything since. Who is harmed when it is wrong, and what can they do about it?",
      estimatedMinutes: 35,
      objectives: [
        "Identify who bears the cost of a system's errors",
        "Evaluate what recourse exists for an affected person",
        "Write a specific, evidenced critique of a deployed system",
      ],
      blocks: [],
    },
    {
      id: "aif-u7-q1",
      slug: "unit-quiz",
      title: "Unit 7 Quiz",
      kind: "unitQuiz",
      summary: "Ten questions on ethics, governance and applied AI.",
      estimatedMinutes: 20,
      objectives: [
        "Confirm you can reason about bias and accountability",
        "Confirm you can assess an applied AI system",
      ],
      blocks: [],
    },
  ],
};
