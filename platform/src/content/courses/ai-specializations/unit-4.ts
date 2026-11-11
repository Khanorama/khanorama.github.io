import type { Unit } from "@/content/types";

/**
 * Unit 4: Retrieval-Augmented Generation and Knowledge Systems
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
export const unit4: Unit = {
  id: "ais-u4",
  slug: "rag-and-knowledge",
  title: "Retrieval-Augmented Generation and Knowledge Systems",
  summary:
    "Giving a model access to information it was never trained on, and why most RAG systems fail at retrieval rather than generation.",
  lessons: [
    {
      id: "ais-u4-l1",
      slug: "introduction-to-rag",
      title: "Introduction to RAG",
      kind: "lesson",
      summary:
        "The problem RAG solves, and why it beats retraining for most knowledge needs.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what RAG adds to a language model",
        "Say why retrieval is usually preferable to retraining for facts",
        "Identify problems RAG does not solve",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-l2",
      slug: "embeddings-and-vector-databases",
      title: "Embeddings and Vector Databases",
      kind: "lesson",
      summary: "Semantic search, and what a vector database is really storing.",
      estimatedMinutes: 30,
      objectives: [
        "Explain how embeddings enable search by meaning",
        "Describe what a vector database does and why it is needed",
        "Say why semantic search can retrieve the wrong thing confidently",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-l3",
      slug: "the-rag-pipeline",
      title: "Understanding the RAG Pipeline",
      kind: "lesson",
      summary:
        "Ingestion, chunking, retrieval, augmentation, generation, and where each stage goes wrong.",
      estimatedMinutes: 30,
      objectives: [
        "Trace a question through every stage of a RAG pipeline",
        "Explain why chunking decisions determine retrieval quality",
        "Identify which stage a given failure came from",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-l4",
      slug: "advanced-retrieval",
      title: "Advanced Retrieval Techniques",
      kind: "lesson",
      summary:
        "Reranking, hybrid search and query rewriting, and the fact that retrieval sets the ceiling.",
      estimatedMinutes: 25,
      objectives: [
        "Describe reranking and what it fixes",
        "Explain why hybrid search beats pure semantic search",
        "Say why generation quality cannot exceed retrieval quality",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-l5",
      slug: "graphrag",
      title: "Advanced Knowledge Systems: GraphRAG and Knowledge Graphs",
      kind: "lesson",
      summary:
        "When relationships between facts matter more than the facts, and what a graph adds.",
      estimatedMinutes: 30,
      objectives: [
        "Explain what a knowledge graph represents",
        "Describe a question graph retrieval answers that vector search cannot",
        "Assess whether a problem justifies the extra complexity",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-c1",
      slug: "design-a-retrieval-system",
      title: "Design a Retrieval System",
      kind: "connection",
      summary:
        "Take a real body of documents and work out how you would chunk, retrieve and verify it.",
      estimatedMinutes: 35,
      objectives: [
        "Make and justify chunking decisions for real documents",
        "Predict the retrieval failures a given corpus will produce",
        "Specify how you would evaluate the system",
      ],
      blocks: [],
    },
    {
      id: "ais-u4-q1",
      slug: "unit-quiz",
      title: "Unit 4 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
