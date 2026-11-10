import type { Unit } from "@/content/types";

/**
 * Unit 3: Data Science and Data Fundamentals.
 *
 * Placed before neural networks on purpose. A student who meets deep
 * learning first comes away believing the architecture is where the
 * difficulty lives, when in practice almost every failed project failed on
 * its data: not enough of it, labeled badly, or collected from a population
 * that does not match the one the model was later pointed at.
 *
 * The statistics lesson is deliberately narrow. The goal is a student who
 * can read a claim about a model and know what is missing from it, not one
 * who can derive anything.
 */

/* ------------------------------------------------------------- figures */

/** The lifecycle, drawn as a loop because it never actually ends. */
const LIFECYCLE_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u3-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g font-size="12">
    <rect x="14" y="70" width="104" height="56" rx="9"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="66" y="94" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">Ask</text>
    <text x="66" y="112" text-anchor="middle" fill="var(--color-ink-muted)">what question?</text>

    <rect x="142" y="70" width="104" height="56" rx="9"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="194" y="94" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">Collect</text>
    <text x="194" y="112" text-anchor="middle" fill="var(--color-ink-muted)">find the data</text>

    <rect x="270" y="70" width="104" height="56" rx="9"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" stroke-width="2" />
    <text x="322" y="94" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-warning)">Clean</text>
    <text x="322" y="112" text-anchor="middle" fill="var(--color-ink-muted)">most of the job</text>

    <rect x="398" y="70" width="104" height="56" rx="9"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="450" y="94" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">Explore</text>
    <text x="450" y="112" text-anchor="middle" fill="var(--color-ink-muted)">look at it</text>

    <rect x="526" y="70" width="104" height="56" rx="9"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="578" y="94" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">Model</text>
    <text x="578" y="112" text-anchor="middle" fill="var(--color-ink-muted)">the easy part</text>
  </g>

  <path d="M118 98 L136 98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#u3-a)" fill="none" />
  <path d="M246 98 L264 98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#u3-a)" fill="none" />
  <path d="M374 98 L392 98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#u3-a)" fill="none" />
  <path d="M502 98 L520 98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#u3-a)" fill="none" />

  <path d="M578 130 L578 176 Q578 190 564 190 L80 190 Q66 190 66 176 L66 132"
        stroke="var(--color-accent)" stroke-width="2" stroke-dasharray="6 4"
        fill="none" marker-end="url(#u3-a)" />
  <rect x="236" y="174" width="172" height="32" rx="8"
        fill="var(--color-paper)" stroke="var(--color-line-strong)" />
  <text x="322" y="195" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
    the answer raises a question</text>

  <text x="320" y="34" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Practitioners routinely report spending most of their time on the third box.</text>
</svg>`;

/** Mean and median pulled apart by one outlier. */
const SKEW_SVG = `
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="40" y1="150" x2="600" y2="150" stroke="var(--color-line-strong)" stroke-width="1.5" />

  <g fill="var(--color-accent)">
    <circle cx="70" cy="150" r="7" /><circle cx="96" cy="150" r="7" />
    <circle cx="118" cy="150" r="7" /><circle cx="140" cy="150" r="7" />
    <circle cx="166" cy="150" r="7" /><circle cx="188" cy="150" r="7" />
    <circle cx="214" cy="150" r="7" /><circle cx="236" cy="150" r="7" />
    <circle cx="262" cy="150" r="7" />
  </g>
  <circle cx="566" cy="150" r="7" fill="var(--color-danger)" />
  <text x="566" y="178" text-anchor="middle" font-size="11" fill="var(--color-danger)">one outlier</text>

  <line x1="166" y1="100" x2="166" y2="140" stroke="var(--color-success)" stroke-width="2" />
  <text x="166" y="92" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-success)">median</text>
  <text x="166" y="76" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    the middle one</text>

  <line x1="330" y1="100" x2="330" y2="140" stroke="var(--color-warning)" stroke-width="2" />
  <text x="330" y="92" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-warning)">mean</text>
  <text x="330" y="76" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    dragged right</text>

  <text x="320" y="218" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Nine values sit on the left. The average describes none of them.</text>
  <text x="320" y="32" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Ten salaries at a small company</text>
