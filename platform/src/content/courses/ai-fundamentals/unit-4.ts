import type { Unit } from "@/content/types";

/**
 * Unit 4: Deep Learning and Neural Networks.
 *
 * The unit students arrive most confused about, usually because every
 * popular explanation stops at "it is like a brain", which is both the
 * least accurate thing you can say and the hardest to unlearn. The
 * treatment here states the analogy once, in 4.2, and then takes it apart.
 *
 * 4.4 is the load-bearing lesson. Forward pass, loss, backpropagation and
 * gradient descent are one mechanism described from four angles, and a
 * student who gets it will find Units 5 and 6 are mostly applications of
 * it. It is given thirty minutes and a worked example for that reason.
 */

/* ------------------------------------------------------------- figures */

/** What one neuron actually computes. */
const NEURON_SVG = `
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u4-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g font-size="12" fill="var(--color-ink-muted)">
    <circle cx="48" cy="70" r="16" fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="48" y="75" text-anchor="middle" fill="var(--color-ink)">x₁</text>
    <circle cx="48" cy="130" r="16" fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="48" y="135" text-anchor="middle" fill="var(--color-ink)">x₂</text>
    <circle cx="48" cy="190" r="16" fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="48" y="195" text-anchor="middle" fill="var(--color-ink)">x₃</text>
  </g>

  <g stroke="var(--color-accent)" stroke-width="1.5" fill="none">
    <path d="M64 70 L214 120" marker-end="url(#u4-a)" />
    <path d="M64 130 L214 130" marker-end="url(#u4-a)" />
    <path d="M64 190 L214 142" marker-end="url(#u4-a)" />
  </g>

  <g font-size="12" fill="var(--color-accent)" font-weight="600">
    <text x="134" y="85">w₁</text>
    <text x="134" y="124">w₂</text>
    <text x="134" y="180">w₃</text>
  </g>

  <rect x="222" y="98" width="128" height="66" rx="10"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <text x="286" y="124" text-anchor="middle" font-size="13" font-weight="600" fill="var(--color-ink)">
    add them up</text>
  <text x="286" y="146" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
    then add bias b</text>

  <path d="M350 131 L396 131" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u4-a)" fill="none" />

  <rect x="404" y="98" width="118" height="66" rx="10"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="2" />
  <text x="463" y="124" text-anchor="middle" font-size="13" font-weight="600" fill="var(--color-success)">
    activation</text>
  <text x="463" y="146" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
    bend the result</text>

  <path d="M522 131 L566 131" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u4-a)" fill="none" />
  <circle cx="594" cy="131" r="18" fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <text x="594" y="136" text-anchor="middle" font-size="13" fill="var(--color-ink)">out</text>

  <text x="320" y="32" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Multiply each input by a weight, total them, add a bias, bend the answer.</text>
  <text x="320" y="238" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    The weights and the bias are the only things training changes.</text>
</svg>`;

