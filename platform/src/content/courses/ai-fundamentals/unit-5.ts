import type { Unit } from "@/content/types";

/**
 * Unit 5: Computer Vision.
 *
 * The first of two units applying Unit 4 to a specific kind of data. The
 * through-line is that an image is a grid of numbers and that the grid's
 * structure is the whole problem: everything convolution does follows from
 * taking seriously that neighboring pixels are related and that a cat is
 * still a cat in the corner of the frame.
 *
 * 5.5 deliberately spends as much time on failures as applications. Facial
 * recognition is the clearest case in the course where a system works well
 * on average and unacceptably for particular groups, and it sets up Unit 7
 * without having to wait for it.
 */

/* ------------------------------------------------------------- figures */

/** An image is a grid of numbers, which has to be seen to be believed. */
const PIXELS_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u5-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g>
    <rect x="40" y="56" width="160" height="160" rx="4"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <g fill="var(--color-ink)">
      <rect x="80" y="86" width="40" height="40" opacity="0.15" />
      <rect x="120" y="86" width="40" height="40" opacity="0.85" />
      <rect x="80" y="126" width="40" height="40" opacity="0.9" />
      <rect x="120" y="126" width="40" height="40" opacity="0.35" />
      <rect x="40" y="56" width="40" height="160" opacity="0.08" />
      <rect x="160" y="56" width="40" height="160" opacity="0.08" />
      <rect x="80" y="56" width="80" height="30" opacity="0.08" />
      <rect x="80" y="166" width="80" height="50" opacity="0.08" />
    </g>
    <text x="120" y="238" text-anchor="middle" font-size="12" fill="var(--color-ink-muted)">
      what you see</text>
  </g>

  <path d="M216 136 L266 136" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u5-a)" fill="none" />

  <g font-size="13" text-anchor="middle">
    <rect x="286" y="56" width="160" height="160" rx="4"
          fill="var(--color-paper)" stroke="var(--color-line-strong)" />
    <g stroke="var(--color-line)">
      <line x1="326" y1="56" x2="326" y2="216" /><line x1="366" y1="56" x2="366" y2="216" />
      <line x1="406" y1="56" x2="406" y2="216" />
      <line x1="286" y1="96" x2="446" y2="96" /><line x1="286" y1="136" x2="446" y2="136" />
      <line x1="286" y1="176" x2="446" y2="176" />
    </g>
    <g fill="var(--color-ink-muted)">
      <text x="306" y="82">12</text><text x="346" y="82">18</text>
      <text x="386" y="82">20</text><text x="426" y="82">15</text>
      <text x="306" y="122">16</text>
    </g>
    <text x="346" y="122" fill="var(--color-ink)" font-weight="600">38</text>
    <text x="386" y="122" fill="var(--color-ink)" font-weight="600">214</text>
    <g fill="var(--color-ink-muted)"><text x="426" y="122">19</text><text x="306" y="162">14</text></g>
    <text x="346" y="162" fill="var(--color-ink)" font-weight="600">226</text>
    <text x="386" y="162" fill="var(--color-ink)" font-weight="600">89</text>
    <g fill="var(--color-ink-muted)">
      <text x="426" y="162">17</text><text x="306" y="202">11</text>
      <text x="346" y="202">13</text><text x="386" y="202">16</text><text x="426" y="202">12</text>
    </g>
    <text x="366" y="238" font-size="12" fill="var(--color-ink-muted)">what the model receives</text>
  </g>

  <g font-size="12" fill="var(--color-ink-muted)">
    <text x="480" y="106">0 is black,</text>
    <text x="480" y="126">255 is white,</text>
    <text x="480" y="146">and that is the</text>
    <text x="480" y="166">entire image.</text>
  </g>

  <text x="320" y="30" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    There is no picture in there. There is a table of brightness values.</text>
