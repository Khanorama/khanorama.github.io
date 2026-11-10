import type { Unit } from "@/content/types";

/**
 * Unit 2: Introduction to Machine Learning.
 *
 * The unit that has to land, because everything from here to the end of the
 * course is a variation on it. Units 4 to 6 are all "machine learning, but
 * for this kind of data", and a student who leaves this unit thinking a
 * model is a lookup table will misunderstand all three.
 *
 * The spine is one idea, stated in 2.1 and returned to in every lesson
 * after: ordinary programming takes rules and data and produces answers,
 * while machine learning takes data and answers and produces the rules.
 */

/* ------------------------------------------------------------- figures */

/** The inversion, which is the whole unit in one picture. */
const INVERSION_SVG = `
<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u2-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <text x="20" y="26" font-size="13" font-weight="600" fill="var(--color-ink-faint)">
    ORDINARY PROGRAMMING</text>
  <rect x="20" y="40" width="124" height="46" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="82" y="69" text-anchor="middle" font-size="14" fill="var(--color-ink)">Rules</text>
  <rect x="20" y="94" width="124" height="46" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="82" y="123" text-anchor="middle" font-size="14" fill="var(--color-ink)">Data</text>
  <path d="M152 90 L236 90" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u2-a)" fill="none" />
  <rect x="244" y="67" width="128" height="46" rx="8"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="308" y="96" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Answers</text>

  <line x1="20" y1="163" x2="620" y2="163" stroke="var(--color-line)" />

  <text x="20" y="196" font-size="13" font-weight="600" fill="var(--color-ink-faint)">
    MACHINE LEARNING</text>
  <rect x="20" y="210" width="124" height="46" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="82" y="239" text-anchor="middle" font-size="14" fill="var(--color-ink)">Data</text>
  <rect x="152" y="210" width="124" height="46" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="214" y="239" text-anchor="middle" font-size="14" fill="var(--color-ink)">Answers</text>
  <path d="M284 233 L368 233" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u2-a)" fill="none" />
  <rect x="376" y="210" width="128" height="46" rx="8"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="2" />
  <text x="440" y="239" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-success)">Rules</text>

  <text x="524" y="232" font-size="12" fill="var(--color-ink-faint)">the model</text>
  <text x="524" y="248" font-size="12" fill="var(--color-ink-faint)">is the rules</text>
</svg>`;

/** Training as a loop that stops, not a thing that happens once. */
const TRAINING_LOOP_SVG = `
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u2-b" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
    <marker id="u2-b2" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-warning)" />
    </marker>
  </defs>

  <rect x="16" y="60" width="118" height="58" rx="9"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="75" y="84" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-ink)">One example</text>
  <text x="75" y="103" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">features in</text>

  <rect x="176" y="60" width="118" height="58" rx="9"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="235" y="84" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-ink)">Model</text>
  <text x="235" y="103" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">current guess</text>

  <rect x="336" y="60" width="118" height="58" rx="9"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="395" y="84" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-ink)">Prediction</text>

  <rect x="496" y="60" width="128" height="58" rx="9"
        fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
  <text x="560" y="84" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-warning)">How wrong?</text>
  <text x="560" y="103" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">vs the real label</text>

  <path d="M134 89 L170 89" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u2-b)" fill="none" />
  <path d="M294 89 L330 89" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u2-b)" fill="none" />
  <path d="M454 89 L490 89" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u2-b)" fill="none" />

  <path d="M560 122 L560 172 Q560 186 546 186 L249 186 Q235 186 235 172 L235 124"
        stroke="var(--color-warning)" stroke-width="2" stroke-dasharray="6 4"
        fill="none" marker-end="url(#u2-b2)" />
  <rect x="306" y="170" width="178" height="32" rx="8"
        fill="var(--color-paper)" stroke="var(--color-warning-line)" />
  <text x="395" y="191" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-warning)">nudge the model a little</text>

  <text x="320" y="238" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Repeat for every example, many times over. That is all training is.</text>
  <text x="320" y="30" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    The loop runs during training only, then stops forever.</text>
</svg>`;