/** Layers, and where the parameters actually live. */
const LAYERS_SVG = `
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g stroke="var(--color-line-strong)" stroke-width="0.8" opacity="0.55">
    <path d="M96 80 L236 70 M96 80 L236 120 M96 80 L236 170 M96 80 L236 220" />
    <path d="M96 140 L236 70 M96 140 L236 120 M96 140 L236 170 M96 140 L236 220" />
    <path d="M96 200 L236 70 M96 200 L236 120 M96 200 L236 170 M96 200 L236 220" />
    <path d="M96 260 L236 70 M96 260 L236 120 M96 260 L236 170 M96 260 L236 220" />
    <path d="M256 70 L396 95 M256 70 L396 145 M256 70 L396 195" />
    <path d="M256 120 L396 95 M256 120 L396 145 M256 120 L396 195" />
    <path d="M256 170 L396 95 M256 170 L396 145 M256 170 L396 195" />
    <path d="M256 220 L396 95 M256 220 L396 145 M256 220 L396 195" />
    <path d="M416 95 L548 145 M416 145 L548 145 M416 195 L548 145" />
  </g>

  <g fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" stroke-width="1.5">
    <circle cx="86" cy="80" r="11" /><circle cx="86" cy="140" r="11" />
    <circle cx="86" cy="200" r="11" /><circle cx="86" cy="260" r="11" />
  </g>
  <g fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="1.5">
    <circle cx="246" cy="70" r="11" /><circle cx="246" cy="120" r="11" />
    <circle cx="246" cy="170" r="11" /><circle cx="246" cy="220" r="11" />
    <circle cx="406" cy="95" r="11" /><circle cx="406" cy="145" r="11" />
    <circle cx="406" cy="195" r="11" />
  </g>
  <g fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="1.5">
    <circle cx="558" cy="145" r="11" />
  </g>

  <g font-size="12" text-anchor="middle">
    <text x="86" y="36" font-weight="600" fill="var(--color-ink)">Input</text>
    <text x="86" y="52" fill="var(--color-ink-muted)">the data</text>
    <text x="326" y="36" font-weight="600" fill="var(--color-ink)">Hidden layers</text>
    <text x="326" y="52" fill="var(--color-ink-muted)">where the learning lives</text>
    <text x="558" y="36" font-weight="600" fill="var(--color-ink)">Output</text>
    <text x="558" y="52" fill="var(--color-ink-muted)">the answer</text>
  </g>

  <text x="320" y="286" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Every line is one weight. This small network already has 47 of them.</text>
</svg>`;

/** Gradient descent, which is the only part that needs a picture. */
const DESCENT_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <path d="M60 50 Q180 250 320 190 Q460 130 580 60"
        stroke="var(--color-line-strong)" stroke-width="2" fill="none" />

  <circle cx="92" cy="92" r="9" fill="var(--color-danger)" />
  <text x="92" y="72" text-anchor="middle" font-size="12" fill="var(--color-danger)">start</text>

  <circle cx="150" cy="166" r="7" fill="var(--color-warning)" opacity="0.8" />
  <circle cx="200" cy="203" r="7" fill="var(--color-warning)" opacity="0.8" />
  <circle cx="250" cy="213" r="6" fill="var(--color-success)" opacity="0.85" />
  <circle cx="295" cy="203" r="6" fill="var(--color-success)" opacity="0.9" />

  <circle cx="232" cy="215" r="9" fill="var(--color-success)" />
  <text x="232" y="240" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-success)">low error</text>

  <text x="40" y="150" font-size="12" fill="var(--color-ink-muted)" transform="rotate(-90 40 150)">
    how wrong</text>
  <text x="320" y="36" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    Which way is downhill from here? Take a small step that way. Repeat.</text>
  <text x="500" y="200" font-size="12" fill="var(--color-ink-muted)">every possible</text>
  <text x="500" y="216" font-size="12" fill="var(--color-ink-muted)">setting of the weights</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## What "deep" means

Deep learning is machine learning using neural networks with many layers. That is the entire definition. "Deep" refers to the number of layers, nothing more.

It sits inside machine learning, which sits inside AI. A random forest is machine learning and is not deep learning. A three-layer network is deep learning and is not very deep.

What makes it worth its own unit is not the depth itself but what the depth buys.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## The thing it replaced

Unit 3 described feature engineering: a person deciding what to measure. Before deep learning, that was the job.

To build a face detector in 2005 you would hand-design measurements. Edge detectors at various angles. Ratios of light to dark in particular regions. Dozens of carefully chosen numbers, each one somebody's idea about what faces look like. Then you fed those numbers to a classifier. The model was only as good as the features a person thought to include, and if faces turned out to differ in some way nobody had considered, the model simply could not see it.

Deep learning removed that step. You feed in raw pixels. The first layer learns to detect edges, because edges turn out to be useful, not because anyone said so. The next layer combines edges into corners and textures. The next assembles those into parts like eyes and mouths. The last combines parts into faces.

Nobody designed that hierarchy. It is what the network found to be the most efficient route from pixels to the right answer. This is **feature learning**, and it is the real achievement of the field.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "What is the main practical advantage of deep learning over earlier machine learning?",
          choices: [
            "It trains much faster",
            "It learns useful features from raw data instead of needing people to design them",
            "It needs far less data",
            "Its decisions are easier to explain",
          ],
          answer: 1,
          explanation:
            "The other three are all false, and usefully so: deep learning is slower to train, needs far more data, and is considerably harder to explain than a decision tree. Feature learning is what it gives you in exchange for all of that.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## What it costs