</svg>`;

/** Convolution: one window, one number, slide, repeat. */
const CONVOLUTION_SVG = `
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u5-b" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <text x="86" y="52" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-ink-faint)">THE IMAGE</text>
  <rect x="26" y="62" width="150" height="150" rx="3"
        fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
  <g stroke="var(--color-line)">
    <line x1="56" y1="62" x2="56" y2="212" /><line x1="86" y1="62" x2="86" y2="212" />
    <line x1="116" y1="62" x2="116" y2="212" /><line x1="146" y1="62" x2="146" y2="212" />
    <line x1="26" y1="92" x2="176" y2="92" /><line x1="26" y1="122" x2="176" y2="122" />
    <line x1="26" y1="152" x2="176" y2="152" /><line x1="26" y1="182" x2="176" y2="182" />
  </g>
  <rect x="56" y="92" width="90" height="90" fill="var(--color-accent)" opacity="0.18" />
  <rect x="56" y="92" width="90" height="90" fill="none"
        stroke="var(--color-accent)" stroke-width="2.5" />
  <text x="101" y="234" text-anchor="middle" font-size="11" fill="var(--color-accent)">
    one 3×3 window</text>

  <path d="M190 137 L238 137" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u5-b)" fill="none" />

  <text x="306" y="52" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-ink-faint)">THE FILTER</text>
  <rect x="246" y="77" width="120" height="120" rx="6"
        fill="var(--color-accent-soft)" stroke="var(--color-accent-line)" stroke-width="2" />
  <g font-size="13" text-anchor="middle" fill="var(--color-ink)">
    <text x="276" y="104">-1</text><text x="306" y="104">0</text><text x="336" y="104">1</text>
    <text x="276" y="144">-2</text><text x="306" y="144">0</text><text x="336" y="144">2</text>
    <text x="276" y="184">-1</text><text x="306" y="184">0</text><text x="336" y="184">1</text>
  </g>
  <text x="306" y="222" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    nine learned weights</text>

  <path d="M380 137 L428 137" stroke="var(--color-accent)" stroke-width="2"
        marker-end="url(#u5-b)" fill="none" />

  <text x="520" y="52" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-ink-faint)">ONE NUMBER</text>
  <rect x="470" y="107" width="100" height="60" rx="8"
        fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="2" />
  <text x="520" y="144" text-anchor="middle" font-size="17" font-weight="600"
        fill="var(--color-success)">0.9</text>
  <text x="520" y="190" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">
    "an edge is here"</text>

  <text x="320" y="252" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    Slide the same nine weights across the whole image. That is one convolution.</text>
</svg>`;

/** The four vision tasks, which get conflated constantly. */
const TASKS_SVG = `
<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g>
    <rect x="16" y="30" width="136" height="110" rx="6"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="70" cy="86" r="22" fill="var(--color-accent)" opacity="0.5" />
    <rect x="96" y="74" width="34" height="26" rx="4" fill="var(--color-success)" opacity="0.45" />
    <text x="84" y="162" text-anchor="middle" font-size="12" font-weight="600"
          fill="var(--color-ink)">Classification</text>
    <text x="84" y="180" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">"a dog is here"</text>
    <text x="84" y="196" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">one label</text>
  </g>

  <g>
    <rect x="168" y="30" width="136" height="110" rx="6"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="222" cy="86" r="22" fill="var(--color-accent)" opacity="0.5" />
    <rect x="248" y="74" width="34" height="26" rx="4" fill="var(--color-success)" opacity="0.45" />
    <rect x="198" y="62" width="48" height="48" fill="none"
          stroke="var(--color-warning)" stroke-width="2.5" />
    <text x="236" y="162" text-anchor="middle" font-size="12" font-weight="600"
          fill="var(--color-ink)">Localization</text>
    <text x="236" y="180" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">"and it is there"</text>
    <text x="236" y="196" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">one box</text>
  </g>

  <g>
    <rect x="320" y="30" width="136" height="110" rx="6"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="374" cy="86" r="22" fill="var(--color-accent)" opacity="0.5" />
    <rect x="400" y="74" width="34" height="26" rx="4" fill="var(--color-success)" opacity="0.45" />
    <rect x="350" y="62" width="48" height="48" fill="none"
          stroke="var(--color-warning)" stroke-width="2.5" />
    <rect x="396" y="70" width="42" height="34" fill="none"
          stroke="var(--color-warning)" stroke-width="2.5" />
    <text x="388" y="162" text-anchor="middle" font-size="12" font-weight="600"
          fill="var(--color-ink)">Detection</text>
    <text x="388" y="180" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">"and so is that"</text>
    <text x="388" y="196" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">many boxes</text>
  </g>

  <g>
    <rect x="472" y="30" width="136" height="110" rx="6"
          fill="var(--color-surface)" stroke="var(--color-line)" />
    <circle cx="526" cy="86" r="22" fill="var(--color-warning)" opacity="0.75" />
    <rect x="552" y="74" width="34" height="26" rx="4" fill="var(--color-danger)" opacity="0.6" />
    <text x="540" y="162" text-anchor="middle" font-size="12" font-weight="600"
          fill="var(--color-ink)">Segmentation</text>
    <text x="540" y="180" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">"these exact pixels"</text>
    <text x="540" y="196" text-anchor="middle" font-size="11" fill="var(--color-ink-muted)">every pixel labeled</text>
  </g>