</svg>`;

/** Why you look at the data instead of trusting the summary. */
const SAME_STATS_SVG = `
<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g>
    <rect x="30" y="26" width="170" height="130" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="58" cy="132" r="3.5" fill="var(--color-accent)" />
    <circle cx="80" cy="118" r="3.5" fill="var(--color-accent)" />
    <circle cx="102" cy="104" r="3.5" fill="var(--color-accent)" />
    <circle cx="124" cy="88" r="3.5" fill="var(--color-accent)" />
    <circle cx="146" cy="74" r="3.5" fill="var(--color-accent)" />
    <circle cx="168" cy="58" r="3.5" fill="var(--color-accent)" />
    <text x="115" y="176" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">a real trend</text>
  </g>

  <g>
    <rect x="235" y="26" width="170" height="130" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="263" cy="128" r="3.5" fill="var(--color-accent)" />
    <circle cx="285" cy="96" r="3.5" fill="var(--color-accent)" />
    <circle cx="307" cy="72" r="3.5" fill="var(--color-accent)" />
    <circle cx="329" cy="68" r="3.5" fill="var(--color-accent)" />
    <circle cx="351" cy="86" r="3.5" fill="var(--color-accent)" />
    <circle cx="373" cy="122" r="3.5" fill="var(--color-accent)" />
    <text x="320" y="176" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">a curve, not a line</text>
  </g>

  <g>
    <rect x="440" y="26" width="170" height="130" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="468" cy="118" r="3.5" fill="var(--color-accent)" />
    <circle cx="468" cy="104" r="3.5" fill="var(--color-accent)" />
    <circle cx="468" cy="90" r="3.5" fill="var(--color-accent)" />
    <circle cx="468" cy="76" r="3.5" fill="var(--color-accent)" />
    <circle cx="468" cy="62" r="3.5" fill="var(--color-accent)" />
    <circle cx="588" cy="134" r="3.5" fill="var(--color-danger)" />
    <text x="525" y="176" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">one point doing the work</text>
  </g>

  <text x="320" y="206" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    These three can share a mean, a variance and a correlation. Only one is a line.</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Three words people use interchangeably

**Artificial intelligence** is the broad goal: machines doing things we would call intelligent.

**Machine learning** is one approach to it: finding rules from examples rather than writing them.

**Data science** is the discipline of getting useful answers out of data, whether or not a model is involved. Plenty of valuable data science is a careful count and a chart.

They overlap heavily, which is why the words get swapped around. The distinction that actually matters for this unit is that machine learning consumes data, and data science is where that data comes from and whether it can be trusted.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: LIFECYCLE_SVG,
          alt: "Five boxes in sequence: Ask what question, Collect find the data, Clean most of the job (highlighted), Explore look at it, Model the easy part. A dashed arrow loops from Model back to Ask, labeled: the answer raises a question.",
          caption:
            "Cleaning is highlighted because it is where the time goes. The modeling box, which is the part that gets talked about, is often the shortest.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Why the third box is the biggest

Real data is filthy. Not metaphorically: a column that should hold dates contains "last Tuesday", "n/a", and a value from 1900 because a form defaulted to it. Names are duplicated with different spellings. A sensor read zero for three weeks because it was unplugged, and nothing recorded that.

Surveys of practitioners have for years reported that the majority of the work is finding, cleaning and organizing data rather than modeling it. The exact fraction varies with who is asking, but nobody reports the opposite.

This is worth knowing for two reasons. It is the honest shape of the work, and it is why a course about AI has a unit about spreadsheets. It is also the reason so many impressive demonstrations never become products: the demonstration used a clean public dataset, and the company's own data is not like that.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "A team says their model is ready after two weeks, and the project has run for eight months. What most likely took the other seven and a half months?",
          choices: [
            "Training the model on faster hardware",
            "Finding, cleaning and labeling the data",
            "Choosing which algorithm to use",
            "Writing the user interface",
          ],
          answer: 1,
          explanation:
            "Getting data into a usable state is routinely most of a project. Training is often a matter of hours or days, and the choice of algorithm is usually settled quickly because a handful of standard options cover most problems.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Two kinds

**Structured data** lives in rows and columns. A spreadsheet, a database table. Every row is one thing, every column is one measurement, and the meaning is in the layout. Most business data is structured.

**Unstructured data** is everything else: photographs, audio, video, free text, scanned documents. It has no rows and columns, and until recently computers could do almost nothing with it beyond store it and hand it back.

The estimate usually quoted is that the large majority of the world's data is unstructured. That figure is the reason the last fifteen years happened. Deep learning made unstructured data usable, which unlocked a vast store of information that had been sitting there unreadable.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Rows, columns, features and labels