Learning features instead of being handed them means the network has to discover them from scratch, and discovery takes examples. Lots of them.

A traditional model with well-chosen features might work on a few thousand rows. A deep network learning features from raw input typically wants tens or hundreds of thousands, and the large ones are trained on far more than that. This is the direct reason Unit 1 named data as one of the three things that changed around 2012.

It also costs interpretability. A decision tree can tell you its reasoning. A network's reasoning is distributed across millions of weights with no readable summary, which is why Unit 7 has a lesson on explainability and why regulated industries often use the simpler model on purpose.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "A clinic has 800 labeled scans and wants to detect a condition. What is the likely problem with training a deep network from scratch?",
          choices: [
            "Neural networks cannot be used for medical images",
            "800 examples is far too few for a network to learn useful features from raw pixels",
            "The scans would need to be converted to text first",
            "Deep learning only works on datasets collected after 2012",
          ],
          answer: 1,
          explanation:
            "Learning features from scratch needs volume, and 800 examples will produce a network that memorizes them. The standard real-world answer is transfer learning: start from a network already trained on millions of general images and adapt it, so the early feature layers are already in place.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## One neuron

An artificial neuron does four things, and all four are arithmetic.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: NEURON_SVG,
          alt: "Three inputs x1, x2, x3 each flow along an arrow labeled with a weight w1, w2, w3 into a box that adds them up and adds a bias, then into a box labeled activation which bends the result, then out. Caption notes the weights and bias are the only things training changes.",
          caption:
            "Four steps, all arithmetic. A large language model is this, many billions of times, arranged in layers.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `It takes some input numbers. It multiplies each by a **weight**, which says how much that input matters. It adds the results together, plus a **bias**, which shifts the whole thing up or down. Then it passes the total through an **activation function**, which bends the result in some way.

That is a neuron. The weights and the bias are its parameters, and they are the only things training ever changes.

On its own a neuron can only draw a straight line between two classes of thing. Everything else comes from connecting many of them.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## The brain analogy, once

The design was loosely inspired by biological neurons, which receive signals, combine them, and fire when the total passes a threshold. The vocabulary comes from that: neuron, activation, firing.

The analogy is worth knowing because it explains the words, and then it should be put down. It is wrong in ways that matter.

A biological neuron is a living cell of enormous complexity, communicating with chemical signals in continuous time, and the brain rewires its physical connections as it learns. An artificial neuron is a multiplication, an addition and a bend, arranged in fixed layers that never change shape, trained by a procedure with no biological equivalent at all.

Artificial networks also have roughly nothing of the brain's scale or efficiency: a human brain runs on about the power of a dim light bulb. Saying a neural network "works like a brain" is like saying a photograph works like an eye. It borrowed an idea and then went somewhere else entirely.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "Which statement about the brain analogy is accurate?",
          choices: [
            "Artificial neural networks closely simulate how biological neurons work",
            "The analogy explains the terminology but the two work very differently",
            "The analogy is exact for small networks and breaks down for large ones",
            "There is no connection at all between the two ideas",
          ],
          answer: 1,
          explanation:
            "The inspiration is real and historical, which is where the words come from. The mechanisms are not alike: fixed layers, backpropagation and floating-point arithmetic have no biological counterpart. The last option overcorrects.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "What does a weight represent in a neural network?",
          choices: [
            "How much memory the neuron uses",
            "How strongly one input influences that neuron's output",
            "How many times the network has been trained",
            "The confidence of the final prediction",
          ],
          answer: 1,
          explanation:
            "A weight scales one incoming value, so a large weight means that input matters a lot to this neuron and a near-zero weight means it is being ignored. Training is the process of finding weights that make the whole network's outputs right.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Layers

