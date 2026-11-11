import type { Unit } from "@/content/types";

/**
 * Unit 6: Natural Language Processing.
 *
 * The last technical unit, and the one that has to hand over cleanly. It
 * takes a student as far as recurrent networks and the problem attention
 * was invented to fix, then stops. Transformers, attention mechanisms and
 * large language models are the opening units of AI Specializations, and
 * teaching half of a transformer here would be worse than teaching none.
 *
 * 6.3 is the lesson that makes the rest make sense. "Meaning as a position
 * in space" is the idea behind embeddings, behind semantic search, and
 * behind the retrieval systems in the second course, and a student who gets
 * it here will recognize it four more times.
 */

/* ------------------------------------------------------------- figures */

/** Tokens are not words, which surprises people. */
const TOKENS_SVG = `
<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="20" y="44" font-size="12" font-weight="600" fill="var(--color-ink-faint)">
    WHAT YOU WROTE</text>
  <text x="20" y="76" font-size="19" fill="var(--color-ink)">
    The unhappiest tokenizer</text>

  <text x="20" y="124" font-size="12" font-weight="600" fill="var(--color-ink-faint)">
    WHAT THE MODEL GETS</text>

  <g font-size="15">
    <rect x="20" y="138" width="54" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="47" y="162" text-anchor="middle" fill="var(--color-ink)">The</text>

    <rect x="82" y="138" width="36" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="100" y="162" text-anchor="middle" fill="var(--color-ink)">un</text>

    <rect x="126" y="138" width="60" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="156" y="162" text-anchor="middle" fill="var(--color-ink)">happi</text>

    <rect x="194" y="138" width="42" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="215" y="162" text-anchor="middle" fill="var(--color-ink)">est</text>

    <rect x="244" y="138" width="54" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="271" y="162" text-anchor="middle" fill="var(--color-ink)">token</text>

    <rect x="306" y="138" width="36" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="324" y="162" text-anchor="middle" fill="var(--color-ink)">iz</text>

    <rect x="350" y="138" width="36" height="36" rx="6"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="368" y="162" text-anchor="middle" fill="var(--color-ink)">er</text>
  </g>

  <text x="406" y="162" font-size="14" fill="var(--color-ink-muted)">→ 7 token ids</text>

  <text x="20" y="206" font-size="12" fill="var(--color-ink-faint)">
    Common words are one token. Rare words are built from pieces, which is how a</text>
  <text x="20" y="222" font-size="12" fill="var(--color-ink-faint)">
    fixed vocabulary handles a word it has never seen.</text>
</svg>`;

/** Meaning as position, with the relationship that made it famous. */
const EMBEDDING_SVG = `
<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u6-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-success)" />
    </marker>
  </defs>

  <rect x="40" y="40" width="430" height="200" rx="8"
        fill="var(--color-surface)" stroke="var(--color-line)" />

  <g font-size="13">
    <circle cx="120" cy="190" r="6" fill="var(--color-accent)" />
    <text x="120" y="212" text-anchor="middle" fill="var(--color-ink)">man</text>

    <circle cx="120" cy="100" r="6" fill="var(--color-accent)" />
    <text x="120" y="88" text-anchor="middle" fill="var(--color-ink)">woman</text>

    <circle cx="330" cy="190" r="6" fill="var(--color-accent)" />
    <text x="330" y="212" text-anchor="middle" fill="var(--color-ink)">king</text>

    <circle cx="330" cy="100" r="6" fill="var(--color-accent)" />
    <text x="330" y="88" text-anchor="middle" fill="var(--color-ink)">queen</text>
  </g>

  <path d="M120 180 L120 112" stroke="var(--color-success)" stroke-width="2"
        marker-end="url(#u6-a)" fill="none" />
  <path d="M330 180 L330 112" stroke="var(--color-success)" stroke-width="2"
        marker-end="url(#u6-a)" fill="none" />

  <g stroke="var(--color-ink-faint)" stroke-dasharray="4 4" stroke-width="1.2">
    <line x1="132" y1="190" x2="318" y2="190" />
    <line x1="132" y1="100" x2="318" y2="100" />
  </g>

  <text x="225" y="184" text-anchor="middle" font-size="11" fill="var(--color-ink-faint)">
    royalty</text>
  <text x="152" y="150" font-size="11" fill="var(--color-success)">gender</text>

  <g font-size="12" fill="var(--color-ink-muted)">
    <text x="492" y="96">The same step</text>
    <text x="492" y="114">separates both</text>
    <text x="492" y="132">pairs, so the</text>
    <text x="492" y="150">direction itself</text>
    <text x="492" y="168">carries meaning.</text>
  </g>

  <text x="320" y="268" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Real embeddings have hundreds of dimensions. This is two of them, flattened.</text>
</svg>`;