In a structured dataset the vocabulary from Unit 2 maps directly onto the layout.

One **row** is one example. One **column** is one feature, except for the column holding the answer, which is the label.

That simple picture hides the hardest decision in applied machine learning, which is **feature engineering**: choosing what to measure in the first place. A dataset of houses with "year built" is less useful than the same dataset with "age in years at time of sale", because the second is the thing that actually affects price and the model would otherwise have to work it out. Picking and shaping features well has historically mattered more than the choice of algorithm.

Deep learning weakened this, which is one of its genuine achievements. A neural network given raw pixels finds its own features, so nobody has to decide in advance that edges and corners matter. That is why Unit 4 describes it as learning features rather than being given them.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A hospital stores patient age, blood pressure readings, and a free-text note from the doctor. How is this best described?",
          choices: [
            "Entirely structured, because it is in a database",
            "Entirely unstructured, because it includes free text",
            "A mix: age and blood pressure are structured, the note is unstructured",
            "Neither, because medical data is its own category",
          ],
          answer: 2,
          explanation:
            "Most real datasets are mixed. Being stored in a database does not make the note structured: it is still a block of prose whose meaning is not in its position. The note is also often where the most valuable information is, which is why extracting it is a major use of the NLP techniques in Unit 6.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Why was unstructured data largely unusable before deep learning?",
          choices: [
            "There was not enough of it",
            "Storage was too expensive",
            "Turning it into useful features required rules nobody could write",
            "It was always stored in the wrong format",
          ],
          answer: 2,
          explanation:
            "Somebody had to specify what to measure, and nobody could say what measurements turn a photograph into 'contains a cat'. Deep learning finds those features itself, which is what made the pile of images and text and audio suddenly worth something.",
        },
      ],
    },

    {
      id: "aif-u3-l3",
      slug: "collection-and-preparation",
      title: "Data Collection and Preparation",
      kind: "lesson",
      summary:
        "Acquisition, cleaning, preprocessing and labeling, and the human cost hiding in the last one.",
      estimatedMinutes: 25,
      objectives: [
        "Describe the steps between raw data and training data",
        "Explain what data labeling involves and who does it",
        "Recognize how collection decisions become model behavior",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Where it comes from

Data is collected, bought, scraped, or generated. Each route carries its own problem.

**Collected** data is gathered for the purpose, which makes it well matched to the question and expensive.

**Existing** data was gathered for some other reason, which makes it cheap and subtly wrong: it answers the question somebody else was asking. Hospital records exist for billing and treatment, not for training models, and they reflect who sought care rather than who was ill.

**Scraped** data is taken from the web at scale. It is how the largest models were trained, and it raises the copyright and consent questions in Unit 7.

**Synthetic** data is generated rather than observed. Useful for rare cases you cannot collect, and dangerous because a model trained on your assumptions will confirm them.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Cleaning, in the specific

**Missing values.** You can drop those rows, which loses information and may quietly drop a particular kind of person. You can fill them with an average, which invents data. Both are wrong; you pick the less wrong one and write down which.

**Duplicates.** The same record twice makes the model weight it twice. Worse, a duplicate that lands in both the training and test sets destroys your evaluation, because the model is being tested on something it memorized.

**Inconsistent formats.** Dates as 03/04 in two countries, which is March in one and April in the other. Units mixed in one column.

**Outliers.** A value far from the rest, which is either an error to remove or the most important row in the dataset. Fraud detection is entirely a search for outliers, so a pipeline that strips them is a pipeline that deletes the answer.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A dataset of transaction amounts contains a few values thousands of times larger than the rest. What should you do?",
          choices: [
            "Remove them, since they will distort the model",
            "Replace them with the average so nothing is lost",
            "Work out what they are before deciding, because they may be the signal",
            "Leave the data alone; cleaning always loses information",
          ],
          answer: 2,
          explanation:
            "An unusually large transaction is either a data entry error, a legitimate large purchase, or fraud, and those demand three different responses. Deciding by the size of the number alone means that if you are building a fraud detector you have just deleted every example of fraud.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Labeling, and who does it

Supervised learning needs labels, and labels are made by people.

For large datasets this is done by crowdworkers, often paid per item, frequently in lower-income countries, working at speed. The reporting on content moderation and dataset annotation over the last decade has documented low pay and, for some tasks, serious psychological harm from the material being reviewed.

This matters technically as well as ethically. Labels produced at speed by people given an ambiguous brief are noisy, and the model learns the noise. Where two annotators disagree, the usual question asked is "which is right", and the better question is often "is this task actually well defined".

The quality of a dataset's labels sets a ceiling on the model. No architecture recovers from being told the wrong answers.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Two annotators disagree on 30% of items in a sentiment labeling task. What does this most likely indicate?",
          choices: [
            "One annotator is careless and should be replaced",
            "The task is ambiguous and the labels will be noisy however many people you hire",
            "The dataset is too small",
            "The model will resolve the disagreement during training",
          ],
          answer: 1,
          explanation:
            "Persistent disagreement at that rate usually means the category itself is unclear, not that someone is wrong. Hiring more annotators produces more disagreement. The fix is to sharpen the definition, or to accept that the ceiling on accuracy is set by how much humans agree, since a model cannot be more consistent than its labels.",
        },
        {
          id: "b6",
          kind: "written",
          prompt:
            "A music app wants to predict which songs a user will like, using only data it already has. Name two things that data will systematically miss, and what effect each would have on the model.",
          modelAnswer: `Two examples of the kind of answer this is looking for.

Songs the user has never been shown. The app only records reactions to what it recommended, so a song never surfaced has no data, and the model concludes nothing about it. This is a feedback loop: the recommender narrows what it shows, which narrows what it learns, which narrows what it shows.

Listening that happens elsewhere. If someone plays an album on vinyl or at a friend's house, the app sees nothing, so the model builds a picture of taste that is really a picture of in-app behavior.

A strong answer names the mechanism rather than just saying "the data is incomplete", and says what the model would wrongly conclude as a result.`,
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Middles

The **mean** is the average: add everything up and divide. The **median** is the middle value when you sort them. The **mode** is the most common value.

When data is roughly symmetric these are close together and it hardly matters which you use. When it is not, the difference is the whole story.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: SKEW_SVG,
          alt: "Ten salaries on a number line. Nine cluster at the left, one sits far to the right marked as an outlier. The median line sits among the nine; the mean line is dragged well to the right of all of them.",
          caption:
            "Whenever you see an average quoted for incomes, prices or wait times, ask for the median. The gap between the two tells you about the shape of what is being hidden.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Spread

Two datasets can share a mean and be nothing alike. **Variance** measures how spread out values are; **standard deviation** is its square root, which puts it back into the same units as the data and makes it readable.

For a roughly bell-shaped distribution, about two thirds of values fall within one standard deviation of the mean and about 95% within two. That rough rule is enough to tell whether a value is ordinary or remarkable.

This matters for models because spread tells you how confident to be. A model predicting delivery times with a mean error of ten minutes sounds fine, until you learn the standard deviation is forty, at which point it is sometimes two hours out.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Correlation, and the thing everybody says about it

**Correlation** measures whether two things move together, from +1 for moving in lockstep, through 0 for no relationship, to -1 for moving in opposite directions.

Correlation does not establish cause. Everyone knows the phrase; the useful part is knowing the three ways it can be true without cause.

**Reverse direction.** Hospitals correlate with illness. Hospitals do not cause illness.

**A common cause.** Ice cream sales correlate with drownings. Summer causes both.

**Coincidence.** Search enough pairs of variables and some will track each other closely for years with no connection whatsoever. This gets more likely the more variables you have, which is a particular hazard for models given thousands of features.

Machine learning is correlation machinery. It finds things that move together and uses them to predict. It does not know why, it is not trying to know why, and when the underlying situation changes the correlation can break without warning.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A model finds that students who use the library more get better grades. What can the school conclude?",
          choices: [
            "Using the library causes better grades, so attendance should be required",
            "Better grades cause library use",
            "The two go together, and the reason could be either direction or a third factor like available study time",
            "Nothing, because correlation is never useful",
          ],
          answer: 2,
          explanation: `A student with more free time, more support at home or stronger motivation might both use the library and do well, with the library doing none of the causing.

Note that the correlation is still useful. It might be a perfectly good feature for predicting which students are struggling. The error is not in using it to predict; it is in acting as though forcing the behavior would produce the outcome.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Two delivery services both average 30 minutes. One has a standard deviation of 4 minutes, the other 25 minutes. Which would you rather use, and why?",
          choices: [
            "They are equivalent, since the averages match",
            "The 25-minute one, because it is sometimes much faster",
            "The 4-minute one, because its times are predictable",
            "Not enough information",
          ],
          answer: 2,
          explanation:
            "The second service is sometimes very fast and sometimes catastrophically slow, and you cannot tell in advance which you will get. For most real purposes consistency is worth more than an occasional good outcome, which is exactly the information the average alone destroys.",
        },
      ],
    },

    {
      id: "aif-u3-l5",
      slug: "analysis-and-visualization",
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Looking before modeling

**Exploratory data analysis** is the step where you look at the data before asking anything of it. Not to prove something, but to find out what you are holding.

It is where you discover that a quarter of a column is missing, that someone recorded weight in pounds for one year and kilograms for the next, that the data stops abruptly in March, or that what you were told is a representative sample came from three cities.

Every one of those is invisible in a summary statistic and obvious in a chart.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: SAME_STATS_SVG,
          alt: "Three scatter plots. The first shows points in a clear rising line. The second shows points following a curve. The third shows a vertical stack of points plus one isolated point far to the lower right. Caption notes all three can share the same mean, variance and correlation.",
          caption:
            "This is the argument for plotting your data, made in one picture. Summary numbers can be identical for datasets that mean completely different things.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `The third panel is worth sitting with. Its correlation is being produced entirely by one point. Remove that point and the relationship vanishes. A model trained on data like this has learned something that does not exist, and no amount of accuracy reporting would reveal it.

Choosing a chart is mostly about the question:

A **histogram** shows the shape of one variable, which is how you spot skew and gaps.
A **scatter plot** shows the relationship between two, which is how you spot curves and outliers.
A **line chart** shows change over time, which is how you spot the month the sensor broke.
A **bar chart** compares categories, which is how you spot the category with almost nothing in it.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "You want to check whether a dataset's ages are evenly spread or bunched at one end. Which chart?",
          choices: [
            "A scatter plot",
            "A histogram",
            "A line chart over time",
            "A pie chart",
          ],
          answer: 1,
          explanation:
            "A histogram shows the distribution of a single variable, which is precisely the question. A scatter plot needs two variables, a line chart needs a time axis, and a pie chart is poor at almost everything but especially at showing shape.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What is exploratory data analysis mainly looking for?",
          choices: [
            "Evidence to confirm the hypothesis",
            "Problems and surprises in the data before any model is trained",
            "The best algorithm to use",
            "A final answer to present to stakeholders",
          ],
          answer: 1,
          explanation:
            "It is deliberately open-ended. Going in to confirm something is how you miss the broken sensor, and that is the failure exploratory analysis exists to prevent.",
        },
      ],
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
        "Predict how a dataset's composition shapes model behavior",
        "Write a short, specific account of a dataset's limitations",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Find a real public dataset and interrogate it. Not to use it, just to understand what it is.