Neurons are arranged in layers, and every neuron in a layer receives from every neuron in the one before.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: LAYERS_SVG,
          alt: "A network diagram. Four input circles on the left, then two hidden layers of four and three circles, then one output circle on the right, with lines connecting every circle to every circle in the next layer. Caption notes every line is one weight and this small network has 47 of them.",
          caption:
            "Count the lines. Each is a number that training has to get right, and this is about the smallest network worth drawing.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `The **input layer** is the data: one neuron per feature. For a 28 by 28 pixel image that is 784 input neurons, one per pixel.

The **hidden layers** are the middle. Hidden only means not directly observed: you see what goes in and what comes out, not what any of these are doing. This is where the learned features live.

The **output layer** produces the answer. One neuron for a yes-or-no question, one per category for classification, one for a predicted number.

The small network drawn above has 47 weights. A network that recognizes handwritten digits has tens of thousands. Large language models have hundreds of billions. All of them are found by the same procedure, which is the next lesson.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Why bend the result

The activation function looks like a detail and is not. Without it, the whole network collapses.

Here is why. If every neuron only multiplies and adds, then stacking layers is just doing more multiplying and adding, and the mathematics guarantees that any number of such layers can be flattened into a single layer that does the same thing. A hundred-layer network without activations has exactly the power of a one-layer network: it can draw a straight line and nothing else.

The activation bends the output, and that bend is what makes depth mean something. With it, each layer can transform its input in a way the next layer could not have done alone, and stacking becomes genuinely more powerful.

The common one is **ReLU**, which is almost comically simple: if the number is negative, output zero; otherwise output it unchanged. That is the entire function, and that one kink is sufficient. Its simplicity is a feature, because it is fast to compute billions of times.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "What happens to a ten-layer network if you remove all its activation functions?",
          choices: [
            "It trains more slowly but still works",
            "It becomes mathematically equivalent to a single layer and can only learn straight-line relationships",
            "It becomes more accurate because there is less distortion",
            "Nothing; activation functions only affect the output layer",
          ],
          answer: 1,
          explanation:
            "Stacked multiplications and additions collapse into one multiplication and addition. The non-linearity is the only reason depth adds power, which is why every hidden layer has one.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "A network takes 100x100 grayscale images. How many neurons in the input layer?",
          choices: ["100", "200", "10,000", "It depends on the architecture"],
          answer: 2,
          explanation:
            "One neuron per pixel, and 100 times 100 is 10,000. For a color image it would be 30,000, since each pixel carries three values. This is one reason Unit 5 exists: treating every pixel as an independent input scales badly, and convolutional networks are the fix.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The most important lesson in the unit

Four terms get used constantly and they describe one loop seen from four angles. Taken slowly, in order, none of them is hard.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Step one: the forward pass

Put an example in and let it flow through. Each neuron multiplies its inputs by its weights, adds its bias, applies its activation, and passes the result on. Layer after layer, until the output layer produces a prediction.

The first time you do this the weights are random, so the prediction is meaningless. That is expected.

## Step two: the loss

Compare the prediction to the right answer and reduce the difference to one number. That number is the **loss**, and it measures how wrong the network was on this example.

For a predicted number, the loss might be the squared difference. For a classification, it is usually a measure of how much probability the network assigned to the correct class, punished more harshly the more confidently it was wrong.