</svg>`;

/* -------------------------------------------------------------- lessons */

export const unit5: Unit = {
  id: "aif-u5",
  slug: "computer-vision",
  title: "Computer Vision",
  summary:
    "How a grid of numbers becomes a face, a tumor or a stop sign, and what still goes wrong.",
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The thing that was supposed to be easy

In 1966 a researcher at MIT assigned a summer project: connect a camera to a computer and have it describe what it saw. It was given to a student as a vacation task.

Nearly sixty years later it is not finished.

This is the central surprise of AI, and it has a name. Tasks humans find difficult, like chess or calculus, turned out to be relatively easy for computers. Tasks any toddler performs effortlessly, like recognizing a cup from an unfamiliar angle in poor light, turned out to be extraordinarily hard.

The reason is the one from Unit 2. You can write down the rules of chess. Nobody can write down the rules for recognizing a cup.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Why it is hard

A single object produces wildly different images depending on circumstances that have nothing to do with what it is.

**Viewpoint.** A mug from above, from the side, from behind. Barely any pixels in common.

**Lighting.** The same object at noon and at dusk differs more, pixel by pixel, than two different objects under identical light.

**Scale and occlusion.** Near or far, and usually partly hidden behind something else.

**Variation within the category.** "Chair" includes an office chair, a beanbag and a stool. They share a function, not an appearance.

A person handles all of this without noticing, which is precisely why it resisted hand-written rules for so long: the knowledge being used is not available to introspection.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Why did computer vision prove harder than playing chess at grandmaster level?",
          choices: [
            "Images contain more data than chess positions",
            "The rules of chess can be written down and the rules for recognizing objects cannot",
            "Chess has fewer possible positions",
            "Cameras were not good enough until recently",
          ],
          answer: 1,
          explanation:
            "It is the writability of the rules, not the quantity of data or the size of the search space. Chess has vastly more positions than there are atoms in the observable universe and was still solved first, because its rules are stateable and vision's are not.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## There is no image

The single most useful thing to internalize in this unit is that the model never sees a picture. It receives a table of numbers.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: PIXELS_SVG,
          alt: "On the left, a small grayscale shape as a person would see it. An arrow points to the right, where the same thing is shown as a four by four grid of numbers between 11 and 226. A note explains 0 is black, 255 is white, and that is the entire image.",
          caption:
            "Everything in this unit is arithmetic performed on the right-hand side. The left-hand side exists only for you.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `A grayscale image is a grid of brightness values, conventionally 0 for black through 255 for white. A 1000 by 1000 photograph is a million such numbers.

A color image is three such grids stacked: one for red, one for green, one for blue. These are the **channels**. That same photograph in color is three million numbers.

**Resolution** is the size of the grid. More pixels means more detail and more computation, and models usually shrink images to a fixed small size before processing, often a few hundred pixels on a side. Detail is genuinely lost in that step, which occasionally matters a great deal: a model given a downscaled medical scan cannot see what was in the pixels you discarded.

