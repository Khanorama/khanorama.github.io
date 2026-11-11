import type { Unit } from "@/content/types";

/**
 * Unit 3: Prompt Engineering and Context Management
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
export const unit3: Unit = {
  id: "ais-u3",
  slug: "prompting-and-context",
  title: "Prompt Engineering and Context Management",
  summary:
    "What a prompt is actually doing to a model, how context is spent, and why instructions and data sharing one channel is a security problem.",
  lessons: [
    {
      id: "ais-u3-l1",
      slug: "prompt-fundamentals",
      title: "Fundamentals of Prompt Engineering",
      kind: "lesson",
      summary:
        "Instruction, context and constraint, and why specificity beats politeness.",
      estimatedMinutes: 25,
      objectives: [
        "Describe what a prompt does mechanically",
        "Write a prompt with explicit task, context and constraints",
        "Explain why a model cannot ask for what it is missing",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-l2",
      slug: "advanced-prompting",
      title: "Advanced Prompting Techniques",
      kind: "lesson",
      summary:
        "Zero-shot, few-shot, role prompting and chain-of-thought, and when each actually helps.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish zero-shot, one-shot and few-shot prompting",
        "Explain what chain-of-thought changes and what it does not",
        "Choose a technique appropriate to a stated task",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-l3",
      slug: "structured-outputs",
      title: "Structured Outputs and Prompt Design",
      kind: "lesson",
      summary:
        "Getting a shape back you can rely on, and designing prompts that survive other people using them.",
      estimatedMinutes: 25,
      objectives: [
        "Explain why structured output matters for building on a model",
        "Describe techniques for constraining output format",
        "Identify what makes a prompt brittle",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-l4",
      slug: "context-and-memory",
      title: "Context Windows and Memory",
      kind: "lesson",
      summary:
        "What a context window is, what falls out of it, and why longer is not simply better.",
      estimatedMinutes: 25,
      objectives: [
        "Define the context window and say what it costs",
        "Explain why information in the middle is attended to less reliably",
        "Distinguish context from memory in a deployed system",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-l5",
      slug: "prompt-injection",
      title: "Prompt Injection and Security",
      kind: "lesson",
      summary:
        "The structural flaw: a model cannot tell your instructions from text it is reading.",
      estimatedMinutes: 30,
      objectives: [
        "Explain why prompt injection is structural rather than a bug",
        "Distinguish direct from indirect injection",
        "Describe mitigations based on limiting capability rather than wording",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-c1",
      slug: "rewrite-a-prompt",
      title: "Rewrite a Prompt",
      kind: "connection",
      summary:
        "Take a prompt that fails, diagnose why in this unit's terms, and rebuild it until it holds.",
      estimatedMinutes: 30,
      objectives: [
        "Diagnose why a specific prompt underperforms",
        "Apply a named technique to improve it",
        "Test a prompt against inputs designed to break it",
      ],
      blocks: [],
    },
    {
      id: "ais-u3-q1",
      slug: "unit-quiz",
      title: "Unit 3 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