Everything that follows exists to make this one number smaller.`,
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Step three: backpropagation

Now the real question. The network has perhaps a million weights, the prediction was wrong, and you need to know which weights to blame and in which direction to move each one.

**Backpropagation** answers that. It works backwards from the loss, layer by layer, computing for each weight how much a small change in that weight would have changed the loss. Those quantities are called **gradients**.

The intuition is a chain of responsibility. The output was too high. Which neurons in the last hidden layer pushed it up? Those neurons were too active, so which weights made them so? Keep going backwards to the input, and every weight ends up with a number saying "nudging you up by a little would change the loss by this much".

It is not searching, and it is not trying combinations. It computes the answer directly, which is why it is fast enough to be used billions of times.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Step four: gradient descent

Gradients tell you which way is downhill. **Gradient descent** takes the step.`,
        },
        {
          id: "b5",
          kind: "figure",
          svg: DESCENT_SVG,
          alt: "A curved valley. A red dot marked start sits high on the left slope, with a series of smaller dots stepping down the curve to a green dot at the bottom marked low error. The vertical axis is labeled how wrong, the horizontal axis every possible setting of the weights.",
          caption:
            "The horizontal axis stands in for every weight at once, which is why this is a cartoon. A real network's landscape has as many dimensions as it has parameters.",
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `Each weight moves a small amount in the direction that reduces the loss. How big that step is, is the **learning rate**, and it is the setting that most often decides whether training works.

Too small and training takes forever. Too large and the steps overshoot the valley, bouncing from one side to the other, and the loss never settles.

Then repeat: next example, forward pass, loss, backpropagation, step. Millions of times.

That is how a neural network learns. There is no insight anywhere in the loop. It is a very large number of very small, locally sensible adjustments, and the thing that emerges at the end is a network that recognizes faces or writes prose. That gap between the simplicity of the mechanism and the complexity of the result is the genuinely surprising fact about modern AI, and it is worth being surprised by rather than glossing over.`,
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "What does backpropagation compute?",
          choices: [
            "The network's prediction for an example",
            "How much each weight contributed to the error, and in which direction to change it",
            "The best architecture for the problem",
            "Which training examples are most useful",
          ],
          answer: 1,
          explanation:
            "It assigns responsibility for the loss backwards through the network, producing a gradient per weight. The first option describes the forward pass, which has to happen before backpropagation can.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "Training loss drops fast at first, then starts jumping up and down without settling. What is the most likely cause?",
          choices: [
            "The learning rate is too high, so steps overshoot",
            "The learning rate is too low, so progress has stalled",
            "There is too much training data",
            "The network has too few layers",
          ],
          answer: 0,
          explanation:
            "Bouncing is the signature of overshooting: each step jumps past the bottom of the valley to the far slope. A learning rate that is too low produces the opposite picture, a loss that falls very slowly but smoothly.",
        },
        {
          id: "b9",
          kind: "written",
          prompt:
            "Explain, in your own words and without equations, how a network goes from random weights to useful ones. Someone who has not taken this course should be able to follow it.",
          modelAnswer: `A model answer has the loop and the scale, and resists making it sound clever.

The network starts with random weights, so its first guesses are nonsense. You show it an example where you know the right answer. It guesses, and you measure how far off it was as a single number.

Then you work backwards through the network to figure out which of its internal numbers pushed the guess in the wrong direction, and by how much. You adjust each of them slightly in the better direction. Slightly matters: a big correction for one example would wreck what it learned from the last one.

Repeat for millions of examples. No single adjustment is intelligent. The result of millions of them is a network whose guesses are usually right.

A strong answer makes clear that nothing in the process understands the task, and that the capability comes from the number of corrections rather than the cleverness of any one.`,
        },
      ],
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
        "Recognize the architectures named in later units",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The shape follows the data

The network in lesson 4.3, where every neuron connects to every neuron in the next layer, is a **feedforward network**, also called a multilayer perceptron. Information moves one way, input to output, with no loops.

It works, and for data that is just a list of unrelated features it is often the right choice. But it has a blind spot that becomes obvious with two kinds of data.

**Images have structure in space.** Pixels next to each other are related; a pixel in the top left and one in the bottom right usually are not. A feedforward network treats all 10,000 pixels as an unordered list, so it has to learn from scratch that adjacency means anything. It also needs a separate weight for every pixel in every position, so a cat in the corner teaches it nothing about a cat in the middle.

**Language has structure in time.** Word order carries meaning, and a sentence can be any length. A feedforward network takes a fixed number of inputs with no notion of sequence.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Three answers

**Convolutional neural networks** handle spatial structure. Rather than connecting every pixel to every neuron, a small window slides across the image looking for one kind of local pattern, and the same window is used everywhere. That means a feature learned in one corner is recognized anywhere, and the number of parameters drops enormously. Unit 5 is about these.

**Recurrent neural networks** handle sequences. The network processes one item at a time and passes a summary of what it has seen so far forward to the next step, which gives it a memory. That memory is also its weakness, since information from early in a long sequence gets diluted. Unit 6 is about these, and about what replaced them.