A **feature**, in this context, is any pattern in those numbers that helps answer the question. A sharp change in brightness across a short distance is an edge. A repeating pattern is a texture. The point of Unit 4's feature learning is that nobody has to define those: the network finds them.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "How many numbers make up a 200 by 300 color photograph?",
          choices: ["500", "60,000", "180,000", "600"],
          answer: 2,
          explanation:
            "200 × 300 = 60,000 pixels, each with three channel values, giving 180,000 numbers. This is why resizing images before training is standard: the raw numbers multiply quickly.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Two photographs of the same red mug, one at noon and one at dusk. What is true of their pixel values?",
          choices: [
            "They will be nearly identical, since it is the same object",
            "They may differ enormously, which is part of why vision is hard",
            "Only the red channel will change",
            "They will be identical after converting to grayscale",
          ],
          answer: 1,
          explanation:
            "Lighting changes every value in every channel. Two photographs of different objects under the same light are often more similar pixel-by-pixel than two photographs of one object under different light, and a model has to learn to see past that.",
        },
      ],
    },

    {
      id: "aif-u5-l3",
      slug: "recognition-and-detection",
      title: "Image Recognition and Object Detection",
      kind: "lesson",
      summary:
        "Classification, localization and detection, and the difference between what and where.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish classification, localization and detection",
        "Explain what a bounding box is and how it is predicted",
        "Choose the right task for a stated goal",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Four different questions

People say "the AI recognizes objects" for four tasks that differ in difficulty and in what they output.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: TASKS_SVG,
          alt: "Four panels showing the same two shapes. Classification gives one label. Localization adds a single box. Detection adds a box around each object. Segmentation colors the exact pixels of each object instead of boxing them.",
          caption:
            "The output gets richer left to right, and so does the labeling effort required to train it. Segmentation needs someone to outline every object by hand.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `**Classification** answers "what is in this image" with a single label. The output is one category, usually with a confidence.

**Localization** adds "and where". The output includes a **bounding box**: four numbers giving the position and size of a rectangle. Note that the model predicts those numbers directly, which makes it partly a regression problem rather than pure classification.

**Detection** handles many objects at once, each with its own box and label, and the number of objects is not known in advance. This is what a self-driving car needs.

**Segmentation** labels every individual pixel rather than drawing rectangles. This is what a medical system outlining a tumor needs, because a box around a tumor does not tell a surgeon where its edge is.

The cost rises sharply along that sequence, and mostly in annotation rather than computation. Classification needs one word per image. Segmentation needs someone to trace around every object in every training image.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "A system must find every pedestrian in a street scene and track where each one is. Which task?",
          choices: [
            "Classification",
            "Localization",
            "Object detection",
            "Segmentation",
          ],
          answer: 2,
          explanation:
            "Many objects, each needing a position, with the count unknown in advance. Classification gives one label for the whole scene and localization assumes a single object, so neither is enough. Segmentation would also work but is more than required for tracking positions.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Why does segmentation require more expensive training data than classification?",
          choices: [
            "Segmentation models need higher resolution images",
            "Every pixel needs a label, so annotators must trace object outlines by hand",
            "Segmentation needs more images in total",
            "Segmentation can only be labeled by specialists",
          ],
          answer: 1,
          explanation:
            "The expense is in annotation effort per image. Writing 'cat' takes a second; outlining a cat precisely takes minutes. Across tens of thousands of images that difference decides whether a project is affordable.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Two problems with the obvious approach

Unit 4 ended on why a plain feedforward network is wrong for images. It is worth restating precisely, because convolution is the answer to these two things specifically.

**Too many parameters.** A 200 by 200 color image is 120,000 inputs. Connect those to a modest hidden layer of 1,000 neurons and you have 120 million weights in the first layer alone. That is unlearnable from any realistic dataset.

**Position dependence.** Each weight belongs to one specific pixel position. A network that has learned to recognize a cat in the center has learned nothing about a cat in the corner, because those are entirely different inputs to entirely different weights.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## What a convolution does

Instead of connecting everything to everything, take a small window, commonly 3 by 3, and slide it across the image.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: CONVOLUTION_SVG,
          alt: "A grid representing the image with a three by three window highlighted. An arrow leads to a three by three filter of nine weights. Another arrow leads to a single output number, 0.9, annotated as meaning an edge is here. Caption notes sliding the same nine weights across the whole image is one convolution.",
          caption:
            "Nine weights, reused at every position. That reuse is the whole trick: it is what makes the parameter count manageable and what makes position stop mattering.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `At each position, multiply the nine pixels under the window by the nine weights of the **filter**, add them up, and write the result into a new grid. Slide one step and repeat.

The resulting grid is a **feature map**, and it answers one question across the entire image: "how strongly does this pattern appear here?"

Both problems vanish. A 3 by 3 filter has nine weights regardless of image size, so parameters drop from millions to a handful. And because the identical filter is applied everywhere, a pattern learned anywhere is recognized everywhere. This property is called translation invariance, and it is why a CNN recognizes a cat in the corner without ever having seen one there.

A layer uses many filters, often dozens or hundreds, each learning a different pattern. The filter's nine weights are learned by exactly the gradient descent from Unit 4. Nobody designs an edge detector; training produces one because edges are useful.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## The hierarchy, and pooling

Stack convolutional layers and something striking happens, which researchers confirmed by visualizing what trained networks respond to.

The first layer learns edges and simple color transitions. The second combines edges into corners, curves and textures. The third assembles those into recognizable parts: wheels, eyes, letters. Later layers combine parts into whole objects.

That hierarchy was not designed. It is what training converges on, and it resembles, at least in outline, what is known about the early visual system, which is one of the few places the biological analogy holds up at all.

**Pooling** sits between convolutional layers and shrinks the grid, typically by taking the largest value in each 2 by 2 block. This cuts computation, and more importantly it makes the network tolerant of small shifts: if a feature moves by one pixel, the pooled output is unchanged. The cost is precision about exactly where things are, which is a trade worth making for classification and a problem for segmentation.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "What is the main reason convolution dramatically reduces the number of parameters?",
          choices: [
            "It processes images at lower resolution",
            "The same small set of weights is reused at every position in the image",
            "It only looks at the center of the image",
            "It converts color images to grayscale",
          ],
          answer: 1,
          explanation:
            "Weight sharing is the mechanism. A 3 by 3 filter is nine weights whether the image is 50 pixels across or 5,000, because the same nine are applied at every position rather than each position having its own.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "A CNN trained on centered photographs of dogs correctly identifies a dog in the corner of a new photograph. Why?",
          choices: [
            "It memorized enough examples to cover every position",
            "Filters are applied at every position, so a pattern learned anywhere is detected anywhere",
            "The image was automatically recentered first",
            "Pooling moved the dog to the middle",
          ],
          answer: 1,
          explanation:
            "Translation invariance follows directly from sliding the same filter everywhere. A plain feedforward network would genuinely need to see dogs in every position, which is one of the clearest demonstrations of why architecture matters.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "What do the early layers of a trained CNN typically detect?",
          choices: [
            "Whole objects like cats and cars",
            "Simple local patterns such as edges and color transitions",
            "The image's overall category",
            "Text within the image",
          ],
          answer: 1,
          explanation:
            "Complexity builds with depth: edges first, then corners and textures, then parts, then objects. The hierarchy emerges from training rather than being specified, and it can be confirmed by visualizing what each layer responds to.",
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Where it works

**Medical imaging** is the clearest success. Models that flag suspicious regions on scans now match or exceed specialist performance on specific, narrow tasks, and the sensible deployments use them to direct a radiologist's attention rather than to decide anything.

**Optical character recognition** turns images of text into text. It was a flagship research problem in the 1970s and is now a feature in your camera app, which is Unit 1's AI effect in one example.

**Industrial inspection** catches defects on production lines faster and more consistently than people, on a task that is repetitive, well-lit and tightly defined. Those three conditions are doing a lot of work.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Facial recognition, and the result that mattered

Facial recognition converts a face into a vector of numbers, a **face embedding**, chosen so that two images of the same person produce nearby vectors and images of different people produce distant ones. Recognition is then a matter of measuring distance, which is the same idea as the word embeddings in Unit 6.

It works well on average, and "on average" is where the problem lives.

Research published in 2018 by Joy Buolamwini and Timnit Gebru tested commercial gender classification systems and found error rates under 1% for lighter-skinned men and up to around 35% for darker-skinned women. One system, one task, and a difference of more than thirty percentage points depending on who was in the photograph.

The cause was not malice and not the algorithm. It was the training data: benchmark face datasets were overwhelmingly lighter-skinned and male, so the models learned those faces well and the others poorly. An aggregate accuracy figure concealed the whole thing, which is exactly the failure mode Unit 2 described when accuracy hides what is happening to a minority class.

This matters more than a typical accuracy gap because of where these systems get deployed: policing, border control, building access. There have been documented wrongful arrests following facial recognition misidentification. A 35% error rate on a photo-tagging feature is an annoyance; the same rate in an identification system is a person in a cell.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A facial recognition system reports 94% overall accuracy. What should you ask before deploying it?",
          choices: [
            "Whether it can process images quickly enough",
            "How accuracy breaks down across different groups of people",
            "How many images it was trained on",
            "Which programming language it uses",
          ],
          answer: 1,
          explanation:
            "A single aggregate number can hide near-perfect performance for the majority group and much worse performance for others. Disaggregated results are the only way to see that, and the 2018 findings are the standard example of why the headline figure is insufficient.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Autonomous vehicles, and the long tail

A self-driving car runs detection, segmentation and tracking continuously, fusing camera data with radar and often lidar, and the ordinary case has largely been solved for years.

The difficulty is the **long tail**: the endless supply of rare situations. A plastic bag blowing across the road. A cyclist carrying a mirror. A traffic officer waving you through a red light. Roadworks with contradictory signage. Each is individually rare and collectively constant, and a model trained on millions of normal miles has seen very few of them.

This is why autonomy has taken so much longer than was repeatedly predicted. Getting to a system that handles 99% of driving took years. The remaining 1% contains the situations where being wrong kills somebody, and it is not a smaller version of the same problem.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "A school proposes facial recognition for attendance. Using this unit, give two specific technical concerns and say what you would want to know before it was installed.",
          modelAnswer: `A strong answer is specific rather than generally uneasy.

Differential accuracy. Performance varies by skin tone, age and gender, and children are underrepresented in most training data. An error here means a present student marked absent, repeatedly, and probably not at random across the student body. I would want accuracy disaggregated by group, measured on students of this age, not a vendor's overall figure.

Conditions. Benchmark accuracy is measured on good photographs. A camera at a doorway deals with motion, backlighting, hats and hoods, and students deliberately testing it. I would want to know the error rate in the actual installation, not in the lab.

What to ask beyond accuracy: what happens to the face data, who can access it, how long it is kept, what the appeal process is for a student wrongly marked absent, and whether anyone consented. A strong answer notices that the technical questions are the easier half, and that an attendance problem probably has solutions that do not involve building a biometric database of children.`,
        },
      ],
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
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

