import type { Unit } from "@/content/types";

/**
 * Unit 1: Transformers and Large Language Models.
 *
 * Written first as the pilot for the course, and it has a specific job:
 * AI Fundamentals Unit 6 ends on the memory problem that broke recurrent
 * networks and explicitly says attention is what fixed it. A student
 * arriving here has been promised an answer, so 1.3 gives it rather than
 * working up to it.
 *
 * The order is deliberate and runs outside-in. 1.1 says what an LLM is,
 * 1.2 gives the block, 1.3 opens the one part of the block that matters,
 * 1.4 shows the whole thing running, 1.5 explains why the running thing
 * behaves like an assistant rather than an autocomplete. Teaching attention
 * before the block it lives in leaves students holding a mechanism with
 * nowhere to put it.
 */

/* ------------------------------------------------------------- figures */

/** The cliffhanger from Fundamentals, answered. */
const ATTENTION_SVG = `
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="320" y="30" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Predicting the word after "The keys to the cabinet ___"</text>

  <g font-size="15" text-anchor="middle">
    <text x="52" y="86" fill="var(--color-ink-muted)">The</text>
    <text x="126" y="86" fill="var(--color-ink)" font-weight="600">keys</text>
    <text x="196" y="86" fill="var(--color-ink-muted)">to</text>
    <text x="256" y="86" fill="var(--color-ink-muted)">the</text>
    <text x="344" y="86" fill="var(--color-ink-muted)">cabinet</text>
  </g>

  <rect x="96" y="66" width="62" height="28" rx="6" fill="none"
        stroke="var(--color-success)" stroke-width="2" />

  <g fill="none" stroke-linecap="round">
    <path d="M500 182 Q300 150 128 100" stroke="var(--color-success)" stroke-width="7" opacity="0.85" />
    <path d="M500 182 Q420 150 346 100" stroke="var(--color-accent)" stroke-width="2.5" opacity="0.5" />
    <path d="M500 182 Q400 150 258 100" stroke="var(--color-accent)" stroke-width="1.2" opacity="0.3" />
    <path d="M500 182 Q380 150 198 100" stroke="var(--color-accent)" stroke-width="1.2" opacity="0.3" />
    <path d="M500 182 Q300 156 56 100" stroke="var(--color-accent)" stroke-width="1" opacity="0.22" />
  </g>

  <rect x="446" y="186" width="110" height="34" rx="8"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="501" y="209" text-anchor="middle" font-size="15" font-weight="600"
        fill="var(--color-ink)">are</text>

  <text x="128" y="124" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-success)">most of the attention</text>

  <text x="320" y="248" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    No chain to travel along. The position looks straight back at whichever one it needs.</text>
</svg>`;

/** The block, which is smaller than people expect. */
const BLOCK_SVG = `
<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="s1-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <rect x="186" y="44" width="268" height="238" rx="12"
        fill="none" stroke="var(--color-line-strong)" stroke-width="2" stroke-dasharray="7 5" />
  <text x="320" y="30" text-anchor="middle" font-size="13" font-weight="600"
        fill="var(--color-ink-faint)">ONE TRANSFORMER BLOCK</text>

  <rect x="212" y="66" width="216" height="52" rx="9"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="320" y="88" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Multi-head self-attention</text>
  <text x="320" y="107" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    every position looks at every other</text>

  <rect x="212" y="132" width="216" height="34" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="320" y="154" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
    add the input back, normalize</text>

  <rect x="212" y="180" width="216" height="52" rx="9"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="2" />
  <text x="320" y="202" text-anchor="middle" font-size="14" font-weight="600"
        fill="var(--color-ink)">Feedforward network</text>
  <text x="320" y="221" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    each position, on its own</text>

  <rect x="212" y="246" width="216" height="34" rx="8"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="320" y="268" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
    add the input back, normalize</text>

  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M320 122 L320 128" marker-end="url(#s1-a)" />
    <path d="M320 170 L320 176" marker-end="url(#s1-a)" />
    <path d="M320 236 L320 242" marker-end="url(#s1-a)" />
  </g>

  <path d="M320 16 L320 40" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#s1-a)" fill="none" />
  <path d="M320 286 L320 310" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#s1-a)" fill="none" />

  <g font-size="12" fill="var(--color-ink-muted)">
    <text x="476" y="150">Stack this block</text>
    <text x="476" y="168">dozens of times.</text>
    <text x="476" y="192">That is the whole</text>
    <text x="476" y="210">architecture.</text>
  </g>

  <g stroke="var(--color-ink-faint)" stroke-width="1.2" stroke-dasharray="4 3" fill="none" opacity="0.7">
    <path d="M200 60 Q172 60 172 149 Q172 149 200 149" />
    <path d="M200 174 Q172 174 172 263 Q172 263 200 263" />
  </g>
  <text x="104" y="153" font-size="11" fill="var(--color-ink-faint)">residual</text>
  <text x="104" y="267" font-size="11" fill="var(--color-ink-faint)">residual</text>
</svg>`;