**Transformers** solved the sequence problem differently, by looking at every position at once and learning which positions matter to which. They now dominate language work and increasingly vision too, and they are the first unit of AI Specializations.

The pattern worth taking away: architecture is a way of building an assumption about the data into the network's shape. Convolution assumes nearby things are related. Recurrence assumes order matters. Getting that assumption right is worth more than depth.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Why is a plain feedforward network a poor choice for images?",
          choices: [
            "It cannot handle numbers as large as pixel values",
            "It treats pixels as an unordered list, so it ignores spatial structure and needs a separate weight per position",
            "It can only process black and white images",
            "It is too slow to train on any image",
          ],
          answer: 1,
          explanation:
            "Both halves matter. It has no built-in notion that neighboring pixels are related, and because each position gets its own weights, recognizing something in a new position has to be learned all over again.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "You are classifying audio clips of varying length as music or speech. Which assumption should the architecture build in?",
          choices: [
            "That all inputs are the same length",
            "That order through time matters, so the architecture should handle sequences",
            "That nearby samples are unrelated",
            "That the output is a continuous number",
          ],
          answer: 1,
          explanation:
            "Audio is a sequence of varying length, so the architecture needs to handle order and variable input size. That points to recurrent or transformer-based approaches, or to converting the audio into a spectrogram image and using a convolutional network, which is a common and slightly sneaky real-world answer.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

You are going to be the network. No code, just arithmetic you can do on paper.

Here is a tiny trained network that decides whether to recommend a jacket. It has two inputs, two hidden neurons and one output.

**Inputs**
- x₁ = temperature in degrees Celsius, divided by 10
- x₂ = 1 if it is raining, 0 if not

**Hidden neuron A**: weights 2.0 on x₁, 0.5 on x₂, bias −1.0
**Hidden neuron B**: weights −1.5 on x₁, 3.0 on x₂, bias 0.0

Both hidden neurons use ReLU: if the total is negative, output 0, otherwise output the total unchanged.

**Output neuron**: weight −1.0 on A, 1.0 on B, bias 0.5. If the result is above 0, recommend the jacket.

Work through the questions below with a pen. The arithmetic is deliberately small.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**Case 1.** It is 20°C and dry, so x₁ = 2.0 and x₂ = 0. Work through both hidden neurons and the output. Does it recommend the jacket? Show your numbers.",
          modelAnswer: `Neuron A: (2.0 × 2.0) + (0.5 × 0) − 1.0 = 3.0. Positive, so ReLU leaves it at 3.0.

Neuron B: (−1.5 × 2.0) + (3.0 × 0) + 0.0 = −3.0. Negative, so ReLU outputs 0.

Output: (−1.0 × 3.0) + (1.0 × 0) + 0.5 = −2.5. Below 0, so no jacket.

Sensible: warm and dry. Notice that neuron B contributed nothing at all, because ReLU switched it off.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Case 2.** It is 5°C and raining, so x₁ = 0.5 and x₂ = 1. Work through it again. What does it decide?",
          modelAnswer: `Neuron A: (2.0 × 0.5) + (0.5 × 1) − 1.0 = 0.5. Positive, stays 0.5.

Neuron B: (−1.5 × 0.5) + (3.0 × 1) + 0.0 = 2.25. Positive, stays 2.25.

Output: (−1.0 × 0.5) + (1.0 × 2.25) + 0.5 = 2.25. Above 0, so yes, recommend the jacket.

Cold and wet gets a jacket, and the decision was driven almost entirely by neuron B.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**What are the hidden neurons doing?** Look at the weights of each. Describe in plain words what each neuron appears to have learned to detect.",
          modelAnswer: `Neuron A has a large positive weight on temperature and a small one on rain. It is a warmth detector: it grows as it gets hotter and is switched off entirely below about 5°C. The output neuron has a negative weight on it, so A is the "it is warm, no jacket" vote.

Neuron B has a negative weight on temperature and a large positive weight on rain. It is a cold-and-wet detector. The output weights it positively, so B is the "jacket" vote.

The decision is a contest between those two votes, with the bias tilting it slightly toward recommending.

A strong answer notices that nobody designed these roles. If this network had been trained rather than invented for the exercise, the division of labor between A and B would be something training arrived at, and there would be no label on either neuron saying what it does.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "**Where was the answer decided?** In case 2, which single weight mattered most? What does this suggest about explaining a real network with a million weights?",
          modelAnswer: `In case 2 the 3.0 weight from rain into neuron B dominates. It alone contributes 3.0 to a neuron that drives the output, and removing it would flip the decision.

