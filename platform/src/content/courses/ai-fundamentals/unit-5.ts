import type { Unit } from "@/content/types";

/**
 * Unit 5: Computer Vision
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
export const unit5: Unit = {
  id: "aif-u5",
  slug: "computer-vision",
  title: "Computer Vision",
  summary:
    "How a grid of numbers becomes a face, a tumour or a stop sign, and what still goes wrong.",
  lessons: [
    {
      id: "aif-u5-l1",
      slug: "introduction-to-computer-vision",
      title: "Introduction to Computer Vision",
      kind: "lesson",
      summary:
        "What computer vision is for, and why seeing turned out to be harder than chess.",
      estimatedMinutes: 20,
      objectives: [
        "Define computer vision and its main tasks",
        "Explain why vision resisted hand-written rules",
        "Name the applications that drove the field",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-l2",
      slug: "how-computers-see",
      title: "How Computers Understand Images",
      kind: "lesson",
      summary:
        "Pixels, resolution and color channels: an image as the model receives it.",
      estimatedMinutes: 20,
      objectives: [
        "Describe an image as a numerical array",
        "Explain color channels and resolution",
        "Say what a feature is in a visual context",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-l3",
      slug: "recognition-and-detection",
      title: "Image Recognition and Object Detection",
      kind: "lesson",
      summary:
        "Classification, localisation and detection, and the difference between what and where.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish classification, localisation and detection",
        "Explain what a bounding box is and how it is predicted",
        "Choose the right task for a stated goal",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-l4",
      slug: "convolutional-networks",
      title: "Convolutional Neural Networks",
      kind: "lesson",
      summary:
        "Filters, feature maps and pooling, and why looking at small patches was the breakthrough.",
      estimatedMinutes: 30,
      objectives: [
        "Explain what a convolution does to an image",
        "Describe what successive layers detect",
        "Say why pooling is used",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-l5",
      slug: "vision-applications",
      title: "Advanced Computer Vision Applications",
      kind: "lesson",
      summary:
        "Segmentation, facial recognition, OCR and autonomous vehicles, including the failures.",
      estimatedMinutes: 25,
      objectives: [
        "Describe segmentation and how it differs from detection",
        "Explain how facial recognition works and where it fails",
        "Assess a vision application for risk",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-c1",
      slug: "test-a-vision-system",
      title: "Test a Vision System",
      kind: "connection",
      summary:
        "Deliberately try to break a vision feature you have access to, then explain the failures in the unit's own vocabulary.",
      estimatedMinutes: 30,
      objectives: [
        "Design inputs likely to make a vision system fail",
        "Explain an observed failure in technical terms",
        "Judge whether a failure pattern is harmful or merely annoying",
      ],
      blocks: [],
    },
    {
      id: "aif-u5-q1",
      slug: "unit-quiz",
      title: "Unit 5 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      objectives: [
        "Confirm you can explain what a convolution does",
        "Confirm you can match a vision task to a problem",
      ],
      blocks: [],
    },
  ],
};