/** Why long sequences broke recurrent networks. */
const RECURRENT_SVG = `
<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u6-b" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g font-size="12" text-anchor="middle">
    <rect x="24" y="92" width="86" height="52" rx="8"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="67" y="114" fill="var(--color-ink)" font-weight="600">step 1</text>
    <text x="67" y="133" fill="var(--color-ink-muted)">"The"</text>

    <rect x="142" y="92" width="86" height="52" rx="8"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="185" y="114" fill="var(--color-ink)" font-weight="600">step 2</text>
    <text x="185" y="133" fill="var(--color-ink-muted)">"keys"</text>

    <rect x="260" y="92" width="86" height="52" rx="8"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="303" y="114" fill="var(--color-ink)" font-weight="600">step 3</text>
    <text x="303" y="133" fill="var(--color-ink-muted)">"to the"</text>

    <rect x="378" y="92" width="86" height="52" rx="8"
          fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" />
    <text x="421" y="114" fill="var(--color-ink)" font-weight="600">…</text>

    <rect x="496" y="92" width="112" height="52" rx="8"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" stroke-width="2" />
    <text x="552" y="114" fill="var(--color-warning)" font-weight="600">step 14</text>
    <text x="552" y="133" fill="var(--color-ink-muted)">"___ on the table"</text>
  </g>

  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M110 118 L136 118" marker-end="url(#u6-b)" />
    <path d="M228 118 L254 118" marker-end="url(#u6-b)" />
    <path d="M346 118 L372 118" marker-end="url(#u6-b)" />
    <path d="M464 118 L490 118" marker-end="url(#u6-b)" />
  </g>

  <g font-size="11" text-anchor="middle" fill="var(--color-ink-faint)">
    <text x="123" y="106">memory</text>
    <text x="241" y="106">fainter</text>
    <text x="359" y="106">fainter</text>
    <text x="477" y="106">gone</text>
  </g>

  <text x="320" y="46" text-anchor="middle" font-size="13" fill="var(--color-ink)">
    Is the missing word "is" or "are"?</text>
  <text x="320" y="68" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    It depends on "keys", thirteen steps ago.</text>
  <text x="320" y="186" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Everything passes through one summary, handed along and diluted at every step.</text>
  <text x="320" y="208" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Attention was invented to let step 14 look straight back at step 2.</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

export const unit6: Unit = {
  id: "aif-u6",
  slug: "natural-language-processing",
  title: "Natural Language Processing",
  summary:
    "How language gets turned into numbers without losing its meaning, and how close that actually gets.",
  lessons: [
    {
      id: "aif-u6-l1",
      slug: "introduction-to-nlp",
      title: "Introduction to NLP",
      kind: "lesson",
      summary:
        "What makes human language hard for a machine, and what NLP is asked to do about it.",
      estimatedMinutes: 20,
      objectives: [
        "Define NLP and its major tasks",
        "Explain why ambiguity makes language hard",
        "Separate language understanding from language generation",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Language is not like other data

Natural language processing is machine learning applied to human language: reading it, and producing it.

Language resists the treatment that worked for images, and the reason is ambiguity. Not occasional ambiguity at the edges, but ambiguity running through almost every sentence, resolved so effortlessly by people that we do not notice we are doing it.

Consider: **"I saw the man with the telescope."**

Did you use a telescope to see him, or did he have one? The sentence is genuinely both. You pick one instantly, using context the sentence does not contain.

Or: **"The trophy would not fit in the suitcase because it was too big."**

What was too big? The trophy. Now change one word: "because it was too small." Now "it" means the suitcase. The grammar is identical; the referent flipped because you know things about trophies and suitcases.

That is why language is hard. Understanding a sentence requires knowing about the world, and the sentence does not contain the world.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Two halves

**Understanding**, often called natural language understanding, is going from text to something the machine can act on: what is this about, what is the sentiment, which names appear, what is being asked.

**Generation** is the other direction: producing text that is fluent and appropriate. Summarizing, translating, answering, writing.

The two needed quite different approaches for most of the field's history. What makes current systems feel so different from older ones is that large models do both with the same machinery, which is where AI Specializations picks up.

The tasks worth naming now: classification (what kind of text is this), named entity recognition (which words are people, places, organizations), sentiment analysis (is this positive or negative), machine translation, summarization, and question answering.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            'In "The city council refused the demonstrators a permit because they feared violence", who does "they" refer to, and why is this hard for a machine?',
          choices: [
            "The demonstrators; the machine needs better grammar rules",
            "The council; resolving it requires knowledge about councils and protests, not grammar",
            "It is genuinely ambiguous and no answer exists",
            "The permit; the sentence is poorly written",
          ],
          answer: 1,
          explanation: `It is the council, and you know that because councils fear violence and grant permits while demonstrators want permits. Swap "feared" for "advocated" and the referent moves to the demonstrators with no grammatical change at all.

