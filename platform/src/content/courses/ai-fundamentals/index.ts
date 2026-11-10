import type { Course } from "@/content/types";
import { unit1 } from "@/content/courses/ai-fundamentals/unit-1";
import { unit2 } from "@/content/courses/ai-fundamentals/unit-2";
import { unit3 } from "@/content/courses/ai-fundamentals/unit-3";
import { unit4 } from "@/content/courses/ai-fundamentals/unit-4";
import { unit5 } from "@/content/courses/ai-fundamentals/unit-5";
import { unit6 } from "@/content/courses/ai-fundamentals/unit-6";
import { unit7 } from "@/content/courses/ai-fundamentals/unit-7";

/**
 * AI Fundamentals.
 *
 * The first half of the Foundations of AI curriculum: what AI is, how
 * machines learn, the data underneath it, neural networks, and the two
 * fields that made modern AI visible to everyone, vision and language. It
 * closes on ethics and real-world use, which belong here rather than in the
 * second course because a student who stops after this one should still
 * leave able to think about what AI is doing to the world.
 *
 * The second course, AI Specializations, picks up at transformers and large
 * language models and runs through generative AI, reliability, retrieval,
 * agents and the future.
 *
 * NO CODE IS WRITTEN IN THIS COURSE, and that is the whole design rather
 * than a limitation. Students are expected to understand what a convolution
 * or an embedding does, why it exists and roughly how it works, not to
 * implement one. The blocks this course is built from reflect that: prose,
 * figures, quizzes and written answers, with no editor anywhere.
 *
 * EACH UNIT CLOSES WITH TWO ENTRIES rather than one progress check. A
 * real-world connection, where the student takes the unit somewhere real and
 * writes about what they find, and a quiz. The two do different jobs. The
 * connection is the better test of whether any of it landed and cannot be
 * marked right or wrong; the quiz can be, and is what makes the unit's
 * completion a fact rather than a feeling.
 */
export const aiFundamentals: Course = {
  id: "ai-fundamentals",
  slug: "ai-fundamentals",
  title: "AI Fundamentals",
  subtitle:
    "Understand how AI actually works, from the ground up, without writing a line of code.",
  description:
    "AI Fundamentals explains the machinery behind the tools everyone is suddenly using. You will learn what counts as intelligence in a machine, how a model learns from data, what a neural network is really doing, and how computers came to see images and read language. It finishes on the part that matters most: what these systems get wrong, who they affect, and where they are already being used.",
  level: "Beginner",
  status: "inDevelopment",
  estimatedHours: 19,
  /*
    Shared with the "Machine Learning with Python" entry in UPCOMING, which
    is a collision worth resolving rather than living with: the two now sit
    on the same shelf with the same picture and overlapping positioning.
  */
  art: "/art/ai.webp",
  highlights: [
    {
      title: "No coding, and no hand-waving either",
      body: "You will not write any code. You will still learn what backpropagation does, why a convolution looks at small patches of an image, and what a word embedding actually is. Understanding a thing and implementing it are different skills, and this course teaches the first one properly.",
    },
    {
      title: "Taught in diagrams",
      body: "A neural network, a training loop and an image filter are pictures before they are paragraphs. Every idea that has a shape is drawn, and the drawings are the explanation rather than decoration beside it.",
    },
    {
      title: "Checked as you go",
      body: "Each lesson asks you to commit to an answer before you are told the right one, which is where the learning happens. Every unit ends with a quiz, so finishing a unit means something specific rather than having scrolled to the bottom.",
    },
    {
      title: "Connected to things you actually use",
      body: "Every unit ends by sending you to look at something real, an app on your phone or a system you already rely on, and asking you to explain what it is doing. Abstract ideas stay abstract until you catch one in the wild.",
    },
  ],
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7],
};
