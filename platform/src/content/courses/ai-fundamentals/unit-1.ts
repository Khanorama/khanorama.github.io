import type { Unit } from "@/content/types";

/**
 * Unit 1: Introduction to Artificial Intelligence.
 *
 * Written first, deliberately, as the pilot for the whole conceptual format.
 * Everything the other six units need is exercised here at least once: prose
 * carrying a real explanation, figures doing work that prose cannot, quizzes
 * that ask for a commitment before the answer appears, a connection that
 * sends the student somewhere real, and a unit quiz that is worth passing.
 *
 * ON THE FIGURES. Each is authored as inline SVG using the site's own color
 * tokens, so one definition is correct in both themes. They are drawn at a
 * fixed viewBox and scaled to the column, so text sizes in them are chosen
 * to stay readable at roughly 640px wide, which is the reading column on a
 * laptop. Anything smaller than 11px in the viewBox disappears.
 *
 * ON THE DATES in lesson 1.2. The sequence is deliberately specific because
 * "AI has been around for a while" teaches nothing. Where a year is given it
 * is the year of the event named, not of a wider trend.
 */

/* ------------------------------------------------------------- figures */

/** What any intelligent system does, as a loop rather than a list. */
const CYCLE_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u1-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g>
    <rect x="18" y="62" width="150" height="74" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="93" y="92" text-anchor="middle" font-size="15" font-weight="600"
          fill="var(--color-ink)">Perceive</text>
    <text x="93" y="113" text-anchor="middle" font-size="12"
          fill="var(--color-ink-muted)">take the world in</text>
  </g>

  <g>
    <rect x="245" y="62" width="150" height="74" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="320" y="92" text-anchor="middle" font-size="15" font-weight="600"
          fill="var(--color-ink)">Reason</text>
    <text x="320" y="113" text-anchor="middle" font-size="12"
          fill="var(--color-ink-muted)">work something out</text>
  </g>

  <g>
    <rect x="472" y="62" width="150" height="74" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="547" y="92" text-anchor="middle" font-size="15" font-weight="600"
          fill="var(--color-ink)">Act</text>
    <text x="547" y="113" text-anchor="middle" font-size="12"
          fill="var(--color-ink-muted)">decide, then do it</text>
  </g>

  <path d="M168 99 L239 99" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u1-arrow)" fill="none" />
  <path d="M395 99 L466 99" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u1-arrow)" fill="none" />

  <path d="M547 140 L547 190 Q547 206 531 206 L109 206 Q93 206 93 190 L93 142"
        stroke="var(--color-success)" stroke-width="2" stroke-dasharray="6 4"
        fill="none" marker-end="url(#u1-arrow)" />
  <rect x="252" y="190" width="136" height="32" rx="8"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" />
  <text x="320" y="211" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-success)">Learn</text>

  <text x="320" y="34" text-anchor="middle" font-size="13"
        fill="var(--color-ink-faint)">Did it work? Change how you reason next time.</text>