/** Underfit, good fit, overfit, which only make sense as pictures. */
const FITTING_SVG = `
<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g>
    <rect x="14" y="30" width="190" height="140" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="46" cy="140" r="4" fill="var(--color-ink-muted)" />
    <circle cx="74" cy="120" r="4" fill="var(--color-ink-muted)" />
    <circle cx="98" cy="128" r="4" fill="var(--color-ink-muted)" />
    <circle cx="124" cy="92" r="4" fill="var(--color-ink-muted)" />
    <circle cx="150" cy="100" r="4" fill="var(--color-ink-muted)" />
    <circle cx="176" cy="60" r="4" fill="var(--color-ink-muted)" />
    <path d="M34 150 L190 112" stroke="var(--color-warning)" stroke-width="2.5" fill="none" />
    <text x="109" y="190" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-warning)">Underfit</text>
    <text x="109" y="209" text-anchor="middle" font-size="11"
          fill="var(--color-ink-muted)">too simple to follow it</text>
  </g>

  <g>
    <rect x="225" y="30" width="190" height="140" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="257" cy="140" r="4" fill="var(--color-ink-muted)" />
    <circle cx="285" cy="120" r="4" fill="var(--color-ink-muted)" />
    <circle cx="309" cy="128" r="4" fill="var(--color-ink-muted)" />
    <circle cx="335" cy="92" r="4" fill="var(--color-ink-muted)" />
    <circle cx="361" cy="100" r="4" fill="var(--color-ink-muted)" />
    <circle cx="387" cy="60" r="4" fill="var(--color-ink-muted)" />
    <path d="M245 148 Q320 118 401 62" stroke="var(--color-success)" stroke-width="2.5" fill="none" />
    <text x="320" y="190" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-success)">Good fit</text>
    <text x="320" y="209" text-anchor="middle" font-size="11"
          fill="var(--color-ink-muted)">catches the trend</text>
  </g>

  <g>
    <rect x="436" y="30" width="190" height="140" rx="8"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="468" cy="140" r="4" fill="var(--color-ink-muted)" />
    <circle cx="496" cy="120" r="4" fill="var(--color-ink-muted)" />
    <circle cx="520" cy="128" r="4" fill="var(--color-ink-muted)" />
    <circle cx="546" cy="92" r="4" fill="var(--color-ink-muted)" />
    <circle cx="572" cy="100" r="4" fill="var(--color-ink-muted)" />
    <circle cx="598" cy="60" r="4" fill="var(--color-ink-muted)" />
    <path d="M460 152 L468 140 Q482 112 496 120 Q510 134 520 128 Q534 92 546 92 Q560 112 572 100 Q586 64 598 60"
          stroke="var(--color-danger)" stroke-width="2.5" fill="none" />
    <text x="531" y="190" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-danger)">Overfit</text>
    <text x="531" y="209" text-anchor="middle" font-size="11"
          fill="var(--color-ink-muted)">memorized the dots</text>
  </g>
</svg>`;

/* -------------------------------------------------------------- lessons */

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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## A problem you cannot write rules for

Write down the rules for recognizing a cat.

Four legs, but so has a table. Fur, but so has a coat. Pointed ears, except when they are folded. Whiskers, unless the photograph is from behind. Every rule you write has exceptions, and every exception needs its own rule, and after a hundred rules you still cannot handle a cat in a cardboard box.

You know a cat instantly. You cannot say how. That gap, between what people can do and what people can explain well enough to write down, is the gap machine learning exists to cross.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## The inversion

Machine learning is a part of AI, not a synonym for it. Unit 1 described systems that follow rules a person wrote; this is the other branch, where nobody writes the rules.

The difference is best seen as a swap in what goes in and what comes out.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: INVERSION_SVG,
          alt: "Two rows. Ordinary programming takes Rules and Data as inputs and produces Answers. Machine learning takes Data and Answers as inputs and produces Rules, labeled: the model is the rules.",
          caption:
            "Read it twice. In the second row the answers are an input, which is why machine learning needs examples that someone has already worked out.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `In ordinary programming you supply the rules and the data, and the computer produces answers. A tax calculator works this way. Someone read the law, wrote it down as instructions, and the program applies them.

