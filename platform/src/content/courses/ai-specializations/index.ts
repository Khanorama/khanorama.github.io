import type { Course } from "@/content/types";
import { unit1 } from "@/content/courses/ai-specializations/unit-1";
import { unit2 } from "@/content/courses/ai-specializations/unit-2";
import { unit3 } from "@/content/courses/ai-specializations/unit-3";
import { unit4 } from "@/content/courses/ai-specializations/unit-4";
import { unit5 } from "@/content/courses/ai-specializations/unit-5";
import { unit6 } from "@/content/courses/ai-specializations/unit-6";
import { unit7 } from "@/content/courses/ai-specializations/unit-7";
import { unit8 } from "@/content/courses/ai-specializations/unit-8";

/**
 * AI Specializations.
 *
 * The second half of the Foundations of AI curriculum. AI Fundamentals
 * stops at the problem attention was invented to solve; this course opens
 * by solving it, then runs through generative models, prompting, retrieval,
 * customization, agents, evaluation and infrastructure.
 *
 * STILL NO CODE, which matters more here than in the first course rather
 * than less. The temptation at this level is to slide into implementation,
 * and a student who can configure a RAG pipeline without being able to say
 * why retrieval sets the ceiling on it has learned a tool rather than a
 * subject. Every lesson here explains a mechanism; none asks anyone to
 * build one.
 *
 * ON THE PREREQUISITE. This assumes AI Fundamentals, and specifically
 * assumes embeddings, the training loop and the recurrent bottleneck.
 * Where a lesson leans on one of those it says which unit of the first
 * course it came from, rather than re-teaching it badly.
 *
 * Same shape as AI Fundamentals: each unit closes with a real-world
 * connection and a quiz. The connections are harder here, because at this
 * level the useful exercise is no longer "find the AI in something you
 * use" but "design this, then write down how it fails".
 */
export const aiSpecializations: Course = {
  id: "ai-specializations",
  slug: "ai-specializations",
  title: "AI Specializations",
  subtitle:
    "The machinery behind modern AI: transformers, generation, retrieval, agents, and how any of it is evaluated.",
  description:
    "AI Specializations picks up where AI Fundamentals leaves off. You will learn what a transformer is actually doing, how a prompt becomes an image, why retrieval beats retraining for most knowledge problems, what separates an agent from a chatbot, and why a model states falsehoods with complete confidence. It ends on what it takes to run these systems and how to read a prediction about where they are going.",
  level: "Advanced",
  status: "inDevelopment",
  estimatedHours: 25,
  art: "/art/attention.svg",
  highlights: [
    {
      title: "Starts where the first course stops",
      body: "AI Fundamentals ends at the memory problem that broke recurrent networks. This opens by explaining what attention did about it, which means the first lesson is doing real work rather than reintroducing the subject.",
    },
    {
      title: "Mechanisms, not tools",
      body: "You will understand why a RAG system fails at retrieval rather than generation, and why fine-tuning cannot teach a model facts. Knowing which of four approaches a problem needs is worth more than knowing how to configure any one of them.",
    },
    {
      title: "Honest about what is unsettled",
      body: "Whether scaling reaches general intelligence, what alignment would even mean, and how much of the current trend continues are open questions. Where the field disagrees, this course says so instead of picking a side and presenting it as fact.",
    },
    {
      title: "Every unit ends with a design problem",
      body: "The connections here ask you to scope an agent and write down what it must never be allowed to do, or to design a retrieval system and predict how it breaks. Building the thing in your head is where the understanding gets tested.",
    },
  ],
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8],
};
