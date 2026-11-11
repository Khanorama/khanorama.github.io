import type { Unit } from "@/content/types";

/**
 * Unit 6: AI Agents and Agentic Systems
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
export const unit6: Unit = {
  id: "ais-u6",
  slug: "agents",
  title: "AI Agents and Agentic Systems",
  summary:
    "What separates an agent from a chatbot, how one uses tools, and why giving a language model the ability to act changes the risk entirely.",
  lessons: [
    {
      id: "ais-u6-l1",
      slug: "introduction-to-agents",
      title: "Introduction to AI Agents",
      kind: "lesson",
      summary:
        "The difference between answering and acting, and what an agent loop looks like.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish an assistant from an agent",
        "Describe the perceive, reason, act loop in an agent",
        "Identify what makes a task suitable for an agent",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-l2",
      slug: "reasoning-and-planning",
      title: "Agent Reasoning and Planning",
      kind: "lesson",
      summary:
        "Decomposing a goal into steps, and why agents fail at long horizons.",
      estimatedMinutes: 30,
      objectives: [
        "Explain how an agent decomposes a goal",
        "Describe why errors compound across steps",
        "Say what makes a plan recoverable",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-l3",
      slug: "tools-and-integrations",
      title: "Tools and External Integrations: APIs, Function Calling, and MCP",
      kind: "lesson",
      summary: "How a model that only produces text ends up sending an email.",
      estimatedMinutes: 30,
      objectives: [
        "Explain function calling and what the model actually outputs",
        "Describe what a tool definition has to specify",
        "Say what a protocol like MCP standardizes",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-l4",
      slug: "memory-and-multi-agent",
      title: "Agent Memory and Multi-Agent Systems",
      kind: "lesson",
      summary:
        "Keeping state across steps, and what happens when agents talk to each other.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish short-term context from persistent memory",
        "Describe a multi-agent arrangement and what it buys",
        "Identify failure modes specific to agents coordinating",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-l5",
      slug: "agentic-workflows",
      title: "Advanced Agentic Workflows and Automation",
      kind: "lesson",
      summary:
        "Where agents are genuinely working, and the permission question underneath all of it.",
      estimatedMinutes: 30,
      objectives: [
        "Describe a workflow where an agent outperforms a single prompt",
        "Explain why capability limits matter more than prompt wording",
        "Specify what a human-in-the-loop checkpoint should cover",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-c1",
      slug: "scope-an-agent",
      title: "Scope an Agent Safely",
      kind: "connection",
      summary:
        "Design an agent for a real task, then write down exactly what it must never be allowed to do.",
      estimatedMinutes: 35,
      objectives: [
        "Specify an agent's tools and permissions explicitly",
        "Predict how it fails and what that failure costs",
        "Decide where a human checkpoint genuinely belongs",
      ],
      blocks: [],
    },
    {
      id: "ais-u6-q1",
      slug: "unit-quiz",
      title: "Unit 6 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