In machine learning you supply the data **and the answers**, and the computer produces the rules. You show it ten thousand photographs already labeled "cat" or "not cat", and it works out for itself what distinguishes them.

Those produced rules are what people mean by a **model**. It is not a program someone wrote. It is a large collection of numbers, found by a search, that happens to turn inputs into right answers often enough to be useful.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A payroll system calculates tax owed from salary and tax bracket. Should this be machine learning?",
          choices: [
            "Yes, because it processes a lot of data",
            "No, because the rules are known exactly and can be written down",
            "Yes, because tax law is complicated",
            "No, because machine learning only works on images",
          ],
          answer: 1,
          explanation: `Tax law is written down. The rules exist, they are exact, and a wrong answer is a legal problem rather than a tolerable error. Learning them approximately from examples would be slower to build, impossible to audit, and occasionally wrong.

Machine learning earns its place when the rule exists but nobody can state it, not whenever a problem is difficult.`,
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## When it is the wrong tool

Three conditions have to hold before machine learning is worth reaching for.

**There has to be a pattern.** If the thing you are predicting is genuinely random, no amount of data will help. Nothing predicts a fair coin.

**You cannot write the rule down.** If you can, write it down. It will be faster, cheaper and inspectable.

**You have examples with answers attached.** This is the one that stops most projects. A model that recognizes a rare disease needs thousands of scans already labeled by people who knew what they were looking at, and gathering those is usually harder than any of the engineering.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "Which of these is the strongest reason to use machine learning for a problem?",
          choices: [
            "The problem involves a very large amount of data",
            "People can solve it reliably but cannot explain exactly how",
            "The problem is too complicated for one programmer to handle",
            "A competitor is already using machine learning for it",
          ],
          answer: 1,
          explanation:
            "That gap is precisely what machine learning fills. Radiologists spot tumors and cannot write down the rule; readers recognize sarcasm and cannot define it. Data volume alone is not a reason, and plenty of complicated problems are better solved by writing careful code.",
        },
        {
          id: "b8",
          kind: "written",
          prompt:
            "Describe a task you can do easily but could not write instructions for, specific enough that a stranger following them would get it right. Say what examples you would need to teach it to a machine.",
          modelAnswer: `Example: telling whether a message from a friend is annoyed with me.

I do it instantly from word choice, punctuation, length and how it compares to how they normally write. I could not write the rule. "Short reply means annoyed" is wrong most of the time; "no exclamation mark" depends entirely on the person.

To teach it, I would need many messages from that person, each labeled annoyed or not, and the labeling would be the hard part: I would have to know the real answer, which often means asking them.

A strong answer picks something genuinely intuitive rather than merely tedious, and is honest about how difficult the labels are to obtain.`,
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Five words

Almost everything in this course can be said with five words, so they are worth getting exactly right.

A **feature** is one measurable thing about an example. For a house: floor area, number of bedrooms, year built, distance to a station.

A **label** is the answer for that example. For a house: the price it actually sold for.

An **example** is one feature set with its label attached. One house, with its measurements and its sale price.

A **model** is the thing that turns features into a predicted label.

**Training** is the process of adjusting the model until its predictions are close to the real labels.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## What training actually does

Training is less clever than it sounds. It is a loop, and the loop is almost embarrassingly simple.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: TRAINING_LOOP_SVG,
          alt: "One example flows into the Model, which produces a Prediction, which is compared against the real label to measure how wrong it was. A dashed arrow runs back to the model labeled: nudge the model a little. Caption notes the loop runs during training only.",
          caption:
            "Nothing in this loop is doing anything intelligent. It is a very large number of very small corrections, which is a surprisingly good description of modern AI.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `Show the model one example. It makes a prediction, which at the start is nonsense because the model began as random numbers. Measure how far off it was. Adjust the model slightly in the direction that would have made that prediction better. Move to the next example.

Do that for every example, then do the whole set again, perhaps dozens of times. The adjustments are tiny on purpose: a model that lurched to fit each example would simply forget the one before.

That is training. The intelligence, such as it is, comes from the sheer number of corrections, not from any single one of them being insightful.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "You are predicting whether a student will pass a course. Which of these is a label, not a feature?",
          choices: [
            "Hours spent on the platform",
            "Number of exercises completed",
            "Whether they passed",
            "Which course they enrolled in",
          ],
          answer: 2,
          explanation:
            "The label is the thing you are trying to predict, and it is known only for past students. The other three are features: facts you have before the answer is known. If you accidentally include the answer among your features, the model will appear to be perfect and will be useless.",
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## What a trained model is

When training stops, what you are left with is a file full of numbers.

For a small model that might be a few thousand numbers; for a large language model it is hundreds of billions. These numbers are called **parameters**, or sometimes weights, and they are the entire product of training. There is no explanation stored alongside them, no list of the rules it discovered, no record of which examples mattered.

This is why "why did the model do that?" is such a hard question, and why Unit 7 spends a whole lesson on it. The model cannot tell you. The reasons, if that is even the right word, are smeared across all those numbers at once.

Using the trained model is called **inference**: features in, prediction out, no learning, no change.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "What is physically stored when you save a trained model?",
          choices: [
            "The training data it learned from",
            "A list of the rules it discovered, in readable form",
            "A large collection of numbers called parameters",
            "A log of every prediction it has made",
          ],
          answer: 2,
          explanation:
            "Just numbers. The training data is not kept inside the model, and no readable rules are produced. That is both why models are compact relative to their training sets and why they are so hard to interrogate.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Sorted by what you can give it

The categories of machine learning are really categories of what data you have. The method follows from that, not the other way round.

**Supervised learning** is for when you have examples with correct answers attached. Photographs labeled cat or dog, emails labeled spam or not, houses with their sale prices. Most working machine learning is supervised, and the labels are usually the expensive part.

**Unsupervised learning** is for when you have data but no answers. You cannot ask it to predict anything, so instead you ask it to find structure: which customers resemble each other, which transactions look unlike all the others. Nobody tells it what the groups should be, which also means nobody can tell it when the groups are wrong.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `**Reinforcement learning** is for when you cannot label individual decisions but you can tell whether things went well overall. An agent takes actions, receives rewards, and learns a strategy that earns more reward over time. This is how systems learn to play games, and the famous difficulty is **credit assignment**: if you lose a chess game in ninety moves, which move was the mistake?

**Self-supervised learning** is the one that changed everything, and it is a trick rather than a category of its own. It takes unlabeled data and manufactures labels from the data itself. Take any sentence, hide the last word, and ask the model to predict it. The hidden word is the label, and nobody had to write it down.

This is why large language models exist. Supervised learning needs humans to label everything, which caps your dataset at whatever people have time to annotate. Self-supervised learning turns the entire internet into labeled training data at no labeling cost.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A streaming service wants to group its users into segments, without deciding in advance what the segments should be. Which type of learning?",
          choices: [
            "Supervised learning",
            "Unsupervised learning",
            "Reinforcement learning",
            "Self-supervised learning",
          ],
          answer: 1,
          explanation:
            "There are no labels and none are wanted, since the point is to discover groupings rather than sort users into groups someone already named. That is clustering, which is unsupervised. Note that it also means there is no objectively correct answer to check against, so judging whether the groups are any good takes human interpretation.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Why did self-supervised learning make today's large language models possible?",
          choices: [
            "It is more accurate than supervised learning",
            "It removes the need for humans to label data, so training sets can be enormous",
            "It requires far less computing power",
            "It works without any data at all",
          ],
          answer: 1,
          explanation:
            "Labels, not accuracy, were the bottleneck. Hiding part of the text and predicting it generates a label for free from any text in existence, which turns the supply of training data from something people must produce into something that already exists at internet scale.",
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "A hospital has ten years of patient records but almost none are labeled with outcomes. Suggest one useful thing unsupervised learning could do with them, and one thing it cannot.",
          modelAnswer: `Could: find clusters of patients whose records resemble one another, which might surface a group that shares an unnoticed combination of symptoms, or flag records that look unlike anything else as worth a human read.

Cannot: predict whether a given patient will develop a condition. That is a label, and without outcomes recorded there is nothing to learn the association from.

The honest summary is that unsupervised learning can tell you what is in your data and cannot tell you what any of it means. Someone has to look at a cluster and decide whether it is a medically real group or an artifact of how the records were entered.`,
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Three shapes of question

Before choosing an algorithm you have to know what shape of answer you want.

**Classification** picks from a fixed set of categories. Spam or not spam. Which of ten digits. Which of a thousand object types. The output is a choice, usually with a confidence attached.

**Regression** predicts a number on a continuous scale. A house price, a temperature, how many minutes until the bus. The output can be any value in a range.

**Clustering** groups examples by similarity without being told what the groups are. The output is an assignment of every example to a group, and the groups have no names until a person gives them some.

Mixing up the first two is the most common beginner error. "Will this customer leave?" is classification. "How much will this customer spend?" is regression. "How likely is this customer to leave?" is classification with the confidence reported, which is not the same as regression even though the answer is a number.`,
        },
        {
          id: "b2",
          kind: "quiz",
          prompt:
            "A bike rental company wants to predict how many bikes will be rented tomorrow. What shape of problem is this?",
          choices: [
            "Classification, because it chooses a number of bikes",
            "Regression, because the answer is a quantity on a continuous scale",
            "Clustering, because similar days should be grouped",
            "None of these, because it depends on the weather",
          ],
          answer: 1,
          explanation:
            "The answer is a count that could be 40 or 41 or 212, so it lies on a scale rather than being chosen from a fixed set of categories. Weather would be one of the features used to make the prediction, not a reason the problem has no shape.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Decision trees, and why they matter more than they look

A **decision tree** is a flowchart the machine builds for itself. Each node asks a yes-or-no question about one feature, and the answer sends you down one branch. You arrive eventually at a leaf, which holds the prediction.

What makes trees worth understanding is that you can read one. "Rejected because income was below the threshold and the account was under six months old" is a sentence a tree can produce and a neural network cannot. When a decision has to be explained to the person it affects, that matters enormously, and Unit 7 returns to it.

The weakness of a single tree is that it is brittle. Change a few training examples and you can get a noticeably different tree.

The fix is to build many trees, each on a random subset of the data and the features, and let them vote. That is a **random forest**, and it is an example of a general and slightly counterintuitive idea: a crowd of mediocre models, each wrong in different ways, is usually more reliable than one carefully tuned model. The errors tend to cancel while the signal tends to agree.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Why does a random forest usually outperform a single decision tree?",
          choices: [
            "Each tree in the forest is individually more accurate",
            "The trees make different mistakes, so their errors largely cancel when they vote",
            "Forests use more training data than single trees",
            "Forests are faster to train",
          ],
          answer: 1,
          explanation:
            "The individual trees are typically worse, not better, because each sees only part of the data and part of the features. The gain comes from their independence: errors that point in different directions cancel out under a vote, while the genuine signal that most trees agree on survives. Forests are also slower to train, not faster.",
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## The others you will hear named

**K-means** is the standard clustering method. You tell it how many groups to find, it places that many center points and shuffles them until each sits in the middle of its own cluster. Note that you have to pick the number of groups in advance, which is awkward when the whole reason you are clustering is that you do not know how many there are.

**Support vector machines** find the boundary that separates two classes with the widest possible margin on either side. They were the method to beat before deep learning arrived and remain strong on small datasets.

**Linear regression** fits a straight line through the data. It is the simplest thing in this list, and worth taking seriously for that reason: if a straight line explains your data, use the straight line. You will be able to say exactly what it does and why.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "A loan applicant is rejected by an automated system and asks why. Which algorithm makes that question easiest to answer honestly?",
          choices: [
            "A deep neural network",
            "A decision tree",
            "K-means clustering",
            "A support vector machine",
          ],
          answer: 1,
          explanation:
            "A tree records an actual path of yes-or-no questions, so the reason for a decision is a readable sequence of conditions. The others give you a number with no account of how it arose. This is a real reason regulated industries still use simpler models even when a neural network would score better.",
        },
      ],
    },

    {
      id: "aif-u2-l5",
      slug: "training-and-evaluating",
      title: "Training and Evaluating Models",
      kind: "lesson",
      summary:
        "Why you hold data back, what accuracy hides, and the two ways a model can fail to generalize.",
      estimatedMinutes: 25,
      objectives: [
        "Explain why training and test data must be kept separate",
        "Interpret accuracy, precision and recall, and say when accuracy misleads",
        "Identify overfitting and underfitting from described symptoms",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The exam you have already seen

Imagine revising for an exam using last year's paper, and then sitting last year's paper. You would score brilliantly and learn nothing about whether you understand the subject.

A model tested on its own training data is in exactly that position. It has seen every answer. A sufficiently large model can simply memorize the lot and score perfectly while having learned nothing that transfers.

So the data is split before training starts. The **training set**, usually most of it, is what the model learns from. The **test set** is locked away and used once, at the end, to find out how the model does on examples it has never seen. Often a third slice, the **validation set**, is used along the way to make decisions about the model without touching the test set.

The rule is simple and constantly broken: the test set must not influence training in any way. If you check the test score, adjust the model, and check again, you have begun fitting to the test set, and your final number is no longer honest.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Two ways to fail

A model that performs badly is failing in one of two opposite directions, and the fixes point in opposite directions too.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: FITTING_SVG,
          alt: "Three scatter plots of the same six points. The first has a straight line that misses the curve, labeled Underfit, too simple to follow it. The second has a smooth curve through the trend, labeled Good fit. The third has a jagged line passing exactly through every point, labeled Overfit, memorized the dots.",
          caption:
            "The third model is perfect on this data and will be worse than the first on anything new. Perfect training accuracy is a warning sign, not an achievement.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `**Underfitting** is a model too simple to capture the pattern. It does badly on the training data and equally badly on the test data. The fix is a more capable model, better features, or longer training.

**Overfitting** is a model that has learned the training data too exactly, including its noise and accidents. It does superbly on training data and poorly on anything new. The fix is more data, a simpler model, or stopping training earlier.

The symptom that distinguishes them is the gap. Bad on both means underfitting. Excellent on training and bad on test means overfitting, and the wider that gap, the worse the problem.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A model scores 99% on its training data and 61% on its test data. What is happening, and what would help?",
          choices: [
            "Underfitting; train it for longer",
            "Overfitting; get more data or simplify the model",
            "The test set is too small; ignore it",
            "The model is working correctly; 61% is the real score and nothing is wrong",
          ],
          answer: 1,
          explanation:
            "The 38-point gap is the signature of overfitting: it has memorized rather than generalized. More training would make it worse, since it would memorize harder. Note that 61% might still be the honest estimate of real-world performance, but the gap says the model is capable of better if trained differently.",
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## Why accuracy lies

**Accuracy** is the fraction of predictions that were right. It is the obvious measure and it is dangerously misleading whenever one answer is much rarer than the other.

Suppose one transaction in a thousand is fraudulent. A model that labels everything "not fraud" is 99.9% accurate and catches no fraud whatsoever. The accuracy figure is both true and worthless.

Two sharper measures split the question in half:

**Precision** asks: of the cases the model flagged, how many were real? Low precision means lots of false alarms.

**Recall** asks: of the real cases, how many did the model catch? Low recall means it is missing them.

These trade off against each other. Flag everything and recall is perfect while precision collapses. Flag almost nothing and precision is excellent while recall collapses. Which you favor is a decision about consequences, not about mathematics. A cancer screening test should lean toward recall, because a missed case is far worse than a scare. A spam filter should lean toward precision, because a lost job offer is far worse than a spam message in the inbox.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "A screening tool for a serious illness flags 40 patients. 30 actually have it, and 10 do not. There were 50 cases in total among those screened. What is the problem?",
          choices: [
            "Precision is poor, so too many healthy patients are alarmed",
            "Recall is poor, so 20 real cases were missed",
            "Both are perfect",
            "There is not enough information to tell",
          ],
          answer: 1,
          explanation: `Precision is 30 out of 40 flagged, which is 75% and acceptable for a screening test where a follow-up will catch the false alarms.

Recall is 30 out of 50 real cases, which is 60%, so twenty people with the illness were told they were fine. For a serious condition that is the failure that matters, and it is exactly the failure a headline accuracy number would have hidden.`,
        },
        {
          id: "b8",
          kind: "written",
          prompt:
            "You are building a model to flag student work for possible plagiarism, which a teacher then reviews. Would you favor precision or recall? Explain the consequence of getting it wrong in each direction.",
          modelAnswer: `A reasonable answer argues for precision, with the reasoning stated.

Low precision means many honest students are flagged. Even with a teacher reviewing, being accused is distressing, it consumes the teacher's time, and if the flag is visible to anyone else it damages a reputation that cannot be fully repaired by being cleared.

Low recall means some plagiarism is missed, which is a real cost but a recoverable one, and other checks exist.

The stronger version of this answer notices that "a teacher reviews it" changes the calculation but does not remove it: review only helps if the teacher genuinely has time to review every flag and feels able to overrule the system. A tool that flags 200 essays a week will not be reviewed carefully, and at that point precision is the only thing protecting students.`,
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Four problems below. For each one, decide:

1. Is this even a machine learning problem, or should someone just write the rules?
2. If it is, which type: supervised, unsupervised, reinforcement or self-supervised?
3. What exactly would one training example look like, features and label?
4. Where would the labels come from, and who would have to produce them?

Question four is the one that decides whether a project is real. Almost anything sounds feasible until you work out who is labeling forty thousand examples.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**Problem 1.** A school wants to identify students at risk of dropping out, early enough to offer support.",
          modelAnswer: `Supervised classification. One example is one student: features might be attendance, assignment submission rates, grade trends and engagement with the platform. The label is whether that student eventually left.

Labels come free from historical records, which is unusually convenient, but they arrive with a delay: you only learn the label years after the features were recorded, so the model is always trained on a cohort that may no longer resemble current students.

A strong answer also raises what the prediction is for. If being flagged leads to support, good. If it leads to being written off, the model has made things worse, and that is a decision about deployment rather than about the model.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Problem 2.** A library wants to automatically sort incoming donated books into its existing categories.",
          modelAnswer: `Supervised classification. One example is one book: features from the title, description, publisher and perhaps a scan of the back cover. The label is the category.

The labels already exist, which is the key insight here. Every book already in the library is a labeled example, so the training set is the catalog itself and nobody has to annotate anything.

A strong answer notices the catch: the model can only ever assign categories the library already uses, and it will inherit any inconsistency in how past librarians categorized things.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Problem 3.** A city wants to set traffic light timings to reduce congestion.",
          modelAnswer: `Reinforcement learning, and this is the clearest example of why that category exists. There is no label for "the correct timing for this junction at 4pm". There is only a measurable outcome: total waiting time across the network.

An example is not a single labeled case but an episode: the system sets timings, traffic flows, and a reward is computed from how well it went.

A strong answer raises the problem with learning this on a live city. A reinforcement learner improves by trying things, and trying a bad traffic configuration means real people stuck in real traffic. The usual answer is to train in simulation first and accept that the simulation is not the city.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "**Problem 4.** A company wants to automatically reject job applicants who are 'not a good fit'.",
          modelAnswer: `The expected answer is supervised classification, with past hiring decisions as labels. The better answer is that this should probably not be built.

Technically: features from the application, label being whether that person was hired, or whether they were rated well afterwards.

The problem is what the labels encode. Past hiring decisions carry every bias the people making them had. A model trained on them does not learn who is good at the job; it learns to reproduce who got hired, including any pattern of who did not. Because the decision is automated and happens before a human sees the application, there is no point at which anyone notices.

"Good fit" is also not defined anywhere, which means the model will optimize for resemblance to past hires. That is the failure, stated plainly: it is a machine for making an organization more like it already is.

A strong answer reaches that conclusion and says what would be needed to do it responsibly, or that nothing would be enough.`,
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## Before you move on

The fourth problem is the one Unit 7 is built around, and it is worth noticing now that nothing about it is a technical failure. The model would work. It would do exactly what it was trained to do. Every difficulty is in what it was trained on and where its output is allowed to go.`,
        },
      ],
    },

    {
      id: "aif-u2-q1",
      slug: "unit-quiz",
      title: "Unit 2 Quiz",
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
            "In machine learning, what takes the place that rules occupy in ordinary programming?",
          choices: [
            "The training data",
            "The model, which is produced rather than written",
            "The features",
            "The programming language",
          ],
          answer: 1,
          explanation:
            "Ordinary programming takes rules and data and produces answers. Machine learning takes data and answers and produces the rules, and those produced rules are the model.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "You have a million photographs and no labels at all. Which is possible?",
          choices: [
            "Supervised classification into cats and dogs",
            "Clustering the photographs into groups that resemble one another",
            "Regression to predict each photograph's price",
            "Nothing, without labels",
          ],
          answer: 1,
          explanation:
            "Clustering needs no labels, which is the point of unsupervised learning. The first and third both require answers you do not have. The fourth overstates it: there is plenty you can do, you just cannot predict a quantity nobody has recorded.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What is a parameter?",
          choices: [
            "A setting a person chooses before training begins",
            "One of the numbers inside a model that training adjusts",
            "A feature of a training example",
            "A measure of how accurate the model is",
          ],
          answer: 1,
          explanation:
            "Parameters are what training changes and what gets saved when you save a model. The first option describes a hyperparameter, which is a related term you will meet if you go further, and is chosen rather than learned.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A model is 97% accurate at detecting a disease that affects 3% of people. What should you check first?",
          choices: [
            "Whether 97% is good enough for medical use",
            "Whether it achieves that by predicting 'no disease' almost every time",
            "Whether the model was trained for long enough",
            "Whether the training set was large enough",
          ],
          answer: 1,
          explanation:
            "Predicting 'no disease' for everyone would score 97% on its own. Until you see recall, the accuracy figure tells you nothing about whether the model detects the disease at all.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "Why must the test set be kept separate from training?",
          choices: [
            "To make training run faster",
            "To measure how the model does on examples it has never seen",
            "Because test data is usually of higher quality",
            "To reduce the size of the model",
          ],
          answer: 1,
          explanation:
            "It is the only honest estimate of real-world performance. A score on data the model trained on measures memorization, which a large model can do perfectly while learning nothing transferable.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "A model does poorly on its training data and equally poorly on test data. This is:",
          choices: [
            "Overfitting; simplify the model",
            "Underfitting; the model is too simple or needs better features",
            "Correct behavior; all models score like this",
            "A sign the test set is wrong",
          ],
          answer: 1,
          explanation:
            "Bad on both, with no gap between them, means the model never captured the pattern in the first place. Overfitting shows the opposite signature: excellent on training, poor on test.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "What makes self-supervised learning different from supervised learning?",
          choices: [
            "It needs no data",
            "It generates its own labels from the structure of the data",
            "It is a kind of reinforcement learning",
            "It only works on images",
          ],
          answer: 1,
          explanation:
            "Hiding part of the input and predicting it creates a label from data that had none. That removes human labeling as the limit on dataset size, which is the reason models can now be trained on text at internet scale.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt: "Which problem is regression rather than classification?",
          choices: [
            "Deciding whether an email is spam",
            "Predicting how many minutes late a train will be",
            "Identifying which of twenty animals is in a photo",
            "Deciding whether a transaction is fraudulent",
          ],
          answer: 1,
          explanation:
            "Minutes late is a quantity on a continuous scale, so it is regression. The other three all pick from a fixed set of categories, which is classification, even when that set has only two members.",
        },
      ],
    },
  ],
};