This is a Winograd schema, a type of sentence designed specifically to need world knowledge rather than syntax. They were long used as a test of genuine understanding precisely because no amount of grammatical analysis solves them.`,
        },
      ],
    },

    {
      id: "aif-u6-l2",
      slug: "processing-language",
      title: "How Machines Process Language",
      kind: "lesson",
      summary:
        "Tokenization, normalization and the unglamorous preprocessing that everything else sits on.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what tokenization does and why",
        "Describe text normalization and stop words",
        "Say why tokens are not the same as words",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Chopping text up

Everything in this course has to become numbers, and text is no exception. The first step is **tokenization**: splitting text into units the model will work with.

The obvious approach is to split on spaces, one token per word. It fails in both directions. A fixed vocabulary of whole words either misses every unusual word it meets, or grows impossibly large trying to include them all, and it has no idea that "run" and "running" are related.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: TOKENS_SVG,
          alt: "The phrase The unhappiest tokenizer shown above its tokenization into seven pieces: The, un, happi, est, token, iz, er. A note explains common words are one token while rare words are built from pieces.",
          caption:
            "This is why a model can handle a word it has never seen, and also why it sometimes miscounts letters: it is not looking at letters.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `Modern systems use **subword tokenization**. Common words stay whole. Rare words are broken into frequent pieces. A vocabulary of perhaps fifty thousand tokens then covers any text at all, including words invented after the model was trained, because anything can be spelled out of its pieces.

Each token maps to an id, and the model works entirely with those ids.

This has a consequence worth knowing. When a language model is asked how many letters are in a word, or to reverse one, it often gets it wrong, and the reason is right here: it never saw the letters. It saw two or three token ids. Asking it about spelling is like asking someone to describe the individual brushstrokes in a painting they only ever saw as a thumbnail.

