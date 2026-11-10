import type { Unit } from "@/content/types";

/**
 * Unit 3: Data Science and Data Fundamentals
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
export const unit3: Unit = {
  id: "aif-u3",
  slug: "data-and-data-science",
  title: "Data Science and Data Fundamentals",
  summary:
    "The part nobody puts in the demo: where data comes from, what is wrong with it, and why that decides what the model becomes.",
  lessons: [
    {
      id: "aif-u3-l1",
      slug: "introduction-to-data-science",
      title: "Introduction to Data Science",
      kind: "lesson",
      summary:
        "What data science is, how it relates to AI, and the lifecycle a dataset goes through.",
      estimatedMinutes: 20,
      objectives: [
        "Describe the data science lifecycle",
        "Distinguish data science, machine learning and AI",
        "Explain why most of the work happens before any model is trained",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-l2",
      slug: "understanding-data",
      title: "Understanding Data",
      kind: "lesson",
      summary:
        "Structured and unstructured, quantitative and qualitative, and what a row and a column really are.",
      estimatedMinutes: 20,
      objectives: [
        "Classify data as structured or unstructured",
        "Identify features and labels in a real dataset",
        "Explain why unstructured data was unusable until recently",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-l3",
      slug: "collection-and-preparation",
      title: "Data Collection and Preparation",
      kind: "lesson",
      summary:
        "Acquisition, cleaning, preprocessing and labelling, and the human cost hiding in the last one.",
      estimatedMinutes: 25,
      objectives: [
        "Describe the steps between raw data and training data",
        "Explain what data labelling involves and who does it",
        "Recognise how collection decisions become model behaviour",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-l4",
      slug: "statistics-for-ai",
      title: "Statistics for AI",
      kind: "lesson",
      summary:
        "Means, spread, probability and correlation: the minimum statistics needed to read a model's claims.",
      estimatedMinutes: 25,
      objectives: [
        "Interpret mean, median, variance and standard deviation",
        "Read a distribution and say what it implies for a model",
        "Explain why correlation does not establish cause",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-l5",
      slug: "analysis-and-visualisation",
      title: "Data Analysis and Visualization",
      kind: "lesson",
      summary:
        "Exploratory analysis, the charts that reveal problems, and outliers that are either errors or the whole point.",
      estimatedMinutes: 20,
      objectives: [
        "Choose an appropriate chart for a question",
        "Spot outliers and decide whether to keep them",
        "Explain what exploratory analysis is looking for",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-c1",
      slug: "audit-a-dataset",
      title: "Audit a Dataset",
      kind: "connection",
      summary:
        "Take a real public dataset and work out who is in it, who is missing, and what a model trained on it would conclude.",
      estimatedMinutes: 30,
      objectives: [
        "Assess a real dataset for coverage and gaps",
        "Predict how a dataset's composition shapes model behaviour",
        "Write a short, specific account of a dataset's limitations",
      ],
      blocks: [],
    },
    {
      id: "aif-u3-q1",
      slug: "unit-quiz",
      title: "Unit 3 Quiz",
      kind: "unitQuiz",
      summary: "Eight questions on data types, preparation and statistics.",
      estimatedMinutes: 15,
      objectives: [
        "Confirm you can read basic statistics correctly",
        "Confirm you can connect data problems to model problems",
      ],
      blocks: [],
    },
  ],
};
