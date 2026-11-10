import type { Unit } from "@/content/types";

/**
 * Unit 6: Natural Language Processing
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
export const unit6: Unit = {
  id: "aif-u6",
  slug: "natural-language-processing",
  title: "Natural Language Processing",
  summary:
    "How language gets turned into numbers without losing its meaning, and how close that actually gets.",
  lessons: [
    {
      id: "aif-u6-l1",
      slug: "introduction-to-nlp",
      title: "Introduction to NLP",
      kind: "lesson",
      summary:
        "What makes human language hard for a machine, and what NLP is asked to do about it.",
      estimatedMinutes: 20,
      objectives: [
        "Define NLP and its major tasks",
        "Explain why ambiguity makes language hard",
        "Separate language understanding from language generation",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-l2",
      slug: "processing-language",
      title: "How Machines Process Language",
      kind: "lesson",
      summary:
        "Tokenisation, normalization and the unglamorous preprocessing that everything else sits on.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what tokenisation does and why",
        "Describe text normalization and stop words",
        "Say why tokens are not the same as words",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-l3",
      slug: "meaning-and-context",
      title: "Understanding Meaning and Context",
      kind: "lesson",
      summary:
        "Word embeddings and the idea that meaning can be a position in space.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what a word embedding is",
        "Describe how similarity is measured between embeddings",
        "Say why context changes a word's representation",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-l4",
      slug: "nlp-models",
      title: "NLP Models and Architectures",
      kind: "lesson",
      summary:
        "Recurrent networks, LSTMs and the memory problem that attention was invented to solve.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how an RNN processes a sequence",
        "Explain the problem with long sequences",
        "Say what attention was introduced to fix",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-l5",
      slug: "nlp-applications",
      title: "NLP Applications",
      kind: "lesson",
      summary:
        "Sentiment analysis, entity recognition, translation and speech, and what each one gets wrong.",
      estimatedMinutes: 20,
      objectives: [
        "Match an NLP task to a real application",
        "Explain a common failure mode for each",
        "Judge where human review is still required",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-c1",
      slug: "break-a-translator",
      title: "Break a Translator",
      kind: "connection",
      summary:
        "Find the sentences a translation system cannot handle, and work out what about them is hard.",
      estimatedMinutes: 30,
      objectives: [
        "Construct inputs that expose NLP limitations",
        "Explain a failure using tokenisation or context",
        "Assess the risk of relying on automated translation",
      ],
      blocks: [],
    },
    {
      id: "aif-u6-q1",
      slug: "unit-quiz",
      title: "Unit 6 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