/** Why the same prompt gives different answers. */
const SAMPLING_SVG = `
<svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="320" y="28" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    "The capital of France is ___"</text>

  <g font-size="13">
    <text x="118" y="76" text-anchor="end" fill="var(--color-ink)" font-weight="600">Paris</text>
    <rect x="130" y="62" width="330" height="20" rx="4" fill="var(--color-accent)" opacity="0.85" />
    <text x="472" y="77" fill="var(--color-ink-muted)">0.91</text>

    <text x="118" y="116" text-anchor="end" fill="var(--color-ink)">a</text>
    <rect x="130" y="102" width="24" height="20" rx="4" fill="var(--color-accent)" opacity="0.55" />
    <text x="472" y="117" fill="var(--color-ink-muted)">0.04</text>

    <text x="118" y="156" text-anchor="end" fill="var(--color-ink)">the</text>
    <rect x="130" y="142" width="14" height="20" rx="4" fill="var(--color-accent)" opacity="0.4" />
    <text x="472" y="157" fill="var(--color-ink-muted)">0.02</text>

    <text x="118" y="196" text-anchor="end" fill="var(--color-ink-faint)">Lyon</text>
    <rect x="130" y="182" width="7" height="20" rx="3" fill="var(--color-accent)" opacity="0.3" />
    <text x="472" y="197" fill="var(--color-ink-muted)">0.01</text>
  </g>

  <text x="130" y="228" font-size="12" fill="var(--color-ink-faint)">
    …and roughly fifty thousand more, each with a probability.</text>
  <text x="130" y="250" font-size="12" fill="var(--color-ink-faint)">
    The model stops here. Picking one of them is a separate step, and that step has settings.</text>
</svg>`;

