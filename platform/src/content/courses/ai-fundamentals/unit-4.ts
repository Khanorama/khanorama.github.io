import type { Unit } from "@/content/types";

/**
 * Unit 4: Deep Learning and Neural Networks
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
export const unit4: Unit = {
  id: "aif-u4",
  slug: "deep-learning-and-neural-networks",
  title: "Deep Learning and Neural Networks",
  summary:
    "What a neural network is made of, what happens when it learns, and why depth turned out to matter so much.",
  lessons: [
    {
      id: "aif-u4-l1",
      slug: "introduction-to-deep-learning",
      title: "Introduction to Deep Learning",
      kind: "lesson",
      summary:
        "What makes learning deep, and what deep learning buys you that earlier methods could not.",
      estimatedMinutes: 20,
      objectives: [
        "Distinguish machine learning from deep learning",
        "Explain what feature learning replaced",
        "Say why deep learning needs so much more data",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-l2",
      slug: "understanding-neural-networks",
      title: "Understanding Neural Networks",
      kind: "lesson",
      summary:
        "The artificial neuron, where the biological analogy helps, and where it badly misleads.",
      estimatedMinutes: 20,
      objectives: [
        "Describe what a single artificial neuron computes",
        "Explain how neurons combine into a network",
        "State the limits of the brain analogy",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-l3",
      slug: "anatomy-of-a-network",
      title: "Anatomy of a Neural Network",
      kind: "lesson",
      summary:
        "Layers, weights, biases and activation functions, drawn rather than described.",
      estimatedMinutes: 25,
      objectives: [
        "Label the parts of a neural network diagram",
        "Explain what weights and biases store",
        "Say why an activation function is required at all",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-l4",
      slug: "how-networks-learn",
      title: "How Neural Networks Learn",
      kind: "lesson",
      summary:
        "Forward pass, loss, backpropagation and gradient descent: one full loop, slowly.",
      estimatedMinutes: 30,
      objectives: [
        "Trace one example forward through a network",
        "Explain what a loss function measures",
        "Describe how backpropagation assigns blame to each weight",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-l5",
      slug: "architectures",
      title: "Neural Network Architectures",
      kind: "lesson",
      summary:
        "Feedforward, recurrent and convolutional networks, and why the shape follows the data.",
      estimatedMinutes: 25,
      objectives: [
        "Match an architecture to a kind of data",
        "Explain why image and sequence data need different shapes",
        "Recognise the architectures named in later units",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-c1",
      slug: "trace-a-decision",
      title: "Trace a Decision",
      kind: "connection",
      summary:
        "Follow a single prediction end to end through a small network, by hand, and find where the answer was actually decided.",
      estimatedMinutes: 30,
      objectives: [
        "Trace an input through a network to an output",
        "Identify which weights mattered most to a result",
        "Explain in plain words why a network gave the answer it did",
      ],
      blocks: [],
    },
    {
      id: "aif-u4-q1",
      slug: "unit-quiz",
      title: "Unit 4 Quiz",
      kind: "unitQuiz",
      summary: "Eight questions on network anatomy, training and architecture.",
      estimatedMinutes: 15,
      objectives: [
        "Confirm you can explain how a network learns",
        "Confirm you can match an architecture to a problem",
      ],
      blocks: [],
    },
  ],
};
