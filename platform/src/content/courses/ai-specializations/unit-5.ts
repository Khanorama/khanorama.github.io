import type { Unit } from "@/content/types";

/**
 * Unit 5: Fine-Tuning and AI Model Customization
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
export const unit5: Unit = {
  id: "ais-u5",
  slug: "fine-tuning",
  title: "Fine-Tuning and AI Model Customization",
  summary:
    "When to adapt a model rather than prompt it, what fine-tuning can and cannot teach, and why most projects that reach for it should not.",
  lessons: [
    {
      id: "ais-u5-l1",
      slug: "model-customization",
      title: "Understanding Model Customization",
      kind: "lesson",
      summary:
        "Four ways to change what a model does, in increasing order of cost and regret.",
      estimatedMinutes: 25,
      objectives: [
        "Compare prompting, retrieval, fine-tuning and training from scratch",
        "Choose an approach for a stated requirement",
        "Explain why fine-tuning is usually the wrong first move",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-l2",
      slug: "fine-tuning-techniques",
      title: "Fine-Tuning Techniques",
      kind: "lesson",
      summary:
        "Supervised fine-tuning, instruction tuning and preference tuning, and what data each needs.",
      estimatedMinutes: 30,
      objectives: [
        "Describe what happens to the weights during fine-tuning",
        "Say what kind of data each technique requires",
        "Explain catastrophic forgetting and why it matters",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-l3",
      slug: "peft",
      title: "Parameter-Efficient Fine-Tuning: LoRA and QLoRA",
      kind: "lesson",
      summary: "Adapting a huge model by training a tiny fraction of it.",
      estimatedMinutes: 30,
      objectives: [
        "Explain what LoRA trains instead of the full model",
        "Say why parameter-efficient methods made customization accessible",
        "Describe what quantization adds in QLoRA",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-l4",
      slug: "optimization-and-compression",
      title: "Model Optimization and Compression",
      kind: "lesson",
      summary:
        "Quantization, distillation and pruning: making a model smaller without making it useless.",
      estimatedMinutes: 25,
      objectives: [
        "Explain quantization and what it trades away",
        "Describe distillation from a large model to a small one",
        "Judge when a smaller model is the better engineering choice",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-l5",
      slug: "open-vs-closed",
      title: "Open-Source vs. Closed-Source Models",
      kind: "lesson",
      summary:
        "What open weights actually give you, what they do not, and how to choose.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish open weights from open source and open data",
        "Compare the control, cost and risk of each route",
        "Choose a model class for a stated constraint",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-c1",
      slug: "prompt-retrieve-or-tune",
      title: "Prompt, Retrieve, or Fine-Tune?",
      kind: "connection",
      summary:
        "Four real requirements. Decide which approach each needs, and say what it would cost to be wrong.",
      estimatedMinutes: 30,
      objectives: [
        "Match a requirement to the cheapest approach that meets it",
        "Identify what data each route would demand",
        "Recognize a requirement that no customization solves",
      ],
      blocks: [],
    },
    {
      id: "ais-u5-q1",
      slug: "unit-quiz",
      title: "Unit 5 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