/** Three stages that produce three different objects. */
const STAGES_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="s1-b" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g font-size="11" text-anchor="middle">
    <rect x="16" y="76" width="166" height="86" rx="10"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="99" y="102" font-size="13" font-weight="600" fill="var(--color-ink)">Pretraining</text>
    <text x="99" y="122" fill="var(--color-ink-muted)">predict the next token,</text>
    <text x="99" y="138" fill="var(--color-ink-muted)">over an enormous corpus</text>
    <text x="99" y="155" fill="var(--color-ink-faint)">months, most of the cost</text>

    <rect x="236" y="76" width="166" height="86" rx="10"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="319" y="102" font-size="13" font-weight="600" fill="var(--color-ink)">Instruction tuning</text>
    <text x="319" y="122" fill="var(--color-ink-muted)">examples of following</text>
    <text x="319" y="138" fill="var(--color-ink-muted)">an instruction</text>
    <text x="319" y="155" fill="var(--color-ink-faint)">small, curated, expensive</text>

    <rect x="456" y="76" width="166" height="86" rx="10"
          fill="var(--color-success-soft)" stroke="var(--color-success-line)" />
    <text x="539" y="102" font-size="13" font-weight="600" fill="var(--color-ink)">Preference tuning</text>
    <text x="539" y="122" fill="var(--color-ink-muted)">people rank answers,</text>
    <text x="539" y="138" fill="var(--color-ink-muted)">the model learns the taste</text>
    <text x="539" y="155" fill="var(--color-ink-faint)">shapes tone and refusals</text>
  </g>

  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M182 119 L230 119" marker-end="url(#s1-b)" />
    <path d="M402 119 L450 119" marker-end="url(#s1-b)" />
  </g>

  <g font-size="12" text-anchor="middle" fill="var(--color-ink-faint)">
    <text x="99" y="192">a text predictor</text>
    <text x="319" y="192">does what it is told</text>
    <text x="539" y="192">sounds like an assistant</text>
  </g>

  <text x="320" y="30" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Only the first stage teaches it anything about the world.</text>
  <text x="320" y="228" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    The last two change how it behaves, not what it knows.</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

export const unit1: Unit = {
  id: "ais-u1",
  slug: "transformers-and-llms",
  title: "Transformers and Large Language Models",
  summary:
    "The architecture behind every model you have used, taken apart: attention, the transformer block, and what happens when you press enter.",
  lessons: [
    {
      id: "ais-u1-l1",
      slug: "introduction-to-llms",
      title: "Introduction to Large Language Models",
      kind: "lesson",
      summary:
        "What an LLM is, how it differs from the NLP systems before it, and what scale turned out to buy.",
      estimatedMinutes: 25,
      objectives: [
        "Define a large language model and what makes one large",
        "Explain how LLMs differ from task-specific NLP models",
        "Describe what scaling laws observed and what they did not promise",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## What changed

Unit 6 of AI Fundamentals described NLP as a collection of tasks: sentiment analysis, entity recognition, translation, summarization. Each had its own model, its own training data and its own benchmark. A sentiment classifier could not translate, and nobody expected it to.

A **large language model** is a single model, trained on one objective, that does all of them without being trained on any of them specifically.

The objective is the one from AI Fundamentals 2.3: predict the next token. That is the whole training task. Everything else, including answering questions, writing code and explaining a joke, turns out to be reachable from it.

That is the genuinely surprising result of the last several years, and it is worth not glossing over. Nobody designed a question-answering module. Predicting text well enough, at sufficient scale, produced a system that answers questions.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## What "large" means

Two numbers, and they move together.

**Parameters**, the weights from AI Fundamentals Unit 4. Early transformer language models had hundreds of millions. Current frontier models have hundreds of billions, and some report more.

**Training tokens**, the amount of text seen during pretraining. Measured in trillions for current models.

Neither number alone tells you much, which is the part most coverage gets wrong. A model with more parameters trained on too little data is wasteful, and research on compute-optimal training found that many early large models were substantially undertrained for their size. The useful question is not how many parameters a model has but what it was trained on and for how long.`,
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Scaling laws, and what they actually said

Around 2020, researchers published empirical relationships between model size, data, compute and loss. The finding was that prediction loss falls predictably as those inputs grow, following smooth curves over many orders of magnitude.

This was consequential because it made spending defensible. If a bigger model reliably produces lower loss, training one is engineering rather than a gamble.

Two things to be careful about.

**These are empirical observations, not laws of nature.** They describe a range that has been measured. They do not guarantee the curve continues.

**Lower loss is not the same as more capability.** Loss measures how well the model predicts text. The capabilities people care about are downstream of that, and the relationship between them is not simple. Claims that a particular capability arrives at a particular scale should be read skeptically, and some reported sudden jumps in capability have been argued to be artifacts of how the capability was measured rather than genuine discontinuities.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "What single objective is a large language model pretrained on?",
          choices: [
            "Answering questions correctly",
            "Predicting the next token in a sequence",
            "Classifying text into categories",
            "Following human instructions",
          ],
          answer: 1,
          explanation:
            "Next-token prediction, and nothing else. Question answering and instruction following are not separate training objectives; the first emerges from prediction at scale and the second is added later by the tuning stages in lesson 1.5.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Model A has 500 billion parameters; model B has 70 billion. Which performs better?",
          choices: [
            "A, since more parameters always means more capability",
            "B, since smaller models are better optimized",
            "Not determinable without knowing how much data each was trained on",
            "They will perform identically on most tasks",
          ],
          answer: 2,
          explanation:
            "Parameter count alone is close to meaningless. A large model trained on insufficient data underperforms a smaller model trained properly, which was the central finding of the compute-optimal training work and why parameter counts stopped being the headline number.",
        },
        {
          id: "b6",
          kind: "written",
          prompt:
            "A company announces a model with ten times more parameters than its last one and calls it ten times more capable. Explain what is wrong with that claim.",
          modelAnswer: `Several things, and a strong answer names at least two.

Parameters are not capability. The relationship between size and loss is smooth and heavily diminishing, so ten times the parameters produces a modest reduction in loss, not ten times anything.

Loss is not capability either. Lower prediction loss correlates with better performance on downstream tasks but is not the same quantity, and the mapping is not linear.

Parameters without data is meaningless. If the new model saw the same training data as the old one, the extra capacity is largely wasted.

And "capable" is undefined. Capable at what, measured how, against what baseline? The strongest answers notice that the claim is unfalsifiable as stated, which is usually the point of phrasing it that way.`,
        },
      ],
    },

    {
      id: "ais-u1-l2",
      slug: "transformer-architecture",
      title: "Transformer Architecture",
      kind: "lesson",
      summary:
        "The block that replaced recurrence, and why removing the sequence was the point.",
      estimatedMinutes: 30,
      objectives: [
        "Describe the components of a transformer block",
        "Explain why removing recurrence enabled training at scale",
        "Distinguish encoder, decoder and encoder-decoder designs",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## One paper, one idea

In 2017 a paper titled "Attention Is All You Need" introduced the **transformer**. The title is the argument: previous systems used attention as an addition to a recurrent network, and the paper proposed removing the recurrence entirely and keeping only the attention.

AI Fundamentals Unit 6 set up why that mattered. A recurrent network passes a summary along a chain, so information from early in a sequence degrades, and because each step depends on the one before, the whole thing cannot be parallelized.

Removing recurrence removes both problems at once. That second one is easy to undersell: it is arguably why transformers won. An architecture you can train across thousands of processors at once is an architecture you can afford to make enormous.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## The block

A transformer is one block repeated. The block is simpler than its reputation.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: BLOCK_SVG,
          alt: "A dashed box labeled one transformer block, containing four stacked parts: multi-head self-attention, an add-the-input-back and normalize step, a feedforward network applied to each position on its own, and another add and normalize step. Two dashed residual connections loop around the attention and feedforward parts. A note says to stack this block dozens of times.",
          caption:
            "Four parts, two of which are bookkeeping. Scale comes from repeating this, not from any part of it being complicated.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `**Multi-head self-attention** is the part that does the work, and the next lesson is entirely about it. Every position looks at every other position and decides what to take from each.

**The feedforward network** is an ordinary neural network from AI Fundamentals Unit 4, applied to each position separately. Attention moves information between positions; this processes what arrived. Notably, most of a transformer's parameters live here rather than in the attention.

**Residual connections** add each sublayer's input to its output. Without them, gradients degrade through deep stacks and very deep networks become untrainable. They are why the block can be stacked dozens of times.

**Layer normalization** keeps the numbers in a workable range. Unglamorous and load-bearing.

A model is this block repeated, with the count being one of the things "large" refers to.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## Three shapes

The original paper described an encoder-decoder model for translation. The family has since split into three.

**Encoder-only** models read a whole input at once, with every position able to see every other, and produce a representation. Good for classification and search, not for generating text. BERT is the usual example.

**Decoder-only** models generate text left to right, with each position able to see only what came before it. This restriction is what makes the next lesson's generation possible, and essentially every model you have used as a chat assistant is decoder-only.

**Encoder-decoder** models read one sequence and produce another, which suits translation and summarization.

The industry converged on decoder-only for general-purpose models, because a model that generates text can be asked to do classification by generating a label, while a classifier cannot be asked to write.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Besides handling long-range dependencies, what did removing recurrence enable?",
          choices: [
            "Smaller models",
            "Parallel processing of all positions, so training could use large clusters",
            "Training without any data",
            "Elimination of the need for attention",
          ],
          answer: 1,
          explanation:
            "Recurrence forces sequential computation: position fifty waits for position forty-nine. Removing it lets every position be computed at once, which is what made training at the scale of frontier models practical.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "Where do most of a transformer's parameters live?",
          choices: [
            "In the attention mechanism",
            "In the feedforward networks",
            "In the layer normalization",
            "In the positional encodings",
          ],
          answer: 1,
          explanation:
            "The feedforward networks hold the majority, typically around two thirds. Attention gets the attention, so to speak, because it is the conceptually novel part, but it is not where the bulk of the model sits.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "Why did general-purpose assistants converge on decoder-only models?",
          choices: [
            "Decoder-only models are smaller",
            "A model that generates text can do classification by generating a label, but not the reverse",
            "Encoder models cannot be trained on large datasets",
            "Decoder-only models need less data",
          ],
          answer: 1,
          explanation:
            "Generation subsumes the other tasks. Asking a generative model to output the word 'positive' is a classification system; a classifier has no route to writing a paragraph. One architecture covering everything beat several specialized ones.",
        },
      ],
    },

    {
      id: "ais-u1-l3",
      slug: "attention-mechanisms",
      title: "Understanding Attention Mechanisms",
      kind: "lesson",
      summary:
        "Query, key and value, multiple heads, and how a model decides what to look at.",
      estimatedMinutes: 30,
      objectives: [
        "Explain self-attention in terms of queries, keys and values",
        "Say what multiple attention heads provide",
        "Describe why positional information has to be added back",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The promise from the last course

AI Fundamentals Unit 6 ended on a specific problem. Predicting the word after "The keys to the cabinet ___" requires knowing whether the subject is singular or plural, and that information sits thirteen steps back. A recurrent network has to carry it through every intervening step, where it degrades.

Here is what attention does instead.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: ATTENTION_SVG,
          alt: "The phrase The keys to the cabinet, with the word keys outlined. Curved lines run from the predicted word are back to each earlier word, with the line to keys drawn far thicker than the rest and labeled most of the attention. A note says there is no chain to travel along.",
          caption:
            "The thickness is the attention weight. The position needing agreement looks straight at the word that determines it, with nothing in between to dilute it.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `No chain. No dilution. Distance costs nothing, because every position is directly connected to every other.

The remaining question is how a position decides what to look at, and the answer is the part worth understanding properly.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Query, key, value

Every position produces three vectors from its own representation.

The **query** is what this position is looking for. For a position that needs a verb, something like "I need the subject this agrees with".

The **key** is what this position offers. For "keys", something like "I am a plural noun, available as a subject".

The **value** is what this position passes on if selected: the actual content.

The mechanism is then a lookup that does not require an exact match. Compare one position's query against every key, which produces a score per position measuring how well each one answers what you are looking for. Convert the scores to weights that sum to one. Take a weighted average of all the values.

That is self-attention. Comparison, normalization, weighted average. The only reason it works is that queries and keys are learned: training discovers what each position should ask for and what it should advertise, and nobody specifies either.

The "self" means positions attend within one sequence, rather than one sequence attending to another.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## Why several heads

A single attention operation produces one set of weights, forcing one answer to "what matters here". But a word relates to its context in several ways at once. "Keys" is the grammatical subject, a physical object, and the thing the sentence is about.

**Multi-head attention** runs several attention operations in parallel, each with its own learned queries, keys and values, then combines the results. Each **head** can specialize. Analysis of trained models has found heads that track syntactic relationships, heads that follow what a pronoun refers to, and heads that do things nobody has a clean name for.

Nothing assigns these roles. The heads differentiate because differentiating reduces the loss.`,
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## The thing attention destroys

Look again at the mechanism: compare, weight, average. Nothing in it refers to where anything is.

That means self-attention is indifferent to order. "The dog bit the man" and "The man bit the dog" contain identical words, and to attention alone they are identical inputs. Removing recurrence removed the model's only source of sequence information.

So position is added back explicitly, as a **positional encoding**: a signal mixed into each token's representation that says where it sits. Approaches vary and are an active area, but all of them exist to restore something the architecture gave up.

This is worth holding onto, because it reframes the whole design. A transformer does not process a sequence. It processes a set, and is told where the members came from.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "In self-attention, what does the query at a given position represent?",
          choices: [
            "The content that position will pass on",
            "What that position is looking for in other positions",
            "The position's location in the sequence",
            "The final output for that position",
          ],
          answer: 1,
          explanation:
            "The query is the request. Keys advertise what each position offers, values carry the content, and the match between query and key determines how much of each value gets taken.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "Why do transformers need positional encodings?",
          choices: [
            "To make training faster",
            "Because attention is indifferent to order, so position has to be supplied separately",
            "To reduce the number of parameters",
            "To let the model handle longer sequences",
          ],
          answer: 1,
          explanation:
            "Attention compares and averages with no reference to location, so without positional information the model would see a bag of words. Removing recurrence removed the architecture's only inherent sense of order, and positional encoding puts it back.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt: "What do multiple attention heads provide?",
          choices: [
            "Redundancy in case one head fails",
            "Several simultaneous relationships, since one set of weights forces one answer about what matters",
            "Faster processing through parallelism",
            "The ability to handle multiple languages",
          ],
          answer: 1,
          explanation:
            "A word relates to its context grammatically, semantically and referentially at the same time, and a single attention operation can only express one weighting. Heads specialize during training without being told to.",
        },
      ],
    },

    {
      id: "ais-u1-l4",
      slug: "how-llms-generate",
      title: "How LLMs Generate Responses",
      kind: "lesson",
      summary:
        "Next-token prediction, sampling, temperature, and why the same prompt gives different answers.",
      estimatedMinutes: 25,
      objectives: [
        "Trace one token from prompt to output",
        "Explain how sampling settings change the result",
        "Say why a model cannot plan a sentence before writing it",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## One token at a time

A model does not write a response. It predicts one token, appends it to what it has, and predicts again from the longer text. This is **autoregressive** generation, and everything odd about how these systems behave follows from it.

What the model produces at each step is not a word. It is a probability for every token in its vocabulary.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: SAMPLING_SVG,
          alt: "The prompt The capital of France is, with a bar chart of candidate next tokens: Paris at 0.91 with a long bar, a at 0.04, the at 0.02, Lyon at 0.01 with a tiny bar. A note says there are roughly fifty thousand more, and that the model stops here while picking one is a separate step with settings.",
          caption:
            "The model's entire output is this distribution. Which token gets chosen from it is a decision made outside the model.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Choosing

Always taking the highest-probability token is **greedy decoding**. It is deterministic and tends to produce flat, repetitive text, because the safest next word repeatedly is rarely good writing.

So a token is usually sampled from the distribution instead, and the settings controlling that are why the same prompt gives different answers.

**Temperature** reshapes the distribution before sampling. Low temperature sharpens it toward the most likely tokens, making output focused and predictable. High temperature flattens it, giving unlikely tokens a real chance, making output more varied and less reliable. At zero it is greedy decoding.

**Top-p**, or nucleus sampling, takes only the smallest set of tokens whose probabilities sum to p and samples from those, discarding the long tail. This matters because a vocabulary of fifty thousand tokens has an enormous tail of tiny probabilities that collectively are not small.

None of this is in the model. The model produces a distribution; these settings decide what to do with it.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Two consequences worth sitting with

**It cannot plan.** The model has not decided how a sentence ends when it begins one. Each token is chosen given everything so far, which means a sentence that starts down a bad path has to continue from there. Chain-of-thought prompting, in Unit 3, works partly by letting the model write intermediate steps it can then condition on, which is closer to planning than anything in the architecture itself.

**It cannot take anything back.** Once a token is generated it is part of the context for everything after it. A model that has stated a wrong fact is now conditioning on having stated it, which is part of why errors compound within a response and why a confidently wrong opening is rarely recovered from.

These are not bugs. They are what one-token-at-a-time means, and Unit 7 builds its entire account of hallucination on them.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What does a language model actually output at each step?",
          choices: [
            "The next word",
            "A probability distribution over every token in its vocabulary",
            "A sentence",
            "A confidence score for its whole answer",
          ],
          answer: 1,
          explanation:
            "A probability for every token, typically tens of thousands of them. Selecting one is a separate step governed by sampling settings, which is why the identical model can give different answers to the identical prompt.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "You need consistent, factual output for a lookup tool. What temperature setting?",
          choices: [
            "High, for more creative answers",
            "Low or zero, to concentrate on the most probable tokens",
            "It makes no difference to factual accuracy",
            "Temperature only affects response length",
          ],
          answer: 1,
          explanation:
            "Low temperature sharpens the distribution toward what the model considers most likely, producing consistent output. It is worth being precise about what this buys: it makes the model more consistent, not more correct. A confidently wrong model gets more consistently wrong.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "Why can a model not revise an earlier part of its answer mid-response?",
          choices: [
            "It would be too slow",
            "Generated tokens become part of the context it conditions on, so there is nothing to revise into",
            "The API does not allow it",
            "It can, but only with specific settings",
          ],
          answer: 1,
          explanation:
            "Generation only moves forward. Each token is appended and conditioned on, so a model that has written something wrong continues from a context containing it. Apparent self-correction is the model writing a correction as new text, not editing what came before.",
        },
      ],
    },

    {
      id: "ais-u1-l5",
      slug: "training-llms",
      title: "Training and Developing LLMs",
      kind: "lesson",
      summary:
        "Pretraining, instruction tuning and RLHF: three stages that produce three different things.",
      estimatedMinutes: 30,
      objectives: [
        "Distinguish pretraining from fine-tuning from preference training",
        "Explain what RLHF changes about a model's behavior",
        "Describe why a base model is not usable as an assistant",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Why a text predictor answers questions

A model trained only to predict text does not behave like an assistant. Given "What is the capital of France?" a pure text predictor might continue with more questions, because text containing one question frequently contains several.

Getting from there to something that answers takes two further stages.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: STAGES_SVG,
          alt: "Three stages left to right. Pretraining, predict the next token over an enormous corpus, months and most of the cost, producing a text predictor. Instruction tuning, examples of following an instruction, small and curated, producing something that does what it is told. Preference tuning, people rank answers and the model learns the taste, producing something that sounds like an assistant. Notes say only the first stage teaches it about the world.",
          caption:
            "The caption is the lesson. Everything the model knows comes from the first box; the other two change how it behaves.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Pretraining

Self-supervised next-token prediction over an enormous corpus, exactly as AI Fundamentals 2.3 described. This is where essentially all of the model's knowledge of the world comes from, it takes months on large clusters, and it accounts for most of the cost.

The result is called a **base model**. It is a very good text predictor and a poor assistant.

## Instruction tuning

Supervised fine-tuning on examples of instructions paired with good responses. The dataset is tiny relative to pretraining, often thousands to tens of thousands of examples, and is written or curated by people.

This does not teach the model anything new about the world. It teaches a format: when the text looks like an instruction, the continuation should look like a response to it. The capability was already there; this makes it accessible.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Preference tuning

Even after instruction tuning, the model has no sense of which of two acceptable answers is better. Preference tuning supplies it.

The usual route, **reinforcement learning from human feedback**, works in two parts. People are shown pairs of model responses and asked which is better. Those comparisons train a separate **reward model** that predicts human preference. The language model is then optimized to score well against that reward model.

The reason for the indirection is practical: you cannot have people rate every output during training, but you can have them rate enough to train a predictor of their ratings.

Newer methods such as direct preference optimization skip the separate reward model and optimize against the comparisons directly, which is simpler and increasingly common.

This stage shapes tone, length, formatting, willingness to refuse, and the tendency to agree with the user. Much of what makes a model feel like a particular assistant is set here.

Two caveats worth carrying into Unit 7. The model is optimizing a predictor of human approval, which is not the same as being correct, and a sufficiently strong optimizer will find answers that are approved of rather than answers that are right. And the preferences being learned belong to whoever was hired to do the comparisons, under whatever guidelines they were given.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "Which training stage gives a model its knowledge?",
          choices: [
            "Pretraining",
            "Instruction tuning",
            "Preference tuning",
            "All three equally",
          ],
          answer: 0,
          explanation:
            "Essentially all world knowledge comes from pretraining. The later stages are small, behavioral, and change how the model presents what it already has rather than adding to it. This is the reason fine-tuning is a poor way to teach a model new facts, which Unit 5 returns to.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "Why does RLHF train a separate reward model?",
          choices: [
            "To make the language model smaller",
            "Because people cannot rate every output during training, but can rate enough to train a predictor of their ratings",
            "Because reward models are more accurate than people",
            "To let the model train without any human involvement",
          ],
          answer: 1,
          explanation:
            "It is a scaling workaround. Human comparisons are limited and training needs an enormous number of evaluations, so a model is trained to predict those comparisons and stands in for the people. That substitution is also where several of the failure modes come from.",
        },
        {
          id: "b7",
          kind: "written",
          prompt:
            "Preference tuning optimizes a model against a predictor of human approval. Explain why that is not the same as optimizing for correctness, and give an example of how they diverge.",
          modelAnswer: `The objective is approval, and approval is a proxy for quality that comes apart from it in specific ways.

People reliably prefer confident answers to hedged ones, so a model optimized on those preferences learns to sound confident, including when it should not be. People prefer answers that agree with them, so the model learns agreeableness, which is the mechanism behind sycophancy. People prefer thorough-looking answers, so length and structure get rewarded somewhat independently of content.

An example: asked a question with no good answer, a hedged "I am not sure, and here is why this is hard" is more useful and less likely to be preferred than a fluent, confident, wrong one.

A strong answer notes that this is the classic proxy problem from AI Fundamentals: the thing being measured stands in for the thing wanted, and optimizing hard against a proxy eventually optimizes the gap between them. It also notes whose preferences these are, since the raters were a particular set of people following particular instructions.`,
        },
      ],
    },

    {
      id: "ais-u1-c1",
      slug: "watch-it-predict",
      title: "Watch It Predict",
      kind: "connection",
      summary:
        "Use a model you have access to and construct inputs that expose it as a next-token predictor rather than a thinker.",
      estimatedMinutes: 30,
      objectives: [
        "Design prompts that reveal token-level behavior",
        "Explain an observed failure in architectural terms",
        "Judge which limitations are fixable and which are structural",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Open any language model you can use and try to catch the architecture showing through.

This is not about finding it wrong, which is easy and uninteresting. It is about constructing inputs where the specific mechanism from this unit explains the behavior: tokenization, left-to-right generation, sampling, or the absence of planning.

Things worth trying, each targeting one thing:

- Ask it to count the letters in a long or unusual word, or to spell one backwards. Tokenization, from AI Fundamentals 6.2.
- Ask the same question several times in separate conversations. Sampling.
- Ask for a sentence with a constraint that only becomes checkable at the end, such as a sentence of exactly twelve words ending in a specific word. Planning.
- Ask it something it cannot know, phrased as though it should, and see whether it hedges or invents. Unit 7's territory, met early.
- Ask it to do arithmetic with numbers large enough to be unusual in text.

Spend about half an hour. Record exact prompts and exact outputs.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**What did you catch?** Give three specific prompts and the outputs you got. Quote them exactly.",
          modelAnswer: `A strong answer has exact text in and exact text out, because the interesting detail is usually in the specifics.

The pattern to aim for: not "it is bad at counting letters" but "asked how many times the letter r appears in a word, it answered two; asked to list the letters first and then count, it answered three."

That second version is far more useful, because it isolates what changed.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Explain one failure mechanically.** Pick your clearest case and account for it using this unit: tokenization, autoregressive generation, sampling, or the lack of planning. Be specific about which.",
          modelAnswer: `The explanation should name a mechanism and say how it produces the observed output.

Letter counting: the word arrives as a small number of subword token ids, so the model has no direct access to characters. It can often reason about spelling indirectly, which is why writing the letters out first sometimes fixes it, and that difference is evidence for the explanation rather than a workaround.

A sentence of exactly twelve words: the model commits to each token without having planned the whole sentence, so the constraint can only be satisfied by luck or by counting after the fact. Nothing in the architecture reserves the ending.

Different answers to the same question: sampling from a distribution rather than taking the maximum. If the answers differ in substance rather than phrasing, the distribution over the substantive tokens was not sharp, which says something about the model's certainty.

A strong answer distinguishes a limitation of this model from a limitation of the architecture.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Fixable or structural?** For each of your three failures, say whether a better or larger model would solve it, or whether it follows from how these systems work. Justify each.",
          modelAnswer: `This is the question the activity exists for, and the honest answer is usually mixed.

Largely structural: no planning ahead within a single forward pass, inability to revise generated text, variability from sampling. These follow from autoregressive generation and do not go away with scale, though they can be worked around with scaffolding like chain-of-thought or multiple passes.

Largely fixable or already partly fixed: specific factual errors, arithmetic, letter-level tasks. Scale, better data and tool use all help, and tool use in particular is the standard answer, since a model that can call a calculator does not need to be good at arithmetic.

In between: hallucination. Unit 7 argues it follows from the training objective, so it is reducible rather than removable.

A strong answer resists treating everything as a temporary deficiency. Some of these are what the architecture is, and knowing which is which is what separates a useful expectation from a disappointed one.`,
        },
      ],
    },

    {
      id: "ais-u1-q1",
      slug: "unit-quiz",
      title: "Unit 1 Quiz",
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
          prompt: 'What does the title "Attention Is All You Need" claim?',
          choices: [
            "Attention is the only thing a model needs to learn",
            "Recurrence can be removed entirely, keeping only attention",
            "Attention replaces the need for training data",
            "Human attention is required to supervise models",
          ],
          answer: 1,
          explanation:
            "Attention already existed as an addition to recurrent networks. The paper's argument was that the recurrence could be dropped, which removed both the dilution problem and the barrier to parallel training.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "In self-attention, what determines how much one position takes from another?",
          choices: [
            "Their distance apart in the sequence",
            "The match between one position's query and the other's key",
            "The order they were trained in",
            "The length of the input",
          ],
          answer: 1,
          explanation:
            "Query against key produces a score, scores become weights, weights average the values. Distance plays no part, which is precisely what distinguishes this from recurrence.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "Why do transformers need positional encodings?",
          choices: [
            "To speed up training",
            "Because attention has no inherent notion of order",
            "To reduce memory use",
            "To support multiple languages",
          ],
          answer: 1,
          explanation:
            "Compare, weight, average refers to nothing about location, so without added position the model sees an unordered set. The architecture processes a bag of tokens and is told where each came from.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "Where do most of a transformer's parameters sit?",
          choices: [
            "Attention heads",
            "Feedforward networks",
            "Positional encodings",
            "Layer normalization",
          ],
          answer: 1,
          explanation:
            "Typically around two thirds are in the feedforward networks. Attention is the conceptually interesting part but not the bulk of the model.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "What does a model output at each generation step?",
          choices: [
            "A single chosen word",
            "A probability for every token in its vocabulary",
            "A complete sentence",
            "A confidence rating",
          ],
          answer: 1,
          explanation:
            "A full distribution. Choosing from it is a separate step controlled by temperature and top-p, which is why identical prompts produce different answers from an unchanged model.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "What does lowering temperature do?",
          choices: [
            "Makes the model more accurate",
            "Concentrates sampling on the most probable tokens, making output more consistent",
            "Makes the model respond faster",
            "Reduces the length of responses",
          ],
          answer: 1,
          explanation:
            "Consistency, not accuracy. A model that is confidently wrong becomes more consistently wrong at low temperature, which is a distinction worth keeping straight.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "Which stage is responsible for what a model knows about the world?",
          choices: [
            "Instruction tuning",
            "Preference tuning",
            "Pretraining",
            "Guardrails applied at inference",
          ],
          answer: 2,
          explanation:
            "Pretraining, by a very large margin. The later stages are small and behavioral, which is why they cannot be used to install knowledge and why Unit 4's retrieval exists.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt: "What does RLHF primarily change?",
          choices: [
            "The facts the model knows",
            "How the model behaves: tone, format, willingness to refuse, agreeableness",
            "The model's architecture",
            "The size of the context window",
          ],
          answer: 1,
          explanation:
            "Behavior rather than knowledge. Much of a given assistant's recognizable character is set at this stage, including the agreeableness that Unit 7 identifies as a consequence of optimizing for approval.",
        },
        {
          id: "b10",
          kind: "quiz",
          prompt:
            "A model writes a sentence that paints itself into a corner grammatically and continues awkwardly rather than rephrasing. Why?",
          choices: [
            "The sampling temperature was too high",
            "Generation only moves forward, so earlier tokens are fixed context it must continue from",
            "The context window was exceeded",
            "The model was not instruction tuned",
          ],
          answer: 1,
          explanation:
            "Autoregressive generation cannot revise. Every token already produced is part of what the model conditions on, so a bad opening has to be continued rather than replaced.",
        },
      ],
    },
  ],
};