Find a vision system you can use and try to break it on purpose.

Candidates you probably already have: your phone's photo search, which lets you search your library for "dog" or "beach"; a translation app's camera mode, which reads text through the lens; a QR or barcode scanner; your phone's face unlock; any app that identifies plants or products.

Spend about half an hour. Deliberately construct hard cases using this unit's vocabulary: unusual viewpoints, bad lighting, partial occlusion, unusual members of a category, things at the edge of the frame.

Record what you tried and what happened, then answer the questions below.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**What did you break, and how?** Name the system and describe at least three specific inputs that made it fail. Be precise about what you did.",
          modelAnswer: `A strong answer has specific attempts rather than general impressions.

"Photo search for 'cup' missed a mug photographed from directly above, found it from the side." "The plant identifier confidently named a plastic plant." "Text translation worked on printed signs and failed completely on handwriting." "Face unlock failed with sunglasses but worked with a hat."

Weak answers say the system "sometimes gets things wrong". The point of the exercise is to find the boundary, and that means varying one thing at a time.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Why did it fail?** For your clearest failure, explain the cause using this unit's terms: training data, viewpoint, lighting, occlusion, within-category variation, resolution.",
          modelAnswer: `The explanation should name a mechanism.

For an overhead mug: training photographs of mugs are overwhelmingly taken from the side, so the features the network learned, the handle silhouette and the tapering body, are not present in a top-down view. This is a viewpoint failure caused by what the training set contained.