Good places to look: a government statistics portal, a public health dataset, an open data site run by your city, a Kaggle dataset, or the documentation page for a well-known machine learning dataset. Pick one with a description of how it was collected. If there is no such description, that is itself a finding worth writing down.

Spend about half an hour, and answer the four questions below about the dataset you chose.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**What is in it?** Name the dataset. How many rows, roughly? What is one row? Name three columns and say whether each is a feature or could be a label.",
          modelAnswer: `A strong answer is concrete about what a single row represents, which is the question people skip. "It is housing data" is not an answer; "each row is one property sale, with the sale price, square footage, year built and postcode" is.

Being able to say what one row is also tells you what the dataset can and cannot be asked. A dataset where each row is a city cannot answer questions about individual people, however much you want it to.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Who collected it, when, and why?** What were they trying to achieve? Does that purpose match what someone might now use it for?",
          modelAnswer: `The mismatch between why data was collected and what it gets used for is where most trouble starts.

A strong answer identifies the original purpose and names a specific way it biases the data. Police stop records document police behavior as much as they document crime. Hospital admissions record who sought and could access care. App telemetry records what the app chose to log.

Also worth noting: when. A dataset from 2015 describes 2015. A model trained on it and deployed now assumes nothing relevant has changed.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Who is missing?** Name a group of people, places or cases that are underrepresented or absent, and say how you can tell.",
          modelAnswer: `This is the central question of the activity.

A strong answer names a specific group and a specific mechanism. "People without smartphones are absent because collection was through an app." "Rural areas are thin because the survey was conducted in cities." "Night shifts are missing because the sensor was read at 9am."

It also says how you can tell, which usually means a count by category that reveals a thin or empty bucket, or a collection method that structurally excludes someone.

If you concluded nothing is missing, look harder at the collection method. Every dataset excludes someone; the question is only whether the exclusion matters for what it will be used for.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "**What would a model get wrong?** Describe one specific wrong conclusion a model trained on this data would reach, and who would be affected.",
          modelAnswer: `Join the previous answer to a consequence.