Older pipelines also used **normalization** steps: lowercasing everything, stripping punctuation, removing **stop words** like "the" and "is", and reducing words to their stems so "running" became "run". These were necessary when models were statistical and fragile. Modern models mostly skip them, because the discarded information turned out to matter. "The" carries grammatical weight, and capitalization distinguishes "apple" from "Apple".`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            'Why might a language model miscount the letters in "strawberry"?',
          choices: [
            "Its training data contained spelling errors",
            "It processes the word as a small number of subword tokens, not as individual letters",
            "It cannot count at all",
            "The word is too rare in English text",
          ],
          answer: 1,
          explanation:
            "The word arrives as a couple of token ids with no letter-level structure. The model can often reason about spelling indirectly, since text about spelling exists in its training data, but it has no direct access to the characters, which is why this class of question fails unpredictably.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "What is the main advantage of subword tokenization over whole-word tokenization?",
          choices: [
            "It makes text shorter",
            "A fixed vocabulary can represent any word, including ones never seen in training",
            "It removes the need for a vocabulary",
            "It preserves the original spelling exactly",
          ],
          answer: 1,
          explanation:
            "Unknown words are the problem it solves. Any string can be built from known pieces, so the model is never stopped by a word that did not exist when it was trained.",
        },
      ],
    },

    {
      id: "aif-u6-l3",
      slug: "meaning-and-context",
      title: "Understanding Meaning and Context",
      kind: "lesson",
      summary:
        "Word embeddings and the idea that meaning can be a position in space.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what a word embedding is",
        "Describe how similarity is measured between embeddings",
        "Say why context changes a word's representation",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The problem with token ids

Tokenization gives every token a number, but those numbers are arbitrary. If "cat" is 4,281 and "dog" is 17,093 and "democracy" is 4,282, then by the numbers cat is adjacent to democracy and nowhere near dog. The ids carry no meaning at all.

What is needed is a representation where similar words are genuinely close together. That is an **embedding**: each token is represented by a list of numbers, typically a few hundred of them, positioning it in a space where distance means something.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: EMBEDDING_SVG,
          alt: "Four words plotted as points. Man and woman on the left, king and queen on the right. Arrows from man to woman and from king to queen are the same length and direction, labeled gender. A horizontal dashed line between the pairs is labeled royalty. A note explains the same step separates both pairs, so the direction carries meaning.",
          caption:
            "Nobody told it about gender or royalty. These directions emerge from nothing but which words appear near which other words.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Learned from company alone

Embeddings are learned using self-supervised learning from Unit 2: hide a word, predict it from its neighbors, repeat across billions of sentences. Words appearing in similar contexts drift toward similar positions.

The principle behind it is older than the technology, usually summarized as the idea that you can know a word by the company it keeps. "Cat" and "dog" end up close because both appear near "pet", "vet", "feed" and "fur".

What surprised everyone is that the space turns out to have structure. Directions within it carry meaning. The step from "man" to "woman" is roughly the same step as from "king" to "queen", which is why the famous arithmetic works: take the vector for king, subtract man, add woman, and you land near queen.

Nobody designed that. It fell out of predicting missing words.

**Similarity** between embeddings is measured by the angle between them rather than straight-line distance, a measure called cosine similarity, because what matters is direction rather than magnitude. This is the mechanism behind semantic search: a query is embedded, documents are embedded, and you return whichever documents sit closest. It is also exactly how the retrieval systems in AI Specializations find relevant information.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## One position is not enough

Early embeddings gave each word one fixed vector, which cannot be right. "Bank" in "river bank" and "bank account" is one word with two unrelated meanings, and a single position has to be a useless average of the two.

**Contextual embeddings** fixed this. The representation of a word is computed from the sentence it appears in, so "bank" near "river" lands somewhere different from "bank" near "deposit". The same word gets different numbers in different sentences.

This is the capability that attention mechanisms provide, and it is one of the main reasons modern language models work as well as they do. How attention actually achieves it opens AI Specializations.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What does a word embedding represent?",
          choices: [
            "The spelling of the word in numerical form",
            "A position in a space where similar words sit near each other",
            "How frequently the word appears in training data",
            "The grammatical category of the word",
          ],
          answer: 1,
          explanation:
            "A position whose geometry encodes relationships. Distance means similarity of use, and directions within the space turn out to correspond to consistent relationships like gender or tense.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: 'Why is a single fixed embedding for "bank" inadequate?',
          choices: [
            "The word is too common",
            "It has unrelated meanings, so one position can only be a meaningless average of them",
            "It is too short to embed accurately",
            "Embeddings cannot represent nouns",
          ],
          answer: 1,
          explanation:
            "A fixed vector must sit somewhere between financial and geographical usage, which is near neither. Contextual embeddings solve it by computing the representation from the surrounding sentence, so the two senses land in different places.",
        },
        {
          id: "b7",
          kind: "written",
          prompt:
            "Embeddings learn from how words are used in text. Explain why this means they can absorb human prejudices, and give an example of what that would look like.",
          modelAnswer: `Embeddings encode statistical regularities in how words co-occur. If text consistently places certain occupations near certain genders, that association becomes part of the geometry, in exactly the same way the king-queen relationship did. The model cannot distinguish "these words appear together because of a fact" from "these words appear together because of a prejudice", because it only ever sees co-occurrence.

Published work on this found that the same vector arithmetic producing "king is to queen" also produced analogies associating men with programming and women with homemaking, learned from ordinary news text.

The consequence is that any system built on those embeddings inherits the association. A resume screener using them may rank candidates partly by how closely their language resembles text historically written about people in that role.