The point of the question is the second half. Here you can identify the deciding weight by inspection because there are seven of them. A real network has millions, no neuron has a nameable job, and the decision is spread across all of them at once with no single weight you can point to.

A strong answer connects this to Unit 7. Explainability techniques exist and give you approximations, like which inputs the output was most sensitive to, but there is no exact readable account of why a large network produced a given output. That is a property of the mechanism rather than a gap somebody will fill in later.`,
        },
      ],
    },

    {
      id: "aif-u4-q1",
      slug: "unit-quiz",
      title: "Unit 4 Quiz",
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
          prompt: 'What does the "deep" in deep learning refer to?',
          choices: [
            "The complexity of the problems it solves",
            "The number of layers in the network",
            "How deeply it understands the data",
            "The size of the training dataset",
          ],
          answer: 1,
          explanation:
            "Purely the layer count, and nothing else. It is a structural description, not a claim about understanding.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt: "What are the only things training changes in a network?",
          choices: [
            "The number of layers and neurons",
            "The weights and biases",
            "The training data",
            "The activation functions",
          ],
          answer: 1,
          explanation:
            "Architecture, activations and data are all fixed before training starts. Weights and biases are the parameters, and adjusting them is the entire process.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What does the loss function measure?",
          choices: [
            "How long training has taken",
            "How wrong the network's prediction was on an example",
            "How many layers the network has",
            "How much memory the model uses",
          ],
          answer: 1,
          explanation:
            "It reduces the gap between prediction and truth to a single number, which is the quantity everything that follows tries to make smaller.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "In what order do these happen for one training example?",
          choices: [
            "Loss, forward pass, backpropagation, weight update",
            "Forward pass, loss, backpropagation, weight update",
            "Backpropagation, forward pass, loss, weight update",
            "Forward pass, backpropagation, loss, weight update",
          ],
          answer: 1,
          explanation:
            "You need a prediction before you can measure error, and you need the error before you can assign blame for it. The update comes last, using the gradients backpropagation produced.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt: "Why does a network need non-linear activation functions?",
          choices: [
            "To keep the numbers from getting too large",
            "Without them, any number of layers collapses into the power of one layer",
            "To make training faster",
            "To convert the output into a probability",
          ],
          answer: 1,
          explanation:
            "Stacked linear operations are themselves linear. The non-linearity is the only reason extra layers add any power at all.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "Which architecture builds in the assumption that nearby parts of the input are related?",
          choices: [
            "Feedforward network",
            "Convolutional network",
            "Recurrent network",
            "None; that has to be learned from data",
          ],
          answer: 1,
          explanation:
            "Convolution slides a small window over local regions and reuses the same weights everywhere, which is exactly the assumption that locality matters and that position should not change what counts as a feature.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "What is the learning rate?",
          choices: [
            "How quickly the network's accuracy improves",
            "The size of the step taken when adjusting weights",
            "How many examples are seen per second",
            "The percentage of data used for training",
          ],
          answer: 1,
          explanation:
            "It scales each weight update. Set it too high and training bounces without settling; too low and it crawls. It is the setting that most commonly decides whether training succeeds at all.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt:
            "A network trained on raw photographs develops edge detectors in its first layer. Who decided it should look for edges?",
          choices: [
            "The engineers, when designing the architecture",
            "Nobody; edges turned out to be useful, so training found them",
            "The activation function",
            "The labeling team, when annotating the images",
          ],
          answer: 1,
          explanation:
            "This is feature learning and the central achievement of deep learning. Edges emerge because they are an efficient route from pixels to correct answers, not because anyone specified them.",
        },
      ],
    },
  ],
};