The pattern is: because group X is thin in the data, the model has little signal about X, so it will perform worse for X, and because the model is used for Y, the effect on X is Z.

A strong answer is specific about the harm and about who absorbs it. Vague harm ("it would be biased") is not an answer. "It would predict longer repayment times for applicants from postcodes barely present in the training data, so those applicants get worse terms, and nobody reviewing the output would see why" is.

Keep this. Unit 7 asks you to do this again with a system that is actually deployed.`,
        },
      ],
    },

    {
      id: "aif-u3-q1",
      slug: "unit-quiz",
      title: "Unit 3 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `Commit to an answer before you check it. Being wrong and then reading why is worth considerably more than being right by elimination.

You can retry anything you miss, and there is no score kept beyond your own progress.`,
        },
        {
          id: "b2",
          kind: "quiz",
          prompt:
            "Which stage of a data science project typically takes the most time?",
          choices: [
            "Choosing the algorithm",
            "Finding and cleaning the data",
            "Training the model",
            "Presenting the results",
          ],
          answer: 1,
          explanation:
            "Data preparation dominates, routinely by a large margin. The modeling stage, which is what gets discussed, is often among the shortest.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt: "Which of these is unstructured data?",
          choices: [
            "A table of monthly sales figures",
            "A doctor's free-text note about a patient",
            "A spreadsheet of student grades",
            "A database of product prices",
          ],
          answer: 1,
          explanation:
            "Meaning in prose is not carried by its position in a row and column, which is what structured means. Storing the note in a database does not change that.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Nine employees earn around $40,000 and the founder earns $2 million. Which figure best describes a typical salary?",
          choices: [
            "The mean, because it uses every value",
            "The median, because one extreme value drags the mean away from everyone",
            "Either; they will be close",
            "Neither; you need the mode",
          ],
          answer: 1,
          explanation:
            "The mean here is around $236,000, which describes nobody in the company. The median stays with the nine people who are actually typical. This is why the gap between mean and median is worth asking about whenever an average is quoted.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Two cities' ice cream sales and drowning rates rise together each summer. The correct reading is:",
          choices: [
            "Ice cream consumption causes drownings",
            "Drownings cause ice cream sales",
            "Hot weather drives both, so they correlate without one causing the other",
            "The data must be wrong",
          ],
          answer: 2,
          explanation:
            "A common cause sitting behind both variables is one of the three standard ways a correlation appears without causation, alongside reversed direction and pure coincidence.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "A column of ages has 15% of its values missing. Which response is most defensible?",
          choices: [
            "Delete those rows without further thought",
            "Fill every gap with the average age",
            "Check whether the missing values are random or concentrated in one group, then decide",
            "Leave them blank and let the model handle it",
          ],
          answer: 2,
          explanation:
            "If age is missing mostly for one group, both dropping and averaging will distort the model in a way that falls on that group specifically. Whether the missingness is random is the question that decides which remedy is least harmful.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "What sets the ceiling on how good a supervised model can be?",
          choices: [
            "The speed of the hardware",
            "The quality and consistency of the labels",
            "The number of features",
            "The programming language used",
          ],
          answer: 1,
          explanation:
            "A model learns the answers it is given. If those answers are inconsistent or wrong, no architecture recovers from it, which is why annotator agreement is a more useful number than it sounds.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "Why plot your data rather than rely on summary statistics?",
          choices: [
            "Charts are easier to put in a presentation",
            "Datasets with very different shapes can produce identical summary numbers",
            "Summary statistics are usually calculated wrongly",
            "Plotting is faster than computing averages",
          ],
          answer: 1,
          explanation:
            "A mean, a variance and a correlation can be the same for a straight line, a curve and a cluster with one distant point. Only one of those is a relationship you should model, and the numbers alone will not tell you which.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt:
            "A fraud detection team removes all outliers during cleaning. What have they done?",
          choices: [
            "Improved the data quality correctly",
            "Removed most of the examples of the thing they are trying to detect",
            "Reduced the size of the model",
            "Made the model train faster with no downside",
          ],
          answer: 1,
          explanation:
            "Fraud is an outlier by definition. A cleaning step that strips unusual values is, for this problem, a step that deletes the positive class. Whether an outlier is noise or signal depends entirely on what you are looking for.",
        },
      ],
    },
  ],
};