</svg>`;

/** The eighty-year sequence, with the quiet stretches marked. */
const TIMELINE_SVG = `
<svg viewBox="0 0 640 290" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <rect x="112" y="150" width="104" height="18" rx="4"
        fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
  <rect x="300" y="150" width="68" height="18" rx="4"
        fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
  <text x="164" y="186" text-anchor="middle" font-size="11"
        fill="var(--color-warning)">first winter</text>
  <text x="334" y="186" text-anchor="middle" font-size="11"
        fill="var(--color-warning)">second winter</text>

  <line x1="30" y1="159" x2="614" y2="159"
        stroke="var(--color-line-strong)" stroke-width="2" />

  <g font-size="12" fill="var(--color-ink-muted)">
    <circle cx="48" cy="159" r="5" fill="var(--color-accent)" />
    <line x1="48" y1="154" x2="48" y2="120" stroke="var(--color-line-strong)" />
    <text x="48" y="112" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">1956</text>
    <text x="48" y="94" text-anchor="middle">Dartmouth</text>

    <circle cx="248" cy="159" r="5" fill="var(--color-accent)" />
    <line x1="248" y1="154" x2="248" y2="120" stroke="var(--color-line-strong)" />
    <text x="248" y="112" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">1980s</text>
    <text x="248" y="94" text-anchor="middle">expert systems</text>

    <circle cx="404" cy="159" r="5" fill="var(--color-accent)" />
    <line x1="404" y1="154" x2="404" y2="120" stroke="var(--color-line-strong)" />
    <text x="404" y="112" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">1997</text>
    <text x="404" y="94" text-anchor="middle">Deep Blue</text>

    <circle cx="505" cy="159" r="5" fill="var(--color-success)" />
    <line x1="505" y1="164" x2="505" y2="210" stroke="var(--color-line-strong)" />
    <text x="505" y="228" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">2012</text>
    <text x="505" y="246" text-anchor="middle">AlexNet</text>

    <circle cx="560" cy="159" r="5" fill="var(--color-success)" />
    <line x1="560" y1="154" x2="560" y2="120" stroke="var(--color-line-strong)" />
    <text x="560" y="112" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">2017</text>
    <text x="560" y="94" text-anchor="middle">transformers</text>

    <circle cx="606" cy="159" r="5" fill="var(--color-success)" />
    <line x1="606" y1="164" x2="606" y2="210" stroke="var(--color-line-strong)" />
    <text x="606" y="228" text-anchor="middle" font-size="13" font-weight="600"
          fill="var(--color-ink)">2022</text>
    <text x="606" y="246" text-anchor="middle">ChatGPT</text>
  </g>

  <text x="320" y="30" text-anchor="middle" font-size="13"
        fill="var(--color-ink-faint)">Nearly seventy years, and most of the progress is in the last fifteen.</text>
</svg>`;

/** Narrow, general and super, with an honest marker for where we are. */
const TYPES_SVG = `
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g>
    <rect x="20" y="40" width="300" height="60" rx="10"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="40" y="66" font-size="15" font-weight="600"
          fill="var(--color-ink)">Narrow AI (ANI)</text>
    <text x="40" y="86" font-size="12"
          fill="var(--color-ink-muted)">One task, done well. All of it, so far.</text>
    <rect x="334" y="56" width="132" height="28" rx="14"
          fill="var(--color-success-soft)" stroke="var(--color-success-line)" />
    <text x="400" y="75" text-anchor="middle" font-size="12" font-weight="600"
          fill="var(--color-success)">everything today</text>
  </g>

  <g>
    <rect x="20" y="118" width="440" height="60" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)"
          stroke-dasharray="6 4" />
    <text x="40" y="144" font-size="15" font-weight="600"
          fill="var(--color-ink)">General AI (AGI)</text>
    <text x="40" y="164" font-size="12"
          fill="var(--color-ink-muted)">Any task a person can learn. Does not exist.</text>
  </g>

  <g>
    <rect x="20" y="196" width="580" height="54" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)"
          stroke-dasharray="6 4" />
    <text x="40" y="220" font-size="15" font-weight="600"
          fill="var(--color-ink)">Superintelligence (ASI)</text>
    <text x="40" y="239" font-size="12"
          fill="var(--color-ink-muted)">Beyond us at everything. Hypothetical.</text>
  </g>

  <text x="20" y="24" font-size="13"
        fill="var(--color-ink-faint)">Width is scope, not progress. The lower two are ideas, not products.</text>
</svg>`;

/** Input, processing, output, and the two ways the middle gets filled. */
const PIPELINE_SVG = `
<svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u1-arrow2" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <rect x="14" y="96" width="140" height="68" rx="10"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="84" y="124" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Input</text>
  <text x="84" y="144" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">pixels, text, sound</text>

  <rect x="238" y="80" width="164" height="100" rx="10"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="320" y="110" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Processing</text>
  <text x="320" y="132" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">rules a person wrote,</text>
  <text x="320" y="148" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">or patterns it worked</text>
  <text x="320" y="164" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">out from examples</text>

  <rect x="486" y="96" width="140" height="68" rx="10"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="556" y="124" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Output</text>
  <text x="556" y="144" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">a label, a number,</text>
  <text x="556" y="158" text-anchor="middle" font-size="11"
        fill="var(--color-ink-muted)">a sentence</text>

  <path d="M154 130 L232 130" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u1-arrow2)" fill="none" />
  <path d="M402 130 L480 130" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u1-arrow2)" fill="none" />

  <text x="320" y="40" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-ink)">Every AI system, at its coarsest</text>
  <text x="320" y="60" text-anchor="middle" font-size="12"
        fill="var(--color-ink-faint)">What changes between systems is almost entirely the middle box.</text>

  <path d="M556 164 L556 220 Q556 234 542 234 L98 234 Q84 234 84 220 L84 170"
        stroke="var(--color-success)" stroke-width="2" stroke-dasharray="6 4"
        fill="none" marker-end="url(#u1-arrow2)" />
  <rect x="246" y="218" width="148" height="30" rx="8"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" />
  <text x="320" y="238" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-success)">only while training</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

