import type { Unit } from "@/content/types";

/**
 * Unit 2: Introduction to Machine Learning
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
export const unit2: Unit = {
  id: "aif-u2",
  slug: "introduction-to-machine-learning",
  title: "Introduction to Machine Learning",
  summary:
    "How a machine learns a rule from examples instead of being handed one, and how you tell whether it learned the right thing.",
  lessons: [
    {
      id: "aif-u2-l1",
      slug: "what-is-machine-learning",
      title: "What Is Machine Learning?",
      kind: "lesson",
      summary:
        "Where machine learning sits inside AI, and the inversion that separates it from ordinary programming.",
      estimatedMinutes: 20,
      objectives: [
        "Define machine learning and place it within AI",
        "Contrast traditional programming with machine learning",
        "Recognize problems that machine learning suits and problems it does not",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-l2",
      slug: "how-machines-learn",
      title: "How Machines Learn",
      kind: "lesson",
      summary:
        "Features, labels, models, training and prediction: the five words that describe every learning system.",
      estimatedMinutes: 20,
      objectives: [
        "Define features, labels, models and training",
        "Trace one example through training and then through prediction",
        "Explain what a trained model physically is",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-l3",
      slug: "types-of-machine-learning",
      title: "Types of Machine Learning",
      kind: "lesson",
      summary:
        "Supervised, unsupervised, self-supervised and reinforcement learning, and what each one needs from you.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish the main categories of machine learning",
        "Match a problem to the category that fits it",
        "Explain why self-supervised learning made large models possible",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-l4",
      slug: "machine-learning-algorithms",
      title: "Machine Learning Algorithms",
      kind: "lesson",
      summary:
        "Classification, regression and clustering, and the family of algorithms that handle each.",
      estimatedMinutes: 25,
      objectives: [
        "Tell classification, regression and clustering apart",
        "Describe how a decision tree makes a decision",
        "Explain why several weak models can beat one strong one",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-l5",
      slug: "training-and-evaluating",
      title: "Training and Evaluating Models",
      kind: "lesson",
      summary:
        "Why you hold data back, what accuracy hides, and the two ways a model can fail to generalise.",
      estimatedMinutes: 25,
      objectives: [
        "Explain why training and test data must be kept separate",
        "Interpret accuracy, precision and recall, and say when accuracy misleads",
        "Identify overfitting and underfitting from described symptoms",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-c1",
      slug: "pick-the-learning",
      title: "Pick the Right Kind of Learning",
      kind: "connection",
      summary:
        "Four real problems, no obvious answers. Decide what kind of learning each needs and what data you would have to find.",
      estimatedMinutes: 30,
      objectives: [
        "Choose a learning type for an unfamiliar problem",
        "Identify what data a given approach would require",
        "Recognize when a problem is not a machine learning problem at all",
      ],
      blocks: [],
    },
    {
      id: "aif-u2-q1",
      slug: "unit-quiz",
      title: "Unit 2 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