A strong answer notices that this is not a bug in the method. The embedding is accurately reporting a pattern in the text. The problem is that we wanted it to tell us about the world and it told us about the writing.`,
        },
      ],
    },

    {
      id: "aif-u6-l4",
      slug: "nlp-models",
      title: "NLP Models and Architectures",
      kind: "lesson",
      summary:
        "Recurrent networks, LSTMs and the memory problem that attention was invented to solve.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how an RNN processes a sequence",
        "Explain the problem with long sequences",
        "Say what attention was introduced to fix",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Reading one word at a time

A **recurrent neural network** processes a sequence in order. It reads the first token, produces an output and a **hidden state** summarizing what it has seen, then reads the second token together with that state, and so on.

The hidden state is its memory, and it is the whole design. It lets the network handle sequences of any length and gives it some notion of what came earlier.

It is also the flaw.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: RECURRENT_SVG,
          alt: "A sentence processed left to right through fourteen steps, with arrows between them labeled memory, fainter, fainter, gone. The question is whether a missing word should be is or are, which depends on the word keys at step two. A note explains attention was invented to let step fourteen look straight back at step two.",
          caption:
            "Everything the network knows about the start of the sentence has to survive being squeezed through every intervening step.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `Every piece of information from early in the sequence has to pass through every subsequent step, and at each one it is mixed with new input and partly overwritten. By step fourteen, step two is faint or gone.

Technically this shows up during training as the **vanishing gradient problem**: when backpropagation works backwards through many steps, the gradients shrink toward zero, so the network effectively cannot learn long-range dependencies at all.

**LSTMs**, long short-term memory networks, were the main fix for about two decades. They add gates that explicitly decide what to keep, what to discard and what to output, which lets important information travel much further. They worked well enough to power translation and speech recognition for years.

They did not solve it, only extended it. And they inherited a second problem that turned out to matter more commercially: because each step depends on the previous one, an RNN cannot be parallelized. You cannot process word fifty until you have processed word forty-nine, which means training cannot exploit the parallel hardware Unit 1 described as one of the three things that changed.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## What attention changed

**Attention** removed the bottleneck by removing the sequence. Rather than passing a summary along a chain, each position looks directly at every other position and learns how much to weight each one.

Predicting the word after "The keys to the cabinet ___" means looking back at "keys", and attention lets a position do that in one step regardless of distance. There is no dilution because there is no chain.

It also restored parallelism. Every position can be computed at the same time, which is what made training on internet-scale text possible.

