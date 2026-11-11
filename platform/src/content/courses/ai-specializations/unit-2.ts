import type { Unit } from "@/content/types";

/**
 * Unit 2: Generative AI and Foundation Models
 *
 * Declared but not yet written. Every lesson carries its real title,
 * summary, objectives and estimate, so the outline shows the whole shape
 * of the course and an author picking up a lesson finds the brief already
 * here.
 *
 * Unit 1 is the written pilot. Follow its structure, and the conventions
 * settled on in AI Fundamentals: prose carrying the explanation, figures
 * where the idea has a shape, a quiz after each substantial idea rather
 * than only at the end, and no summary or objectives on a unit quiz, since
 * listing what a quiz checks tells the student what to recall before they
 * have answered anything.
 */
export const unit2: Unit = {
  id: "ais-u2",
  slug: "generative-ai",
  title: "Generative AI and Foundation Models",
  summary:
    "How a model produces an image, a voice or a video that never existed, and what the three main architectures each got right.",
  lessons: [
    {
      id: "ais-u2-l1",
      slug: "introduction-to-generative-ai",
      title: "Introduction to Generative AI",
      kind: "lesson",
      summary:
        "Discriminative against generative, and what a foundation model is for.",
      estimatedMinutes: 25,
      objectives: [
        "Distinguish discriminative from generative models",
        "Define a foundation model and say why the term exists",
        "Identify what makes generation harder than classification",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-l2",
      slug: "image-and-video-generation",
      title: "Image and Video Generation",
      kind: "lesson",
      summary:
        "Text-to-image, how a prompt becomes pixels, and why video is far harder than stills.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how a text prompt conditions image generation",
        "Explain why temporal consistency makes video hard",
        "Assess a generated image for the artifacts that give it away",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-l3",
      slug: "generative-architectures",
      title: "Generative Model Architectures: GANs, VAEs, and Diffusion",
      kind: "lesson",
      summary: "Three answers to one problem, and why diffusion won.",
      estimatedMinutes: 30,
      objectives: [
        "Describe how a GAN's two networks compete",
        "Explain what a VAE's latent space represents",
        "Say how diffusion generates by removing noise, and why it proved more stable",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-l4",
      slug: "audio-and-speech",
      title: "Audio and Speech Generation",
      kind: "lesson",
      summary:
        "Speech synthesis, voice cloning, music, and the consent problem built into all three.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how audio is represented for generation",
        "Explain what voice cloning requires and what it enables",
        "Assess the consent questions specific to a person's voice",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-l5",
      slug: "multimodal-models",
      title: "Multimodal Foundation Models",
      kind: "lesson",
      summary:
        "One model across text, images and audio, and what a shared representation makes possible.",
      estimatedMinutes: 25,
      objectives: [
        "Explain how different modalities are brought into one space",
        "Describe a capability that only multimodal models have",
        "Identify where modality mismatch causes failures",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-c1",
      slug: "spot-the-generated",
      title: "Spot the Generated",
      kind: "connection",
      summary:
        "Test yourself against synthetic media, work out what gave each one away, and find where your judgment fails.",
      estimatedMinutes: 30,
      objectives: [
        "Identify artifacts characteristic of generated media",
        "Explain why detection degrades as generators improve",
        "Judge what provenance would need to look like to help",
      ],
      blocks: [],
    },
    {
      id: "ais-u2-q1",
      slug: "unit-quiz",
      title: "Unit 2 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 15,
      blocks: [],
    },
  ],
};