For a plastic plant identified as real: the model learned shape and color, which are identical. The distinguishing features are texture and sheen at a resolution the model probably never received.

A strong answer resists "the AI is not smart enough" and names what specifically was absent from the input or from the training distribution.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**Does the failure pattern fall on anyone in particular?** Look at your failures and ask whether they would affect some people more than others. If not, say so and explain why this application is low-risk.",
          modelAnswer: `Two legitimate answers here, and the reasoning matters more than which.

A pattern exists: handwriting recognition failing on cursive affects older writers; a plant identifier trained on North American and European flora being useless elsewhere; face unlock behaving differently with certain head coverings.

Or honestly no pattern: a barcode scanner failing on damaged barcodes fails for everyone equally, and the cost is rescanning.

A strong answer also separates the failure from the stakes. Photo search missing a mug is nothing. The same error rate in a system that decides who gets through a door is not, and the difference is entirely in deployment rather than in the model.`,
        },
      ],
    },

    {
      id: "aif-u5-q1",
      slug: "unit-quiz",
      title: "Unit 5 Quiz",
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
          prompt: "What does a model actually receive when given an image?",
          choices: [
            "A compressed picture file",
            "A grid of numbers representing brightness, one grid per color channel",
            "A description of the objects in the image",
            "A list of edges and shapes",
          ],
          answer: 1,
          explanation:
            "Pixel values and nothing else. Edges and shapes are things the network derives; they are not supplied.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt: "What is a convolutional filter?",
          choices: [
            "A preprocessing step that removes noise",
            "A small set of weights applied across every position in the image",
            "A layer that reduces image resolution",
            "A rule for deciding image categories",
          ],
          answer: 1,
          explanation:
            "A small window of learned weights, slid across the whole image to produce a feature map. The third option describes pooling.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What problem does weight sharing in a CNN solve?",
          choices: [
            "It makes training data unnecessary",
            "It keeps the parameter count manageable and makes detection independent of position",
            "It removes the need for activation functions",
            "It allows color images to be processed",
          ],
          answer: 1,
          explanation:
            "Both benefits come from the same mechanism. Nine weights serve the entire image, and because they are applied everywhere, a feature learned in one place is found anywhere.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What is pooling for?",
          choices: [
            "Combining the outputs of several networks",
            "Shrinking the feature map, cutting computation and tolerating small shifts",
            "Collecting training images",
            "Merging color channels",
          ],
          answer: 1,
          explanation:
            "Taking the maximum within each small block reduces size and means a feature moving slightly produces the same output. The cost is losing precision about exact position, which matters for segmentation.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "A system must outline the exact boundary of a tumor on a scan. Which task?",
          choices: [
            "Classification",
            "Localization",
            "Detection",
            "Segmentation",
          ],
          answer: 3,
          explanation:
            "Only segmentation labels individual pixels. A bounding box tells a surgeon roughly where to look and nothing about where the edge is, which is the information that matters here.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "The 2018 study of commercial gender classification found error rates varying from under 1% to around 35% across groups. What was the main cause?",
          choices: [
            "The algorithms were poorly designed",
            "Training datasets were dominated by lighter-skinned male faces",
            "The cameras used were low quality",
            "The systems were tested unfairly",
          ],
          answer: 1,
          explanation:
            "Unrepresentative training data. The models learned well-represented faces well and underrepresented faces poorly, and an aggregate accuracy figure hid the difference entirely.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt: "Why has full self-driving taken far longer than predicted?",
          choices: [
            "Cameras are not yet good enough",
            "The rare situations in the long tail are endless and are where errors are most dangerous",
            "Neural networks cannot process video",
            "Regulators have banned the technology",
          ],
          answer: 1,
          explanation:
            "Ordinary driving was handled years ago. The remaining fraction is a vast collection of individually rare events, each underrepresented in training data, and it is precisely the fraction where being wrong is fatal.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt:
            "Which would make a plain feedforward network, rather than a CNN, a reasonable choice?",
          choices: [
            "Classifying high-resolution photographs",
            "Predicting house prices from a table of numeric features",
            "Detecting pedestrians in video",
            "Segmenting medical scans",
          ],
          answer: 1,
          explanation:
            "Tabular features have no spatial structure to exploit, so convolution's assumptions buy nothing. The other three are all image tasks where locality and position independence matter.",
        },
      ],
    },
  ],
};