export const unit1: Unit = {
  id: "aif-u1",
  slug: "introduction-to-ai",
  title: "Introduction to Artificial Intelligence",
  summary:
    "What artificial intelligence actually is, where it came from, and how much of it you already use without noticing.",
  lessons: [
    {
      id: "aif-u1-l1",
      slug: "what-is-artificial-intelligence",
      title: "What Is Artificial Intelligence?",
      kind: "lesson",
      summary:
        "A working definition, the four things every intelligent system does, and why the definition keeps moving.",
      estimatedMinutes: 20,
      objectives: [
        "Give a working definition of artificial intelligence",
        "Name the four capabilities that make a system intelligent",
        "Explain why things stop being called AI once they work",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Starting with a problem

Artificial intelligence is unusually hard to define, and not because the idea is vague. It is hard because the definition has been moving for seventy years.

Here is a working one, and the one this course will use:

> **Artificial intelligence** is the field of building machines that do things which, when a person does them, we would call intelligent.

That definition is doing something slightly uncomfortable. It does not describe the machine at all. It describes our reaction to what the machine does. Hold onto that discomfort, because it explains almost everything strange about how people talk about AI.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Four things an intelligent system does

Whatever the task, systems we call intelligent tend to do some combination of four things. A spam filter does all four. So does a self-driving car, at a wildly different scale.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: CYCLE_SVG,
          alt: "A cycle: Perceive, meaning take the world in, flows to Reason, meaning work something out, which flows to Act, meaning decide then do it. A dashed Learn arrow runs back from Act to Perceive, labeled: did it work, change how you reason next time.",
          caption:
            "The loop matters more than the boxes. A system that perceives, reasons and acts but never closes the loop back round is automation. The return arrow is what makes it learn.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `**Perception** is taking in the world as data. Pixels from a camera, words you typed, a temperature reading, the click you just made.

**Reasoning** is working something out from what came in. Not necessarily logic in the formal sense. More often it means finding a pattern: this email looks like other emails that turned out to be spam.

**Action** is doing something about it. Moving the email, braking the car, suggesting the next word.

**Learning** is the part that separates AI from ordinary software. The system changes its own behavior based on how things went, without a person rewriting it.

A thermostat perceives and acts, but it never reasons or learns, which is exactly why nobody calls a thermostat intelligent.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A supermarket self-checkout weighs your item and refuses to continue if the weight does not match what you scanned. Is this AI?",
          choices: [
            "Yes, because it is making a decision about what you did",
            "No, because it is following a rule somebody wrote, and it never changes that rule",
            "Yes, because it uses a sensor to perceive the world",
            "No, because AI has to involve a neural network",
          ],
          answer: 1,
          explanation: `It perceives (the scale) and it acts (blocking you). But the rule is fixed: a person wrote "if weight does not match expected weight, stop", and the machine will apply that rule identically forever. Nothing is learned and nothing changes.

The last option is a common misconception worth killing early. Plenty of real AI uses no neural network at all, and this course covers several such methods in Unit 2.`,
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## Why AI keeps disappearing

Optical character recognition, the thing that reads text out of a photograph, was a flagship AI problem in the 1970s. Today it is a feature in your phone's camera app and nobody describes it as artificial intelligence.

This happens so reliably it has a name. The **AI effect**: as soon as a problem is solved, it stops counting as AI and gets reclassified as ordinary computing. The computer scientist Larry Tesler put it sharply, defining intelligence as whatever machines have not done yet.

So the goalposts move, permanently and in one direction. It is worth knowing this now, because it means two things for the rest of this course. Anything you already take for granted was probably once a research problem. And any list of "what AI can do" is out of date by the time it is printed.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "What does the AI effect describe?",
          choices: [
            "The tendency of AI systems to improve the longer they run",
            "The way AI changes the job market",
            "The way a solved problem stops being thought of as AI",
            "The gap between what AI can do and what people think it can do",
          ],
          answer: 2,
          explanation:
            "It is about the label, not the technology. Chess, handwriting recognition and spam filtering were all unmistakably AI until they worked reliably, at which point they quietly became ordinary software in most people's minds.",
        },
        {
          id: "b8",
          kind: "written",
          prompt:
            "In your own words, explain the difference between a program that is automated and a program that is intelligent. Use an example of each.",
          modelAnswer: `An automated program follows instructions a person wrote, and does the same thing every time given the same input. A washing machine cycle is automated: the sequence was decided in advance and never varies.

An intelligent program changes its own behavior based on what it has seen. A spam filter is intelligent in this sense, because it is not working from a fixed list of banned words. It has been shown many emails labeled spam or not spam, worked out for itself which features tend to go with which label, and keeps adjusting as new spam arrives.

The dividing line is whether a person had to rewrite the program for its behavior to change.`,
        },
      ],
    },

    {
      id: "aif-u1-l2",
      slug: "history-and-evolution",
      title: "History and Evolution of AI",
      kind: "lesson",
      summary:
        "From a 1956 summer workshop through two collapses in funding to the decade when it suddenly worked.",
      estimatedMinutes: 20,
      objectives: [
        "Place the major eras of AI research in order",
        "Explain what an AI winter was and what caused one",
        "Say what changed around 2012 to make modern AI possible",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## A summer workshop that overran

In 1956 a group of researchers gathered at Dartmouth College for a workshop on what John McCarthy had, in the funding proposal, named *artificial intelligence*. The proposal suggested that a significant advance could be made if a carefully selected group worked on it together over a summer.

They were wrong about the timescale by roughly seventy years and counting. But the name stuck, and the field dates itself from that workshop.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: TIMELINE_SVG,
          alt: "A timeline from 1956 to 2022. Marked above the line: 1956 Dartmouth, 1980s expert systems, 1997 Deep Blue, 2017 transformers. Marked below: 2012 AlexNet, 2022 ChatGPT. Two shaded bands mark the first and second AI winters.",
          caption:
            "The two shaded stretches are the AI winters. Notice how much of the timeline is empty, and how compressed the recent end is.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Two winters

Early AI research promised a great deal and delivered demonstrations that worked beautifully on small problems and fell apart on real ones. When the promised results did not arrive, funding was withdrawn, sharply and more than once. These stretches are known as **AI winters**.

The first ran through the mid-1970s. The second arrived in the late 1980s, after the commercial collapse of **expert systems**: programs that captured a specialist's knowledge as a large set of hand-written if-then rules. Expert systems genuinely worked, and some saved their owners real money. The problem was that every rule had to be elicited from a human expert and written down by hand, and the systems became impossible to maintain as they grew. They also could not learn anything on their own.

That failure is the single most useful thing to take from this history, because it points directly at what came next.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What was the fundamental limitation of expert systems?",
          choices: [
            "They were too slow to be useful in practice",
            "Every rule had to be written by a person, so they could not scale or learn",
            "They required more memory than 1980s computers had",
            "They could only be used for medical diagnosis",
          ],
          answer: 1,
          explanation: `Speed and memory were real engineering constraints, but they were not the thing that killed the approach. The fatal problem was human: knowledge had to be extracted from experts and encoded by hand, one rule at a time, and a system with thousands of interacting rules became impossible to debug or extend.

Machine learning is, in a real sense, the answer to this specific failure. Rather than writing the rules, you show the system examples and let it find the rules itself.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## What changed

Modern AI did not arrive because someone had a brilliant new idea. Most of the core ideas, including neural networks and the algorithm used to train them, were decades old by the time they started working.

Three things changed at roughly the same time:

**Data.** The internet produced labeled datasets at a scale nobody had before. ImageNet, released in 2009, contained millions of hand-labeled photographs.

**Computing power.** Graphics cards, built to render video games, turned out to be very good at exactly the kind of arithmetic neural networks need, and they could do enormous amounts of it in parallel.

**Scale.** With the first two in place, it became possible to train networks far larger than before, and it turned out that bigger networks trained on more data kept getting better.

In 2012 a neural network called AlexNet won the ImageNet image recognition competition by a margin so wide that the field reorganised around the approach within about two years.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Why is 2012 treated as a turning point, given that neural networks had existed for decades?",
          choices: [
            "Neural networks were invented in 2012",
            "It was the first year a computer beat a human at a game",
            "A neural network won a major image competition by a wide margin, showing the old ideas worked once given enough data and compute",
            "It was the year the internet became fast enough to run AI",
          ],
          answer: 2,
          explanation:
            "The ideas behind AlexNet were not new. What was new was the combination of a large labeled dataset and graphics hardware fast enough to train on it. The result was convincing enough that the whole field changed direction, which is why the date gets singled out.",
        },
      ],
    },

    {
      id: "aif-u1-l3",
      slug: "types-of-ai",
      title: "Types of Artificial Intelligence",
      kind: "lesson",
      summary:
        "Narrow, general and super: three categories, only one of which has ever been built.",
      estimatedMinutes: 20,
      objectives: [
        "Distinguish narrow AI, general AI and superintelligence",
        "Classify a given system into the right category",
        "Explain why a very capable system can still be narrow",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Three categories

AI is usually sorted into three levels by how broad its capability is. The distinction is worth getting right, because almost every confused public argument about AI comes from mixing up the first two.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: TYPES_SVG,
          alt: "Three stacked bars of increasing width. The narrowest is Narrow AI, one task done well, marked as everything today. Then General AI, any task a person can learn, drawn with a dashed border and marked as not existing. Then Superintelligence, beyond us at everything, also dashed and marked hypothetical.",
          caption:
            "The dashed borders are the point. Two of these three categories are ideas being argued about, not systems anyone has built.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `**Narrow AI**, sometimes called weak AI or ANI, is built for one task or a bounded set of tasks. This is every AI system that has ever existed, without exception. A chess engine that could beat any human alive cannot tell you whether it is raining.

**General AI**, or AGI, would handle any intellectual task a person can, including tasks it was never built for, and transfer what it learned in one domain to another. It does not exist. Whether it is close, far away, or achievable at all is one of the genuinely open arguments in the field.

**Superintelligence**, or ASI, would exceed human ability across essentially everything. It is a hypothetical beyond a hypothetical.

The trap is assuming capability implies generality. A large language model that writes passable essays, explains code and drafts an email feels general. It is still narrow: it was trained to predict text, and everything it does is that one capability pointed at different problems. Unit 7 of AI Specializations returns to this argument properly.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "A model beats world champions at Go, a game far more complex than chess. What category is it in?",
          choices: [
            "General AI, because the complexity of Go requires genuine reasoning",
            "Narrow AI, because it plays Go and does nothing else",
            "Superintelligence, because it exceeds all human ability at the task",
            "It depends on whether it uses a neural network",
          ],
          answer: 1,
          explanation: `Narrow, and this is the cleanest illustration of why the categories are about breadth rather than strength. AlphaGo exceeded every human who has ever played Go, which sounds like superintelligence until you notice it cannot play chess, read a sentence or tie a shoelace.

Being better than all humans at one thing is narrow. Being as good as a human at most things would be general.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "Someone tells you a chatbot is 'basically AGI' because it can answer questions on any topic. Explain why breadth of topic is not the same as general intelligence.",
          modelAnswer: `Answering questions across many topics is one capability, text prediction, applied to varied subject matter. The range of topics comes from the range of its training data, not from the system having many different abilities.

General intelligence would mean being able to take on a genuinely new kind of task, one the system was never trained for, and learn to do it, including transferring something learned in one area to a completely different one. A chatbot asked to physically repair a bicycle, or to learn a game nobody has written about, has no route to doing so.

Breadth of subject matter is not breadth of capability.`,
        },
      ],
    },

    {
      id: "aif-u1-l4",
      slug: "how-ai-systems-work",
      title: "How AI Systems Work",
      kind: "lesson",
      summary:
        "Input, processing, output: the shape every AI system shares, and the one box inside it that actually differs.",
      estimatedMinutes: 20,
      objectives: [
        "Describe the input, processing and output stages of an AI system",
        "Explain the difference between hand-written rules and learned patterns",
        "Identify what stays fixed once a model is deployed",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## One shape, over and over

Strip away the specifics and every AI system has the same coarse structure. Something goes in, something happens, something comes out.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: PIPELINE_SVG,
          alt: "Input, containing pixels, text and sound, flows into a highlighted Processing box containing rules a person wrote or patterns it worked out from examples, which flows into Output, containing a label, a number or a sentence. A dashed arrow loops from Output back to Input, labeled: only while training.",
          caption:
            "The dashed return arrow is live during training and switched off afterwards. A deployed model does not learn from you while you use it.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `**Input** has to be numbers, always. A photograph becomes a grid of brightness values, a sentence becomes a sequence of numbers standing for pieces of words, audio becomes a sequence of amplitudes. Units 3, 5 and 6 each deal with how a different kind of input is turned into numbers.

**Processing** is where systems genuinely differ, and there are really only two options. Either a person wrote the rules, or the system worked out the patterns itself from examples. Those are the expert systems and the machine learning of the last lesson.

**Output** is a label ("spam"), a number (a predicted price), a choice from a set (which move to play) or a sequence (the next words in a sentence).`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "You use a photo app's 'find all pictures of my dog' feature. What is the input, and what is the output?",
          choices: [
            "Input is the word 'dog'; output is a search of the filenames",
            "Input is each photo as a grid of numbers; output is a score for whether that photo contains a dog",
            "Input is your dog; output is a photograph",
            "Input is the app; output is the photo library",
          ],
          answer: 1,
          explanation:
            "Each photo is converted to numbers and run through the model, which returns something like a confidence score per photo. The app then shows you the ones that scored highly. Nothing about this depends on filenames, which is why it works on photos named IMG_4471.",
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## A thing that surprises people

Once a model is trained and shipped, it is frozen. The learning loop in the figure is switched off.

When you correct a chatbot and it apologizes and gets it right, nothing permanent has happened. It adjusted within that single conversation, using your correction as additional input. Start a new conversation and the correction is gone. The model's actual parameters, the millions or billions of numbers that encode what it knows, have not moved.

Systems do get updated, but by being retrained and redeployed as a new version, which is a deliberate act by the people who own them rather than something happening live as you type.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "You tell a chatbot it made a factual error. It agrees and corrects itself. What has actually changed?",
          choices: [
            "The model has learned the correction and will not repeat the error",
            "Nothing permanent; the correction only affects the current conversation",
            "The model has been retrained on your correction",
            "The error has been reported to the developers automatically",
          ],
          answer: 1,
          explanation:
            "Your correction became part of the context for that conversation, so later replies in the same conversation take it into account. The model itself is unchanged, and an identical question in a fresh conversation can produce the identical error. This matters a great deal in Unit 9 of AI Specializations, where it explains some of why hallucinations are hard to stamp out.",
        },
      ],
    },

    {
      id: "aif-u1-l5",
      slug: "ai-in-everyday-life",
      title: "AI in Everyday Life",
      kind: "lesson",
      summary:
        "How much of an ordinary day already runs through a model, including the parts nobody advertises.",
      estimatedMinutes: 20,
      objectives: [
        "Identify AI systems in common applications",
        "Explain what a recommendation system is optimizing for",
        "Recognize where AI is being used without being announced",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Before breakfast

Your phone unlocked by comparing your face to a stored mathematical description of it. Your keyboard predicted the next word as you typed. Your email put three messages in spam. Your maps app chose a route using live traffic predictions. Your music app queued something it thought you would like.

That is five AI systems before you have properly woken up, and not one of them is labeled as artificial intelligence anywhere in its interface.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Recommendation, and what it is actually for

The feeds are worth singling out, because a recommendation system is where most people's largest daily exposure to AI sits.

A recommender predicts how likely you are to engage with each candidate item, then sorts by that prediction. What counts as engagement is a choice made by the company: a click, a watch, time spent, a share.

This is the most useful thing to understand about your feed. It is not optimizing for whether the content is true, or good for you, or representative. It is optimizing for a measurable signal that stands in for your attention. Unit 7 comes back to what follows from that.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A video platform's recommender is described as 'showing you what you want'. What is it more precisely doing?",
          choices: [
            "Finding the highest-quality videos on the platform",
            "Predicting which videos you are most likely to engage with, by some measured signal",
            "Showing you videos similar to ones your friends watched",
            "Randomly sampling videos and learning from your reaction",
          ],
          answer: 1,
          explanation:
            "It predicts a measurable proxy for engagement and ranks by it. Quality is not measured and is not the objective. The gap between 'what holds your attention' and 'what you would endorse watching on reflection' is where most criticism of recommender systems lives.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## The ones you do not see

Beyond the consumer surface, models are making or shaping decisions in places with much higher stakes:

**Healthcare.** Flagging suspicious regions on scans for a radiologist to review, and predicting which patients are likely to deteriorate.

**Finance.** Deciding in milliseconds whether a card transaction looks fraudulent, and scoring loan applications.

**Hiring.** Ranking and filtering applications before any human reads them.

**Public services.** Allocating inspections, predicting demand, flagging claims for review.

The distinction that matters here is whether a model is **advising** a person who decides, or **deciding** by itself. A radiologist reviewing a flagged scan is the first. An application rejected before a human sees it is the second. Both are common, and the second is where almost all of the concern in Unit 7 is directed.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "Pick one AI system you interacted with in the last 24 hours. Describe its input, its output, and what you think it was optimizing for. Be specific about the last one.",
          modelAnswer: `Example: the autocomplete in my phone keyboard.

Input: the characters I have typed so far in this message, plus some of the preceding words for context.

Output: three suggested next words, ranked.

Optimizing for: the probability that a word is the one I will type next, learned from enormous quantities of text, and adjusted by which suggestions I have accepted before. Notably it is not optimizing for the clearest or most precise word, which is why heavy reliance on it tends to flatten how you write.

A strong answer names a specific optimization target and notices where that target differs from what you would actually want.`,
        },
      ],
    },

    {
      id: "aif-u1-c1",
      slug: "find-the-ai",
      title: "Find the AI",
      kind: "connection",
      summary:
        "Take one app you already use, pull it apart, and work out exactly where the intelligence is.",
      estimatedMinutes: 30,
      objectives: [
        "Locate AI systems inside a product you use regularly",
        "Describe a real system in terms of input, processing and output",
        "Judge whether a system is advising or deciding",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Everything in this unit has been described in the abstract. This activity exists because abstract understanding of AI collapses the moment you meet a real system, and the only fix is to go and meet one.

**Choose one app or service you have used in the last week.** A social app, a streaming service, a shopping site, a game, a bank, a school platform. Pick one you use often enough to know well.

Then work through the four questions below. Spend about half an hour. Open the app while you do it rather than working from memory, because the useful details are the ones you have stopped noticing.

There are no model answers that will match your choice, so the comparison answers below describe what a strong response contains rather than giving you a correct one.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**Where is the AI?** Name your app, then list every place you think a model is involved. Include the ones that are not advertised. Aim for at least three.",
          modelAnswer: `A strong answer gets past the obvious feature. For a music app, the obvious one is the recommended playlist. The less obvious ones include search (which tolerates your typos and understands "that song from the advert"), the automatic volume levelling across tracks, the ordering of results, and the decision about which notification to send you and when.

If you found only one, you probably stopped at the feature the company markets. Look at search, ranking, notifications, moderation and anything that adapts to you.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Pick the most important one and break it down.** What exactly goes in as input, what comes out as output, and what do you think it is optimizing for?",
          modelAnswer: `A strong answer is specific about input. Not "my data" but "which tracks I have skipped in the first ten seconds, which I have replayed, and what listeners with similar histories went on to play".

It is specific about output. Not "recommendations" but "a predicted score for each candidate track, used to sort them".

And it is honest about the objective. The optimization target is almost never "make the user happy". It is a measurable stand-in: minutes listened, sessions per week, subscription retention. Naming the stand-in, and noticing where it diverges from what you actually want, is the point of the question.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Advising or deciding?** For the system you chose, does a person review its output before it affects you, or does it act on its own? What would change if it got it badly wrong?",
          modelAnswer: `Most consumer systems decide alone. No human approves your feed ordering or your recommended tracks, which is fine precisely because the cost of a bad recommendation is that you skip a song.

A strong answer connects the stakes to the oversight. Low stakes and no human review is a reasonable trade. High stakes and no human review, as in an automatically rejected loan or a flagged exam, is the arrangement worth objecting to, and the reason it matters is that there is often no route to appeal a decision nobody made.

If your app has a system where being wrong would genuinely harm someone, say what recourse exists. Frequently the honest answer is none, and noticing that is the whole exercise.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## Before you move on

Keep what you wrote. Unit 7 returns to exactly this app and asks harder questions about it, including who is affected by its mistakes and whether the people affected ever agreed to any of it.`,
        },
      ],
    },

    {
      id: "aif-u1-q1",
      slug: "unit-quiz",
      title: "Unit 1 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      objectives: [
        "Confirm you can define AI and classify systems correctly",
        "Confirm you can explain what changed to make modern AI work",
      ],
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
            "Which of these is the clearest sign that a system is doing machine learning rather than following fixed rules?",
          choices: [
            "It uses sensors to measure the world",
            "Its behavior changes based on data it has seen, without anyone rewriting it",
            "It runs on powerful hardware",
            "It responds in natural language",
          ],
          answer: 1,
          explanation:
            "Changing behavior without a programmer editing the program is the dividing line. Sensors, hardware and a chat interface are all things that fixed-rule software can have.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Put these in chronological order: expert systems, the Dartmouth workshop, AlexNet, transformers.",
          choices: [
            "Dartmouth, expert systems, AlexNet, transformers",
            "Dartmouth, AlexNet, expert systems, transformers",
            "Expert systems, Dartmouth, transformers, AlexNet",
            "Dartmouth, expert systems, transformers, AlexNet",
          ],
          answer: 0,
          explanation:
            "Dartmouth in 1956, expert systems through the 1980s, AlexNet in 2012, transformers in 2017. The gap between the first two is longer than the gap between the last two, which is a reasonable summary of how the field has accelerated.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What caused the AI winters?",
          choices: [
            "Hardware was not fast enough to run the algorithms",
            "Researchers lost interest in the problems",
            "Results fell far short of what had been promised, and funding was withdrawn",
            "Governments banned AI research on safety grounds",
          ],
          answer: 2,
          explanation:
            "The winters were funding events caused by a gap between promises and delivery. Hardware limits were a genuine contributing factor, but the mechanism was money being withdrawn after the field overpromised.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A system diagnoses one specific eye disease from retinal scans more accurately than most ophthalmologists. Which category?",
          choices: [
            "Superintelligence, since it beats human experts",
            "General AI, since medical diagnosis requires broad knowledge",
            "Narrow AI, since it does exactly one task",
            "It is not AI, since it only classifies images",
          ],
          answer: 2,
          explanation:
            "Narrow. Outperforming experts at a task says nothing about breadth, and breadth is the only thing these categories measure. This is the same point as the Go question in lesson 1.3, deliberately.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Which combination best explains why AI progressed so quickly after 2012?",
          choices: [
            "New mathematical theories of intelligence",
            "Large labeled datasets, parallel hardware, and training networks at much greater scale",
            "Faster internet connections and cloud storage",
            "Increased government funding for AI research",
          ],
          answer: 1,
          explanation:
            "The ideas were largely old. Data, graphics hardware and scale were what changed, and the surprise was that scaling up kept producing better results rather than hitting a ceiling.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "In an AI system, what must the input always be converted to?",
          choices: ["Text", "Numbers", "Rules", "Images"],
          answer: 1,
          explanation:
            "Numbers, without exception. Images become grids of values, text becomes sequences of token numbers, audio becomes amplitudes. How each is converted is a large part of Units 3, 5 and 6.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "A deployed model gives a wrong answer. A thousand users correct it in conversation on the same day. What happens to the model?",
          choices: [
            "It gradually learns the correction from the volume of feedback",
            "Nothing, unless its owners retrain it and deploy a new version",
            "It updates immediately once enough users agree",
            "It flags itself for review automatically",
          ],
          answer: 1,
          explanation:
            "A deployed model is frozen. Corrections affect only the conversation they happen in. Changing the model requires retraining and redeployment, which is a deliberate decision by whoever runs it, not something users can trigger by weight of numbers.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt: "Why does the definition of AI keep changing over time?",
          choices: [
            "The technology improves, so the standards rise",
            "Researchers cannot agree on a definition",
            "Once a problem is solved reliably, people stop regarding it as AI",
            "Marketing departments redefine it to sell products",
          ],
          answer: 2,
          explanation:
            "The AI effect. The second and fourth options both contain some truth about the discourse, but the specific, reliable mechanism is that solved problems get reclassified as ordinary computing.",
        },
      ],
    },
  ],
};