The 2017 paper that introduced the **transformer** took this to its conclusion by removing recurrence altogether and using attention alone, and essentially all modern language models descend from it. How attention works mechanically, and what a transformer is built from, are the first unit of AI Specializations.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "What is the fundamental limitation of a recurrent network on long sequences?",
          choices: [
            "It cannot handle sequences longer than a fixed length",
            "Information from early steps is diluted as it passes through every later step",
            "It requires too much memory to store the sequence",
            "It can only process text, not other sequences",
          ],
          answer: 1,
          explanation:
            "Everything travels through a single hidden state that is rewritten at each step, so early information degrades with distance. LSTMs extended the reach considerably but did not change the shape of the problem.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Besides handling long-range dependencies, what practical advantage did attention bring?",
          choices: [
            "It uses less memory",
            "Positions can be processed in parallel rather than strictly in order",
            "It needs no training data",
            "It eliminates the need for tokenization",
          ],
          answer: 1,
          explanation:
            "Recurrence forces sequential processing, which leaves parallel hardware idle. Removing it let training scale onto the GPU clusters that made large models feasible, and that was arguably as important as the quality improvement.",
        },
      ],
    },

    {
      id: "aif-u6-l5",
      slug: "nlp-applications",
      title: "NLP Applications",
      kind: "lesson",
      summary:
        "Sentiment analysis, entity recognition, translation and speech, and what each one gets wrong.",
      estimatedMinutes: 20,
      objectives: [
        "Match an NLP task to a real application",
        "Explain a common failure mode for each",
        "Judge where human review is still required",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Four tasks and their characteristic failures

**Sentiment analysis** classifies text as positive, negative or neutral, and is used at scale on reviews and social media. Its characteristic failure is anything non-literal. "Well, that was exactly what I needed today" is negative and reads as positive on the surface. Sarcasm, irony and understatement are unreliable, and they are common in precisely the text people most want analyzed.

**Named entity recognition** pulls out people, organizations, places and dates. It underpins search and document processing. It fails on ambiguity between names and ordinary words, and on organizations named after people, which is most law firms and many hospitals.

**Machine translation** is genuinely transformed from where it was fifteen years ago, and is still unreliable in specific ways. It struggles where languages encode different information: a language that marks formality or grammatical gender forces the system to choose something the source never specified. Translating "the doctor" into a gendered language means guessing, and systems have historically guessed using training-data stereotypes.

**Speech recognition** converts audio to text. Accuracy varies substantially by accent, dialect and recording conditions. Studies of commercial systems have found notably higher error rates for some dialects than others, which is the same unrepresentative-training-data story as Unit 5's facial recognition result, in a different medium.`,
        },
        {
          id: "b2",
          kind: "quiz",
          prompt:
            "A company uses sentiment analysis on customer reviews and reports 88% accuracy. Which group of reviews is most likely being misread?",
          choices: [
            "Very long reviews",
            "Sarcastic or ironic reviews, which are often the most negative",
            "Reviews containing numbers",
            "Reviews written in capital letters",
          ],
          answer: 1,
          explanation:
            "Sarcasm inverts literal meaning, so these reviews are not merely missed but scored in the wrong direction. They also tend to be the strongly negative ones, which means the errors concentrate exactly where the company most needs accuracy.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            'Translating "The nurse said she would be back" into a language requiring grammatical gender for "nurse". What is the risk?',
          choices: [
            "The sentence is too short to translate",
            "The system must choose a gender, and may default to a stereotype learned from training data",
            "Gendered languages cannot express this sentence",
            "The translation will be too literal",
          ],
          answer: 1,
          explanation:
            "The target language demands information the source does not supply, so the model falls back on what was statistically common in training. Documented cases have shown occupational stereotypes being introduced by translation into text that never contained them.",
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "A hospital proposes automatic transcription of doctor-patient conversations into medical records. Name two specific NLP risks and say what safeguard you would require.",
          modelAnswer: `Two concrete risks, not general unease.

Speech recognition error rates vary by accent and dialect, so patients and staff with accents less represented in training data get less accurate records. The errors are not random: they fall on specific people, repeatedly.

Medical vocabulary is dense with terms that sound alike and matter enormously. Drug names in particular are a known hazard, and a transcription error between two similar names is a dosing error waiting to happen.

Safeguards worth naming: the clinician reviews and signs the transcript before it enters the record, the audio is retained so a disputed entry can be checked, and error rates are measured separately across patient groups rather than reported as one average.

A strong answer also asks whether patients consented to being recorded and who else can access the audio, which is Unit 7's territory and is at least as important as the accuracy question.`,
        },
      ],
    },

    {
      id: "aif-u6-c1",
      slug: "break-a-translator",
      title: "Break a Translator",
      kind: "connection",
      summary:
        "Find the sentences a translation system cannot handle, and work out what about them is hard.",
      estimatedMinutes: 30,
      objectives: [
        "Construct inputs that expose NLP limitations",
        "Explain a failure using tokenization or context",
        "Assess the risk of relying on automated translation",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Open any free translation tool and try to break it, using what this unit gave you.

A useful technique if you only read one language: translate a sentence into another language, then translate the result back. Meaning that survives the round trip was probably understood. Meaning that does not was not.

Things worth trying, each targeting something specific from this unit:

- An idiom. "It is raining cats and dogs." "He kicked the bucket."
- A sentence whose meaning depends on world knowledge, like the trophy and suitcase sentence from 6.1.
- Sarcasm.
- A word with two unrelated meanings, used so only context distinguishes them.
- A sentence with no stated gender, translated into a language that requires one.
- A made-up word, to see what tokenization does with it.

Spend about half an hour. Keep notes on what you put in and what came back.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**What broke?** Give three specific sentences that failed, what you expected, and what you actually got.",
          modelAnswer: `A strong answer quotes exact inputs and outputs rather than describing them.

"The spirit is willing but the flesh is weak" surviving a round trip as something about alcohol and meat is the classic example, and variants of it still occur.

Weak answers report that the tool "struggled with idioms". The exercise is to produce evidence, which means the actual text in and the actual text out.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Why did it break?** For your clearest failure, explain the cause using this unit's vocabulary: ambiguity, context, world knowledge, tokenization, or information the target language requires that the source does not state.",
          modelAnswer: `The explanation should name a mechanism from the unit.

For an idiom: the phrase's meaning is not composed from its words, and the model has encountered the literal words far more often than the idiomatic use, so it translates the parts.

For a lost gender: the target language requires a distinction the source never made, so the model supplied the statistically common option rather than the correct one, because there was no correct one available in the input.

For a made-up word: subword tokenization split it into fragments, and the model translated plausible-looking pieces.

A strong answer distinguishes "the model lacked information" from "the model had the information and used it wrongly". These are different failures and only the second is fixable by a better model.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Where would this matter?** Name a setting where a failure like the ones you found would cause real harm, and say what safeguard should exist.",
          modelAnswer: `A strong answer picks a setting where the stakes are asymmetric and the person affected cannot check the translation themselves.

Medical: a patient describing symptoms through an app, where a mistranslated negation reverses the meaning of a sentence about an allergy.

Legal or asylum: testimony translated automatically, where an idiom rendered literally changes what someone appears to have said, and the person has no way to know it happened.

Safeguards: a qualified human translator for anything consequential, the original retained alongside the translation so it can be checked, and a clear statement to the person that the translation is automated.

The strongest version notices who carries the risk. The person who cannot read the output is the one harmed by an error in it, and they are also the one least able to detect it. That asymmetry is the argument for human review, and it does not go away as accuracy improves.`,
        },
      ],
    },

    {
      id: "aif-u6-q1",
      slug: "unit-quiz",
      title: "Unit 6 Quiz",
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
          prompt: "What is tokenization?",
          choices: [
            "Converting text to lowercase and removing punctuation",
            "Splitting text into units that are mapped to numbers for the model",
            "Finding the names of people and places in text",
            "Translating text between languages",
          ],
          answer: 1,
          explanation:
            "It is the first step that turns text into something a model can process. The first option describes normalization, which is a different and now largely optional step.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Why do modern systems use subword tokens rather than whole words?",
          choices: [
            "Subwords are faster to process",
            "A fixed vocabulary can then represent any word, including unseen ones",
            "Whole words take up more memory",
            "Subwords preserve grammar better",
          ],
          answer: 1,
          explanation:
            "Unknown words are the problem. Any string can be assembled from known pieces, so the model is never defeated by a word coined after it was trained.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Two words have embeddings pointing in nearly the same direction. This means:",
          choices: [
            "They are spelled similarly",
            "They are used in similar contexts and are treated as similar in meaning",
            "They have the same number of letters",
            "They appear equally often in the training data",
          ],
          answer: 1,
          explanation:
            "Embeddings encode usage, not spelling. Words appearing near similar neighbors drift toward similar positions, and similarity is measured by angle rather than distance.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What problem do contextual embeddings solve?",
          choices: [
            "Models being too slow to train",
            "A word with multiple unrelated meanings needing more than one fixed representation",
            "Text being too long to process",
            "Vocabularies being too large",
          ],
          answer: 1,
          explanation:
            'One vector for "bank" must sit uselessly between the financial and geographical senses. Computing the representation from the surrounding sentence puts each sense in a different place.',
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "Why do recurrent networks struggle with long sequences?",
          choices: [
            "They run out of memory",
            "Early information must pass through every later step and gets diluted",
            "They can only read text backwards",
            "They need the sequence length fixed in advance",
          ],
          answer: 1,
          explanation:
            "Everything funnels through one hidden state that is overwritten at each step. During training this appears as vanishing gradients, which prevents long-range dependencies being learned at all.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "What does attention let a model do?",
          choices: [
            "Process text faster by skipping unimportant words",
            "Let any position draw directly on any other position, regardless of distance",
            "Translate between any pair of languages",
            "Learn without any training data",
          ],
          answer: 1,
          explanation:
            "It replaces the chain with direct connections, so distance stops causing dilution. It also restores parallelism, since positions no longer have to be computed in order.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "Which type of text is sentiment analysis least reliable on?",
          choices: [
            "Long product reviews",
            "Sarcastic or ironic text, where literal and intended meaning differ",
            "Text containing numbers and prices",
            "Text written in formal English",
          ],
          answer: 1,
          explanation:
            "Sarcasm inverts meaning, so the model does not merely miss it but scores it backwards. It is also most common in strongly negative text, which concentrates the errors where accuracy matters most.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt:
            "Translating into a language that requires grammatical gender, from a sentence that specifies none, the system must:",
          choices: [
            "Refuse to translate the sentence",
            "Choose one, often falling back on patterns in its training data",
            "Leave the word untranslated",
            "Ask the user which to use",
          ],
          answer: 1,
          explanation:
            "The target language demands information the source lacks, so something must be supplied. Historically that fallback has reproduced occupational stereotypes present in the training text.",
        },
      ],
    },
  ],
};
