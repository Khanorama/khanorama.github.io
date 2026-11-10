import type { Unit } from "@/content/types";

/**
 * Unit 7: AI Ethics and the Real World.
 *
 * The original curriculum had these as two units, ethics and applications.
 * Merging them is the right call and not only a scheduling convenience:
 * taught separately, ethics becomes a module students sit through before
 * getting to the interesting part, and applications becomes a list of
 * impressive things with the harms filed elsewhere. Interleaved, each
 * application lesson lands on a student who has just spent five lessons
 * learning what to ask of it.
 *
 * Every claim about a specific case here is one that was publicly reported
 * and is described at the level of detail the reporting supports. Where a
 * question is genuinely contested, such as what fairness means, the unit
 * says it is contested rather than picking a side and presenting it as
 * settled.
 */

/* ------------------------------------------------------------- figures */

/** Bias is not one thing in one place. */
const BIAS_PIPELINE_SVG = `
<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u7-a" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <g font-size="11" text-anchor="middle">
    <rect x="12" y="78" width="108" height="64" rx="9"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
    <text x="66" y="102" font-size="13" font-weight="600" fill="var(--color-warning)">The world</text>
    <text x="66" y="121" fill="var(--color-ink-muted)">already unequal</text>

    <rect x="144" y="78" width="108" height="64" rx="9"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
    <text x="198" y="102" font-size="13" font-weight="600" fill="var(--color-warning)">Collection</text>
    <text x="198" y="121" fill="var(--color-ink-muted)">who got counted</text>

    <rect x="276" y="78" width="108" height="64" rx="9"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
    <text x="330" y="102" font-size="13" font-weight="600" fill="var(--color-warning)">Labeling</text>
    <text x="330" y="121" fill="var(--color-ink-muted)">whose judgment</text>

    <rect x="408" y="78" width="108" height="64" rx="9"
          fill="var(--color-warning-soft)" stroke="var(--color-warning-line)" />
    <text x="462" y="102" font-size="13" font-weight="600" fill="var(--color-warning)">Training</text>
    <text x="462" y="121" fill="var(--color-ink-muted)">amplified</text>

    <rect x="540" y="78" width="92" height="64" rx="9"
          fill="var(--color-danger-soft)" stroke="var(--color-danger-line)" stroke-width="2" />
    <text x="586" y="102" font-size="13" font-weight="600" fill="var(--color-danger)">Use</text>
    <text x="586" y="121" fill="var(--color-ink-muted)">at scale</text>
  </g>

  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M120 110 L138 110" marker-end="url(#u7-a)" />
    <path d="M252 110 L270 110" marker-end="url(#u7-a)" />
    <path d="M384 110 L402 110" marker-end="url(#u7-a)" />
    <path d="M516 110 L534 110" marker-end="url(#u7-a)" />
  </g>

  <path d="M586 146 L586 184 Q586 196 574 196 L78 196 Q66 196 66 184 L66 148"
        stroke="var(--color-danger)" stroke-width="2" stroke-dasharray="6 4"
        fill="none" marker-end="url(#u7-a)" />
  <rect x="230" y="180" width="192" height="32" rx="8"
        fill="var(--color-paper)" stroke="var(--color-danger-line)" />
  <text x="326" y="201" text-anchor="middle" font-size="12" font-weight="600"
        fill="var(--color-danger)">the output becomes tomorrow's data</text>

  <text x="320" y="34" text-anchor="middle" font-size="13" fill="var(--color-ink-faint)">
    There is no single place to put the fix.</text>
  <text x="320" y="238" text-anchor="middle" font-size="12" fill="var(--color-ink-faint)">
    The loop at the bottom is why these systems entrench rather than merely reflect.</text>
</svg>`;

/** The distinction that decides how much a mistake costs. */
const OVERSIGHT_SVG = `
<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <marker id="u7-b" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-accent)" />
    </marker>
  </defs>

  <text x="24" y="38" font-size="12" font-weight="600" fill="var(--color-success)">ADVISING</text>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="50" width="96" height="48" rx="8"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="72" y="79" fill="var(--color-ink)">Model</text>

    <rect x="160" y="50" width="110" height="48" rx="8"
          fill="var(--color-success-soft)" stroke="var(--color-success-line)" stroke-width="2" />
    <text x="215" y="72" fill="var(--color-success)" font-weight="600">A person</text>
    <text x="215" y="89" fill="var(--color-ink-muted)">who can say no</text>

    <rect x="310" y="50" width="96" height="48" rx="8"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="358" y="79" fill="var(--color-ink)">Outcome</text>
  </g>
  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M120 74 L154 74" marker-end="url(#u7-b)" />
    <path d="M270 74 L304 74" marker-end="url(#u7-b)" />
  </g>
  <text x="426" y="79" font-size="12" fill="var(--color-ink-muted)">an error can be caught</text>

  <line x1="24" y1="126" x2="616" y2="126" stroke="var(--color-line)" />

  <text x="24" y="160" font-size="12" font-weight="600" fill="var(--color-danger)">DECIDING</text>
  <g font-size="12" text-anchor="middle">
    <rect x="24" y="172" width="96" height="48" rx="8"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="72" y="201" fill="var(--color-ink)">Model</text>

    <rect x="160" y="172" width="110" height="48" rx="8"
          fill="var(--color-danger-soft)" stroke="var(--color-danger-line)" stroke-width="2"
          stroke-dasharray="5 4" />
    <text x="215" y="201" fill="var(--color-danger)">nobody</text>

    <rect x="310" y="172" width="96" height="48" rx="8"
          fill="var(--color-surface-raised)" stroke="var(--color-line-strong)" />
    <text x="358" y="201" fill="var(--color-ink)">Outcome</text>
  </g>
  <g stroke="var(--color-accent)" stroke-width="2" fill="none">
    <path d="M120 196 L154 196" marker-end="url(#u7-b)" />
    <path d="M270 196 L304 196" marker-end="url(#u7-b)" />
  </g>
  <text x="426" y="201" font-size="12" fill="var(--color-ink-muted)">an error is the decision</text>
</svg>`;

/* -------------------------------------------------------------- lessons */

export const unit7: Unit = {
  id: "aif-u7",
  slug: "ethics-and-the-real-world",
  title: "AI Ethics and the Real World",
  summary:
    "Who these systems affect, who is accountable when they are wrong, and where they are already deployed at scale.",
  lessons: [
    {
      id: "aif-u7-l1",
      slug: "understanding-ai-ethics",
      title: "Understanding AI Ethics",
      kind: "lesson",
      summary:
        "What responsible AI means in practice, beyond a page on a company website.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what responsible AI commits a builder to",
        "Identify the stakeholders in a deployed system",
        "Apply an ethical question to a concrete system",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Not a separate subject

It is tempting to treat ethics as something considered after a system works. That ordering is the problem. Almost every issue in this unit was decided long before deployment, by choices that looked purely technical at the time.

Which data to use. What to optimize for. Whether a person reviews the output. What happens when someone disagrees with it. Those are engineering decisions and they are the ethics, which is why this unit comes after six units of mechanism rather than instead of them. You cannot evaluate a system you do not understand.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Four questions

Rather than a framework to memorize, four questions that apply to any deployed system.

**Who is affected?** Not just the user. The people a system makes decisions about are often not the people operating it, and they are usually the ones carrying the risk.

**What happens when it is wrong?** Every system is wrong sometimes. The question is what the error costs and who pays it. A music recommender that is wrong wastes three minutes. A bail algorithm that is wrong costs someone their liberty.

**Can the person affected find out and object?** A decision nobody can explain and nobody can appeal is different in kind from one that can be questioned, even if the accuracy is identical.

**Who is accountable?** When a system causes harm, someone should be answerable. "The algorithm decided" is not an answer, and the diffusion of responsibility across the people who built it, bought it and deployed it is one of the genuinely difficult problems here.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A recommendation system and a parole risk assessment both have 85% accuracy. Why do they require different scrutiny?",
          choices: [
            "The parole system processes more data",
            "The consequences of being wrong differ enormously, and the people affected cannot opt out",
            "Recommendation systems are better understood technically",
            "They do not; equal accuracy means equal risk",
          ],
          answer: 1,
          explanation:
            "Accuracy says nothing about what an error costs. A bad recommendation is skipped; a bad risk score affects someone's freedom, is made about them rather than for them, and is not something they chose to be subject to.",
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "Return to the app you examined in Unit 1. Apply the four questions to it. Be specific, especially about who is affected beyond the people using it.",
          modelAnswer: `A strong answer gets past the user to the people affected indirectly.

For a social platform: the users are affected, but so are people being talked about who never signed up, advertisers, moderators reviewing flagged content, and in some cases communities affected by what gets amplified.

On being wrong: distinguish what the company loses from what the user loses from what a third party loses. These are rarely the same and the system is usually optimized for the first.

On objection: can a user find out why they saw something, and is there a route to challenge it that reaches a person? For most consumer systems the honest answer is no, which may be acceptable given the stakes, but should be stated rather than assumed.`,
        },
      ],
    },

    {
      id: "aif-u7-l2",
      slug: "bias-and-fairness",
      title: "Bias, Fairness, and Transparency",
      kind: "lesson",
      summary:
        "Where bias enters, why it survives training, and what explainability can and cannot deliver.",
      estimatedMinutes: 25,
      objectives: [
        "Trace bias from data through to outcome",
        "Explain why fairness has competing definitions",
        "Describe what explainable AI provides",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Bias is not a bug in the code

The word is misleading. Algorithmic bias is rarely a mistake in an algorithm. It is a model accurately learning a pattern that exists in its training data, where that pattern reflects something about the world or about how the data was gathered that we did not want reproduced.

The model is working. That is the difficulty.`,
        },
        {
          id: "b2",
          kind: "figure",
          svg: BIAS_PIPELINE_SVG,
          alt: "Five stages left to right: The world already unequal, Collection who got counted, Labeling whose judgment, Training amplified, Use at scale. A dashed arrow loops from Use back to the start, labeled: the output becomes tomorrow's data.",
          caption:
            "Each stage can introduce bias independently, and the return loop is what turns a reflection of the past into a cause of the future.",
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `Reuters reported in 2018 that Amazon had scrapped an experimental recruiting tool after finding it discriminated against women. It had been trained on resumes submitted over a ten-year period, during which the industry's hires skewed heavily male. The model learned that pattern and reportedly penalized resumes containing the word "women's", as in "women's chess club captain".

Nobody wrote a rule about gender. The model found a correlation that genuinely existed in the data and used it, which is precisely what it was built to do. Amazon did not deploy it.

Note how little removing the obvious field would have helped. Delete gender from the inputs and the model finds **proxies**: a women's college, a sport, a phrasing. In a rich enough dataset almost any protected characteristic can be reconstructed from the other columns, which is why "we do not collect that field" is a weaker protection than it sounds.`,
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `## Fairness has no single definition

This is the part that surprises people, and it is a mathematical result rather than a political position.

You might ask that a system be equally accurate across groups. Or that it flag the same proportion of each group. Or that among those it flags, the same proportion in each group are correct. These all sound like fairness.

When the underlying rates differ between groups, these criteria are mutually incompatible. Satisfying one forces you to violate another. This is not a matter of better engineering; it has been proven.

The 2016 ProPublica analysis of the COMPAS recidivism tool is the standard case. ProPublica found that Black defendants were more likely to be wrongly flagged as high risk, while white defendants were more likely to be wrongly flagged as low risk. The company responded that the tool was equally accurate for both groups, meaning a given score meant the same likelihood of reoffending regardless of race.

Both were correct. They had measured different definitions of fairness, and given different base rates, the tool could not satisfy both. The lesson is not that one side was lying. It is that "is this system fair" is not fully answerable without first deciding which fairness you mean, and that decision is a value judgment that cannot be delegated to the people building it.`,
        },
        {
          id: "b5",
          kind: "prose",
          markdown: `## What explainability gives you

**Explainable AI** covers techniques for saying something about why a model produced an output. They matter: the EU's data protection rules and various sector regulations create expectations around automated decisions, and a decision nobody can account for is hard to contest.

Be clear about what they deliver. As Unit 4 showed by tracing one tiny network, there is no readable account inside a large model. What the techniques produce are approximations: which inputs the output was most sensitive to, which training examples were most similar, what minimal change would have flipped the result.

These are genuinely useful and they are not the reason. A heatmap showing a model attended to the lungs in a chest X-ray is reassuring, but it does not establish that the model is reasoning about lungs rather than about a scanner artifact that happens to appear there. There are documented cases of models achieving high accuracy by picking up on markings or equipment differences between hospitals rather than on anything clinical.`,
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "A hiring model is given no gender field at all. Can it still discriminate by gender?",
          choices: [
            "No, since it has no access to that information",
            "Yes, by using proxies in the other fields that correlate with gender",
            "Only if the training data was deliberately manipulated",
            "Only for applicants who mention gender in their resume",
          ],
          answer: 1,
          explanation:
            "Schools, activities, phrasing and career gaps all carry the signal. With enough correlated columns a protected characteristic can effectively be reconstructed, which is why removing the field is a weak safeguard and why outcomes have to be measured directly.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt:
            "Why could both ProPublica and the COMPAS vendor be correct about fairness?",
          choices: [
            "One of them made an arithmetic error",
            "They used different definitions of fairness, which cannot all be satisfied at once when base rates differ",
            "The data changed between the two analyses",
            "Fairness depends on the jurisdiction",
          ],
          answer: 1,
          explanation:
            "Equal error rates across groups and equal meaning of a given score are both reasonable definitions, and they are mathematically incompatible under differing base rates. Choosing between them is a value judgment, not a technical one.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "A heatmap shows a medical model focused on the correct anatomical region. What does this establish?",
          choices: [
            "The model is reasoning correctly about the anatomy",
            "That those pixels influenced the output, which is weaker than knowing why",
            "The model will generalize to other hospitals",
            "The model is now explainable in a legal sense",
          ],
          answer: 1,
          explanation:
            "Attribution shows where the output was sensitive to the input, not what the model was doing with it. Models have achieved strong scores by keying on scanner artifacts or markings that correlate with diagnosis, and a plausible-looking heatmap does not rule that out.",
        },
      ],
    },

    {
      id: "aif-u7-l3",
      slug: "privacy-and-security",
      title: "Privacy and Security",
      kind: "lesson",
      summary:
        "Consent, data ownership, surveillance, and what it means that a model remembers its training data.",
      estimatedMinutes: 25,
      objectives: [
        "Explain how training data creates privacy risk",
        "Describe meaningful consent for data use",
        "Identify surveillance applications and their trade-offs",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Models remember

A trained model is not a summary that has safely forgotten its inputs. Research has repeatedly shown that models can reproduce parts of their training data, particularly text that appeared rarely or was repeated verbatim. Studies have extracted sequences including contact details and fragments of personal information from large language models by prompting them appropriately.

This matters for two reasons. If personal data goes into training, it may come out, and it will not be obvious that it has. And it collides awkwardly with data protection rights: deleting a record from a database is straightforward, while removing its influence from a trained model generally means retraining, which is expensive enough that it frequently does not happen.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Consent that means something

Most consent for data use is a checkbox beside a document nobody reads. Legally it may suffice; ethically it is thin, for three reasons worth naming.

**Nobody reads it**, and everybody knows nobody reads it, which makes the ritual a shared pretense rather than an agreement.

**You cannot meaningfully decline.** If consenting is required to use a service you need, it is not a free choice.

**Future uses were not described.** Data gathered for one purpose years ago is now training models nobody imagined then. You consented to something that no longer describes what is happening.

This is the context for the dispute over models trained on scraped web content. Material was published for people to read, and is now training systems that compete with the people who wrote it. Whether existing law permits this is being litigated in several jurisdictions and is genuinely unsettled, which the next lesson covers.`,
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Surveillance, and the shape of the argument

Facial recognition in public spaces is the clearest case where capability and acceptability come apart. The arguments for are real: finding missing people, identifying suspects, securing buildings.

The arguments against are structural rather than about accuracy. Unit 5 covered the differential error rates, but suppose those were fixed tomorrow and the system were perfect. Several objections survive.

**Consent is impossible.** You cannot opt out of a public street.

**It inverts the default.** Historically, following a specific person required a reason and resources. Automated recognition makes tracking everyone cheap, which changes what is possible rather than merely what is efficient.

**Chilling effects.** People behave differently when identified, including in lawful activity like attending a protest, and that effect does not require anyone to actually be targeted.

Several cities and jurisdictions have restricted or banned government use of the technology, and others have expanded it. The point for this course is that the disagreement is not about whether the technology works.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "A company trains a model on customer emails, then a customer exercises their right to erasure. What is the difficulty?",
          choices: [
            "Deleting the email is technically impossible",
            "The email's influence is spread through the model's parameters, and removing it generally requires retraining",
            "The data was anonymized so there is nothing to delete",
            "Erasure rights do not apply to email",
          ],
          answer: 1,
          explanation:
            "The record can be deleted from storage easily. The trained model is the problem: there is no way to subtract one example's contribution from the weights, so compliance in the full sense means retraining, which is expensive enough that it is often avoided.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Which objection to public facial recognition would survive a system with perfect accuracy across all groups?",
          choices: [
            "It misidentifies some groups more than others",
            "People in public cannot consent or opt out, and cheap tracking of everyone changes what is possible",
            "The cameras are too expensive",
            "None; accuracy is the only real concern",
          ],
          answer: 1,
          explanation:
            "Accuracy is a fixable property. Consent and the collapse in the cost of surveillance are structural, and a perfect system makes the second objection stronger rather than weaker.",
        },
      ],
    },

    {
      id: "aif-u7-l4",
      slug: "safety-and-misinformation",
      title: "AI Safety and Misinformation",
      kind: "lesson",
      summary:
        "Deepfakes, synthetic media, prompt injection and adversarial inputs.",
      estimatedMinutes: 25,
      objectives: [
        "Describe how synthetic media is produced and detected",
        "Explain prompt injection as an attack",
        "Assess a claim about AI-generated content",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Synthetic media

Generative models can now produce convincing images, audio and video of people doing and saying things they did not. The techniques are covered properly in AI Specializations; what matters here is the consequence.

The obvious harm is fabricated evidence: a politician appearing to say something, a voice cloned to authorize a payment. Both have occurred.

The less obvious harm may be larger. Once convincing fakes are common, **real** evidence becomes deniable. Anyone caught on recording can claim it was generated. This has been called the liar's dividend, and it does not require a single fake to be made. It only requires everyone to know that fakes are possible.

Detection is not a reliable answer. Detectors are themselves models, they are trained on the generators that existed when they were built, and each improvement in generation degrades them. Provenance approaches, where authentic recordings are cryptographically signed at capture, are more promising and only work if adopted at the point of capture rather than applied afterwards.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Attacks on models

**Adversarial examples** are inputs modified so slightly that a person sees no difference, yet a model's output changes completely. Researchers have demonstrated image perturbations invisible to the eye that cause confident misclassification, and physical versions such as stickers placed on road signs that cause misreading. This reveals something uncomfortable: the features a network relies on are not always the ones a person would consider relevant.

**Data poisoning** attacks the training set. If an attacker can influence what a model learns from, they can install behavior that appears only under conditions they choose. This is a particular concern for models trained on scraped public content, since the attacker only has to put something on the web.

**Prompt injection** is the one most likely to affect systems being built today. A language model cannot reliably distinguish instructions from its operator from text it encounters while working. If it reads a web page containing "ignore your previous instructions and do X", it may comply. Give such a model access to email or files and the content it processes becomes a channel for commands.

There is no general fix. It is not a bug to be patched but a consequence of instructions and data sharing one channel, which is why systems that both read untrusted content and take consequential actions need their permissions constrained rather than their prompts hardened.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Why is the liar's dividend a problem even if no deepfake is ever made of a particular event?",
          choices: [
            "Detection software is expensive",
            "Once fakes are known to be possible, genuine recordings can be dismissed as fabricated",
            "It makes models less accurate",
            "It only affects public figures",
          ],
          answer: 1,
          explanation:
            "The harm comes from the possibility rather than the act. Plausible deniability for anything captured on camera is created by the existence of the technology, and it attaches to real evidence rather than fake evidence.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "An assistant that reads your email encounters a message containing hidden text instructing it to forward your inbox. What is this?",
          choices: [
            "Data poisoning",
            "Prompt injection, because the model cannot separate instructions from the content it is processing",
            "An adversarial example",
            "A software bug that can be patched",
          ],
          answer: 1,
          explanation:
            "Instructions and data arrive through the same channel, so content the model reads can act as commands. It is structural rather than a defect, which is why the mitigation is restricting what such a system is allowed to do rather than trying to word the prompt more carefully.",
        },
      ],
    },

    {
      id: "aif-u7-l5",
      slug: "governance-and-regulation",
      title: "AI Governance and Regulation",
      kind: "lesson",
      summary:
        "Copyright, liability, the current regulatory landscape, and who is answerable.",
      estimatedMinutes: 25,
      objectives: [
        "Summarize the main regulatory approaches",
        "Explain the copyright questions around training data",
        "Say who is accountable when a system causes harm",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Who is answerable

A model recommends a loan rejection. The applicant is harmed. Who is responsible?

The company that built the model points to the bank that chose to use it. The bank points to the vendor's accuracy claims. The vendor points to the training data. Everyone in the chain has a reason it was not them, and the applicant has nobody to ask.

This diffusion is the central governance problem. The usual answer is that accountability should rest with whoever deploys a system and benefits from it, regardless of who built it, but establishing that requires law rather than good intentions.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## How jurisdictions are approaching it

Approaches differ substantially, and this is an area where specifics date quickly, so treat what follows as the shape rather than the current state.

The **European Union** passed the AI Act, which entered into force in 2024 and phases in over following years. It is **risk-based**: applications are sorted into tiers, with some uses prohibited outright, high-risk uses such as employment, credit and law enforcement subject to requirements around data quality, documentation and human oversight, and limited-risk uses needing only transparency. The structure is notable because it regulates uses rather than the technology.

The **United States** has no comprehensive federal statute. Governance comes from existing sector law, from state legislation, and from executive action that varies between administrations. Several states have passed their own rules, which creates a patchwork.

Elsewhere approaches range from principle-based guidance to state-directed control, and international coordination remains limited.

For a student the useful takeaway is that the same system can be lawful in one jurisdiction and prohibited in another, and that building something does not mean you may deploy it where you like.`,
        },
        {
          id: "b3",
          kind: "prose",
          markdown: `## Copyright, which is unsettled

Large models are trained on enormous quantities of text, images and code, much of it copyrighted and gathered without a license.

The argument for is that training is transformative: a model learns statistical patterns rather than storing works, which is closer to a person reading than to copying.

The argument against is that the works were used commercially without permission or payment, that models can sometimes reproduce training data closely, and that outputs compete directly with the people whose work was taken.

Litigation is active in several jurisdictions, from authors, artists, news organizations and code hosts. Early rulings have gone in different directions on different questions, and no settled answer exists.

What can be said now: the legal position is genuinely uncertain rather than merely contested, the ethical question of whether creators should be compensated is separable from the legal one, and anyone who tells you this is clearly resolved either way is describing their preference.`,
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What characterizes the EU AI Act's approach?",
          choices: [
            "It bans all high-risk AI systems",
            "It sorts applications by risk level and imposes obligations proportionate to that risk",
            "It regulates which algorithms may be used",
            "It applies only to systems built within the EU",
          ],
          answer: 1,
          explanation:
            "Risk tiering is the defining feature: a few uses prohibited, high-risk uses subject to substantial requirements, lower-risk uses to transparency. It regulates applications rather than techniques, so the same model can fall into different tiers depending on what it is used for.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "What is the strongest statement that can be made about the legality of training on copyrighted material?",
          choices: [
            "It is clearly legal as transformative use",
            "It is clearly illegal without a license",
            "It is being actively litigated with no settled answer, and rulings have differed",
            "It depends only on whether the model reproduces the work exactly",
          ],
          answer: 2,
          explanation:
            "Cases are ongoing in multiple jurisdictions with varying outcomes on different questions. Confident claims in either direction are advocacy. The ethical question of compensation is also separable and does not turn on how the legal one resolves.",
        },
      ],
    },

    {
      id: "aif-u7-l6",
      slug: "ai-in-healthcare",
      title: "AI in Healthcare and Science",
      kind: "lesson",
      summary:
        "Medical imaging, diagnostics, drug discovery, and why the stakes change the engineering.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how AI is used in medical imaging",
        "Explain why clinical deployment demands more than accuracy",
        "Assess a medical AI claim critically",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## What is working

**Imaging** is the most mature application. Models detect diabetic retinopathy from retinal photographs, flag suspicious regions on mammograms, and triage scans so urgent cases are read first. Several have regulatory approval, and the well-designed deployments assist a clinician rather than replacing one.

**Protein structure prediction** is the clearest scientific success. Determining a protein's three-dimensional shape experimentally took months or years per protein. DeepMind's AlphaFold reached accuracy comparable to experimental methods for many proteins, and predicted structures have been released for a very large number of known proteins. Its creators shared the 2024 Nobel Prize in Chemistry for the work. This is a genuine case of AI accelerating fundamental science rather than optimizing a business process.

**Drug discovery** uses models to narrow enormous chemical spaces to candidates worth synthesizing. Candidates identified with machine learning assistance have entered clinical trials, though the long validation pipeline means claims about end-to-end transformation remain ahead of the evidence.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Why accuracy is not enough here

A model matching specialist performance in a study frequently disappoints in a hospital, and the reasons are instructive.

**Distribution shift.** Trained on one hospital's scanners and patient population, deployed on another's. Unit 3's point about who is in the data, with clinical consequences.

**The base rate problem.** A model validated on a dataset where 30% of cases are positive behaves differently in screening where 0.3% are. Precision collapses even with identical sensitivity, and a flood of false positives means real anxiety and unnecessary procedures.

**Automation bias.** Clinicians under time pressure defer to the machine. "A human reviews it" stops being a safeguard when the human has forty seconds and the system is usually right. The safeguard requires time and permission to disagree.

**Shortcut learning.** Models have achieved strong scores by keying on markings, scanner differences or positioning that correlate with diagnosis in the training set and carry no clinical meaning. These fail completely elsewhere, and they look excellent until they do.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "A model is 94% accurate on a validation set with 30% positives. In screening with 0.3% positives, what most likely happens?",
          choices: [
            "Accuracy improves because most cases are negative",
            "Most positive flags are false alarms, since the rare true cases are swamped by false positives",
            "Performance is unchanged",
            "It can no longer detect the condition at all",
          ],
          answer: 1,
          explanation:
            "This is Unit 2's precision problem with a hundredfold change in base rate. Even a small false positive rate applied to a huge negative population produces far more false alarms than true detections, which means anxiety, cost and follow-up procedures for healthy people.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "Why can 'a clinician reviews every output' fail as a safeguard?",
          choices: [
            "Clinicians are not qualified to assess AI",
            "Automation bias means an overloaded reviewer defers to a usually-correct system",
            "The model's output is always hidden from clinicians",
            "Review is prohibited by regulation",
          ],
          answer: 1,
          explanation:
            "Review protects only if the reviewer has time, information and institutional backing to disagree. A system right 95% of the time trains its reviewers to agree, which is precisely when the remaining 5% gets through unchallenged.",
        },
      ],
    },

    {
      id: "aif-u7-l7",
      slug: "ai-in-business",
      title: "AI in Business and Finance",
      kind: "lesson",
      summary:
        "Fraud detection, forecasting, recommendation and credit scoring.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how fraud detection works",
        "Explain the risk in automated credit decisions",
        "Identify where a human must stay in the loop",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Fraud detection, a good fit

Card fraud detection is close to an ideal machine learning problem. Enormous volume, clear labels arriving from chargebacks, patterns too subtle and shifting for hand-written rules, and decisions needed in milliseconds.

It is also a clean illustration of precision against recall. Miss fraud and the bank loses money. Flag too aggressively and legitimate cards decline at checkout, which customers hate. The threshold is tuned deliberately, and the choice is commercial rather than technical.

Note the feedback loop: fraudsters adapt to whatever the system catches. The data distribution shifts because the system exists, which means retraining is permanent rather than occasional.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Credit scoring, a harder case

Automated credit decisions affect housing, transport and business formation, and they carry every problem from lesson 7.2.

Training data is historical lending decisions, which encode where institutions chose to lend. Proxies reconstruct protected characteristics from postcode, education and employment history. And the decision is frequently made with no human in the loop, which brings us to the distinction that does most of the work in this unit.`,
        },
        {
          id: "b3",
          kind: "figure",
          svg: OVERSIGHT_SVG,
          alt: "Two rows. In Advising, the model passes to a person who can say no, then to the outcome, annotated: an error can be caught. In Deciding, the model passes through a dashed box marked nobody straight to the outcome, annotated: an error is the decision.",
          caption:
            "The same model can occupy either row. Which row it is in is a deployment choice, and it matters more than the accuracy figure.",
        },
        {
          id: "b4",
          kind: "prose",
          markdown: `A model **advising** a loan officer is a tool. Its errors are caught sometimes, the officer can weigh things the model cannot see, and there is a person to ask.

The same model **deciding** is something else. There is no point at which anyone notices a pattern of rejections, no one to ask, and often no record of why.

Several regulatory frameworks treat this distinction as decisive, placing requirements on automated decisions with legal or similarly significant effects that do not apply when a person is genuinely involved. The word "genuinely" is doing real work: a rubber stamp is not oversight, which is the automation bias point from the previous lesson in a different setting.`,
        },
        {
          id: "b5",
          kind: "quiz",
          prompt:
            "Why does the advising-versus-deciding distinction matter more than the accuracy figure?",
          choices: [
            "Advising systems are always more accurate",
            "With a person who can genuinely overrule it, errors can be caught and questioned; without one, an error simply is the outcome",
            "Deciding systems are illegal everywhere",
            "It does not; accuracy is what matters",
          ],
          answer: 1,
          explanation:
            "The same model at the same accuracy produces very different situations depending on whether anyone can intervene. The qualifier matters: a reviewer with no time or no authority to disagree provides the appearance of oversight and not the substance.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "Fraud detection models need frequent retraining mainly because:",
          choices: [
            "Hardware improves over time",
            "Fraudsters adapt to what gets caught, so the patterns change in response to the system",
            "Transaction volumes grow",
            "Regulations change often",
          ],
          answer: 1,
          explanation:
            "The adversary responds to the defense, so the data distribution shifts precisely because the model is working. This is distribution shift driven by the system's own existence, which is different from data merely going stale.",
        },
      ],
    },

    {
      id: "aif-u7-l8",
      slug: "ai-in-education",
      title: "AI in Education and Everyday Life",
      kind: "lesson",
      summary:
        "Personalized learning, tutoring systems, assistants, and what they measure.",
      estimatedMinutes: 20,
      objectives: [
        "Describe how adaptive learning systems work",
        "Assess the evidence behind personalized learning claims",
        "Judge AI tools you use as a student",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Adaptive learning

An adaptive system models what a student knows and selects what to show next: more practice where they are struggling, skipping what they have demonstrated. The mechanism is ordinary supervised learning, with past student interactions as training data.

The appeal is obvious, since individual tutoring is effective and does not scale. The evidence is more mixed than marketing suggests: results vary considerably by subject, implementation and what is being compared against, and the strongest results tend to come from narrow, well-defined domains like arithmetic drill rather than from open-ended learning.

The deeper problem is what gets measured. A system optimizes what it can observe: exercises completed, questions answered correctly, minutes on task. None of those is learning. They correlate with it, imperfectly, and a system optimizing them will eventually find ways to raise the proxy without raising the thing it stands for.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Language models as study tools

Worth being direct, since you are a student reading this on a platform that could have been built differently.

A language model will answer your homework question. Whether that helps depends entirely on what you do next. Used to check your reasoning after attempting something, or to have a concept re-explained differently, it is genuinely valuable and better than most alternatives at 2am. Used to produce an answer you submit, it has removed the part where learning happens.

This is not a lecture about cheating. It is the retrieval effect: struggling to recall or derive something is what consolidates it. Reading a correct answer feels like learning and reliably is not, which is why this course asks you to commit to a quiz answer before showing you the explanation.

Also remember Unit 2: these models predict plausible text. They are fluent on subjects they are wrong about, and confidence in the output carries no information about correctness. AI Specializations has a whole unit on this.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "An adaptive learning platform reports students complete 40% more exercises. What does this establish about learning?",
          choices: [
            "Students learned 40% more",
            "Very little; completion is a proxy that can rise without understanding rising",
            "The platform is well designed",
            "Students enjoy it more",
          ],
          answer: 1,
          explanation:
            "Exercises completed is observable and learning is not, so systems optimize the former. More completions could mean more engagement, or easier exercises, or students finding the path of least resistance. Establishing learning needs independent assessment, ideally delayed, of material the system did not select.",
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "Describe a specific way you have used an AI tool for schoolwork that genuinely helped you learn, and a way that felt productive but probably did not. Be honest.",
          modelAnswer: `No model answer can match your experience, so this describes what a thoughtful one contains.

The helpful use usually involves the tool after your own attempt: explaining why your reasoning broke, offering a different analogy for something that did not land, or generating practice problems you then solve yourself.

The unhelpful use usually involves the tool before or instead of the attempt. Reading a worked solution produces a strong feeling of understanding that mostly evaporates, because recognition is not recall.

A strong answer is specific about the mechanism rather than moralizing. "I asked it to summarize the chapter and felt prepared, then could not answer anything in the test" is a better answer than "using AI is bad", and it is the kind of observation that actually changes what you do next time.`,
        },
      ],
    },

    {
      id: "aif-u7-l9",
      slug: "robotics",
      title: "Robotics and Autonomous Systems",
      kind: "lesson",
      summary:
        "Embodied AI, autonomous vehicles, and why the physical world is harder than the screen.",
      estimatedMinutes: 25,
      objectives: [
        "Explain what makes embodied AI harder",
        "Describe the sensing and decision stack of an autonomous vehicle",
        "Assess an autonomy claim against its operating conditions",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Why the physical world is harder

**Embodied AI** means systems that act in the physical world. Everything is harder there, for reasons that are not about the algorithms.

**Mistakes are not undoable.** A wrong word can be deleted. A robot arm that has moved has moved.

**Sensors are noisy and fail.** Cameras are blinded by sun, lidar struggles in heavy rain, and a system has to keep working while one input degrades.

**There is no pause.** A vehicle traveling at speed cannot wait for a better answer.

**Simulation is not reality.** Training in simulation is standard because real-world trials are slow and dangerous, but a policy that works in simulation often fails on real hardware. The gap has a name, the reality gap, and closing it is a research field.

A useful observation: the hardest problems in robotics are frequently the ones humans find trivial. Walking over uneven ground. Picking up something soft without crushing it. Unit 5's point about vision, generalized to the whole body.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## The stack in a self-driving car

Four layers, each using material from earlier units.

**Perception** turns sensor data into a model of the surroundings, using the detection and segmentation of Unit 5 across cameras, radar and often lidar. Fusing disagreeing sensors is its own problem.

**Prediction** guesses what everything else will do next. This is the genuinely hard part, because it requires modeling intent: is that pedestrian about to step out?

**Planning** chooses a path given those predictions.

**Control** executes it through steering, acceleration and braking.

Levels of autonomy run from 0 to 5. Most systems sold to consumers today are level 2, meaning the driver must remain engaged and responsible. Limited level 4 services, which require no human attention, operate in specific mapped areas under specific conditions. The gap between "autonomous within a mapped city in good weather" and "autonomous anywhere" is the long tail from Unit 5, and it is the whole remaining problem.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "Which part of the self-driving stack requires inferring what other road users intend?",
          choices: ["Perception", "Prediction", "Planning", "Control"],
          answer: 1,
          explanation:
            "Perception establishes what is there; prediction asks what it will do, which means reasoning about intent from posture, speed and context. It is widely considered the hardest layer, because people are not always predictable and the model has no access to what they are thinking.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt:
            "A company advertises 'full autonomy' for a system that requires a driver ready to take over. What is wrong?",
          choices: [
            "Nothing; the terms mean the same thing",
            "A system needing a ready human is level 2 driver assistance, and the naming encourages exactly the disengagement that makes it unsafe",
            "Full autonomy requires lidar specifically",
            "The claim is fine if the system is accurate enough",
          ],
          answer: 1,
          explanation:
            "The safety case for level 2 depends on an attentive driver, and language implying autonomy undermines the thing it depends on. Worse, a system that handles almost everything makes sustained attention psychologically very hard, which is the automation bias problem at highway speed.",
        },
      ],
    },

    {
      id: "aif-u7-l10",
      slug: "emerging-technologies",
      title: "Emerging AI Technologies",
      kind: "lesson",
      summary:
        "Edge AI, AI in cybersecurity, and the industry-specific systems arriving now.",
      estimatedMinutes: 20,
      objectives: [
        "Explain what edge AI is and why it matters",
        "Describe AI's role on both sides of cybersecurity",
        "Identify an emerging application and its risks",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## Edge AI

**Edge AI** runs models on the device rather than sending data to a server. Your phone's face unlock, offline voice recognition, and camera processing all work this way.

The advantages are concrete. Data never leaves the device, which is a genuine privacy improvement rather than a policy promise. There is no network latency, which matters when something must respond immediately. And it works offline.

The constraint is size. Phone hardware cannot run the largest models, so edge deployment uses smaller or compressed versions, which are less capable. The usual pattern is a small local model handling common cases and escalating harder ones to a server, which reintroduces the privacy question for exactly the cases most likely to be sensitive.`,
        },
        {
          id: "b2",
          kind: "prose",
          markdown: `## Cybersecurity, both directions

Defensively, anomaly detection flags unusual behavior on a network, which is unsupervised learning from Unit 2 applied to login patterns and traffic.

Offensively, the same capabilities assist attackers. Generative models make convincing phishing cheap and remove the spelling errors people were taught to look for. Voice cloning has been used in fraud. Automated vulnerability discovery helps defenders and attackers equally.

This is the clearest **dual-use** case in the course: the same capability serves both sides, and improvements accrue to whoever deploys them faster. There is no version of this technology that helps only defenders.`,
        },
        {
          id: "b3",
          kind: "quiz",
          prompt:
            "What is the main privacy advantage of running a model on-device?",
          choices: [
            "On-device models are more accurate",
            "The data never leaves the device, so there is nothing transmitted to be intercepted or retained",
            "On-device models cannot be hacked",
            "It uses less battery",
          ],
          answer: 1,
          explanation:
            "It is structural rather than a promise: data that is never sent cannot be stored, breached or repurposed. The trade is capability, since device hardware limits model size, and hybrid designs that escalate hard cases to a server reopen the question for those cases.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "What does it mean that AI in cybersecurity is dual-use?",
          choices: [
            "It can be used by two different companies",
            "The same capabilities serve attackers and defenders, so advances help both",
            "It requires two separate models",
            "It works on both phones and servers",
          ],
          answer: 1,
          explanation:
            "Generation, anomaly detection and automated analysis are useful to whoever holds them. No version of the capability is available only to defenders, which means the question is who adopts faster rather than whether the technology is beneficial.",
        },
      ],
    },

    {
      id: "aif-u7-c1",
      slug: "who-does-it-affect",
      title: "Who Does It Affect?",
      kind: "connection",
      summary:
        "Return to the app from Unit 1, with everything since. Who is harmed when it is wrong, and what can they do about it?",
      estimatedMinutes: 35,
      objectives: [
        "Identify who bears the cost of a system's errors",
        "Evaluate what recourse exists for an affected person",
        "Write a specific, evidenced critique of a deployed system",
      ],
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `## The brief

In Unit 1 you picked an app and worked out where the AI was. Go back to it.

You know considerably more now. You know what it means that the system was trained on data someone collected, that its accuracy is an average over people who are not evenly represented, that its objective is a measurable proxy for something else, and that whether a person reviews its output is a choice somebody made.

Open it again and answer the four questions below. This is the last activity in the course, so take the time.

If the Unit 1 app turns out to be too trivial to sustain this, pick something with higher stakes that you have direct experience of: a school platform, a bank, a government service, a hiring portal.`,
        },
        {
          id: "b2",
          kind: "written",
          prompt:
            "**What does it get wrong, and who absorbs it?** Describe a specific failure this system makes. Not a hypothetical: something you have seen or can reasonably infer. Who carries the cost, and is it the same person who benefits from the system working?",
          modelAnswer: `A strong answer separates the parties, because they are usually different.

For a content moderation system: the company benefits from automated moderation at scale. The cost of a false positive is carried by the person whose post was removed, who may have no idea why. The cost of a false negative is carried by whoever was harassed.

For a recommendation feed: the company benefits from engagement. A user who is shown progressively narrower content pays a cost they may never detect, because you cannot notice what you were not shown.

The sharpest version identifies a case where the person bearing the cost is not a customer and never agreed to anything.`,
        },
        {
          id: "b3",
          kind: "written",
          prompt:
            "**Is it advising or deciding?** Does a person review the output before it affects anyone? If there is a review, do you believe it is genuine, given the volume involved?",
          modelAnswer: `Most consumer systems decide alone, and for low stakes that is fine.

The question to press on is the second one. Many systems advertise human review that cannot be real at the volume they operate: a platform removing millions of posts a day cannot have a person considering each one carefully, so the review is a queue with seconds per item, which is the automation bias problem from 7.6.

A strong answer distinguishes review that could catch an error from review that exists to be cited. Asking "how many items per hour would a reviewer have to clear" is usually enough to settle it.`,
        },
        {
          id: "b4",
          kind: "written",
          prompt:
            "**What recourse exists?** If this system treats someone wrongly, can they find out it happened, find out why, and get it changed? Try to find the actual appeal process rather than assuming.",
          modelAnswer: `Go and look, because the gap between stated and real process is the finding.

Three separate questions, often with three different answers. Finding out it happened: frequently no, since you are not told your application was filtered or your post was downranked. Finding out why: almost never in any specific way, partly for the Unit 4 reason that no specific account exists. Getting it changed: sometimes there is a form, and what matters is whether it reaches a person and whether anyone has to respond.

A strong answer quotes what the company actually says and notes what it does not say. "You may appeal" without a timeframe, a named decision-maker or any commitment to respond is close to nothing, and noticing that is the skill this activity is for.`,
        },
        {
          id: "b5",
          kind: "written",
          prompt:
            "**What would you change?** Propose one specific, realistic change that would reduce the harm without making the system useless. Say what it would cost and who would resist it.",
          modelAnswer: `The constraint is the point. "Remove the algorithm" is not a proposal; it is a refusal to engage with why it exists.

Strong proposals are narrow: require a human decision before any permanent account removal; publish accuracy broken down by group; tell users which of their actions drove a recommendation; give a named route of appeal with a response deadline.

Then be honest about cost. Human review costs money per item. Publishing disaggregated accuracy invites scrutiny and liability. Appeal processes need staff. Someone will resist, usually for reasons that are commercially rational rather than malicious.

The best answers end up sympathetic to the difficulty while still holding the position that the cost should be borne by whoever benefits from the system rather than by whoever it gets wrong.`,
        },
        {
          id: "b6",
          kind: "prose",
          markdown: `## The end of the course

You began seven units ago with a definition of artificial intelligence and no way to evaluate anything anyone told you about it. You can now say what a model is, how one is trained, what its data does to it, how vision and language work, and what questions to ask of a system before trusting it.

The most useful thing you have is not any single fact in here. It is that you are now difficult to impress with a demonstration and difficult to reassure with an accuracy figure, and that combination is rarer than it should be.

If you want the rest of the machinery, AI Specializations starts at transformers and goes through generative models, why systems make things up, retrieval, agents, and where this is all heading.`,
        },
      ],
    },

    {
      id: "aif-u7-q1",
      slug: "unit-quiz",
      title: "Unit 7 Quiz",
      kind: "unitQuiz",
      estimatedMinutes: 20,
      blocks: [
        {
          id: "b1",
          kind: "prose",
          markdown: `Ten questions, covering the whole unit and drawing on the rest of the course.

Commit to an answer before you check it. You can retry anything you miss.`,
        },
        {
          id: "b2",
          kind: "quiz",
          prompt: "Why is algorithmic bias usually not a coding error?",
          choices: [
            "Because the code is tested thoroughly",
            "Because the model is correctly learning a real pattern in data that reflects something we did not want reproduced",
            "Because bias only comes from users",
            "Because models cannot be biased, only people can",
          ],
          answer: 1,
          explanation:
            "The model works as designed. It finds patterns in its training data, and where that data carries historical inequality or collection skew, the pattern it finds is real and the outcome is still unacceptable.",
        },
        {
          id: "b3",
          kind: "quiz",
          prompt: "Removing a protected characteristic from a model's inputs:",
          choices: [
            "Guarantees the model cannot discriminate on it",
            "Is weak protection, because correlated fields act as proxies",
            "Makes the model more accurate",
            "Is required by law everywhere",
          ],
          answer: 1,
          explanation:
            "Postcode, school, activities and phrasing can reconstruct the characteristic. The only way to know is to measure outcomes across groups directly rather than trusting that the information is absent.",
        },
        {
          id: "b4",
          kind: "quiz",
          prompt: "The COMPAS dispute showed that:",
          choices: [
            "One party had miscalculated",
            "Different reasonable definitions of fairness cannot all hold at once when base rates differ",
            "Risk assessment tools are always inaccurate",
            "Fairness is impossible to measure",
          ],
          answer: 1,
          explanation:
            "Equal error rates and equal predictive meaning are both defensible and mutually incompatible under differing base rates. Which to prioritize is a value judgment that cannot be resolved by better engineering.",
        },
        {
          id: "b5",
          kind: "quiz",
          prompt: "What does an explainability heatmap actually tell you?",
          choices: [
            "The model's reasoning, in full",
            "Which parts of the input the output was most sensitive to",
            "Whether the model is accurate",
            "Whether the model is fair",
          ],
          answer: 1,
          explanation:
            "Sensitivity, not reasoning. A model keying on a scanner artifact can produce an anatomically plausible heatmap, so attribution constrains explanations without establishing one.",
        },
        {
          id: "b6",
          kind: "quiz",
          prompt:
            "An assistant reads a document containing instructions aimed at it and follows them. This is:",
          choices: [
            "Data poisoning",
            "An adversarial example",
            "Prompt injection, arising because instructions and data share one channel",
            "A bug that a patch will fix",
          ],
          answer: 2,
          explanation:
            "It is structural. Since the model cannot reliably tell operator instructions from content it is processing, the mitigation is limiting what such a system is permitted to do rather than hardening the wording of its prompt.",
        },
        {
          id: "b7",
          kind: "quiz",
          prompt: "The liar's dividend refers to:",
          choices: [
            "Profits made from selling deepfake software",
            "Real evidence becoming deniable once convincing fakes are known to be possible",
            "The cost of detecting synthetic media",
            "Models fabricating facts",
          ],
          answer: 1,
          explanation:
            "The harm comes from the possibility rather than from any particular fake. Plausible deniability attaches to genuine recordings, which is a second-order effect that detection tools do not address.",
        },
        {
          id: "b8",
          kind: "quiz",
          prompt:
            "A model validated at 30% positive prevalence is deployed in screening at 0.3%. What happens to precision?",
          choices: [
            "It improves",
            "It falls sharply, because false positives now vastly outnumber true ones",
            "It is unchanged",
            "It depends on the architecture",
          ],
          answer: 1,
          explanation:
            "Sensitivity can be identical while precision collapses, because a small error rate applied to an enormous negative population generates far more false alarms than there are real cases to find.",
        },
        {
          id: "b9",
          kind: "quiz",
          prompt: "Which best describes the EU AI Act's structure?",
          choices: [
            "It bans specific algorithms",
            "It tiers obligations by the risk of the application, from prohibited through high-risk to minimal",
            "It applies only to generative AI",
            "It requires all models to be open source",
          ],
          answer: 1,
          explanation:
            "Use-based risk tiering, not technology-based rules. The same model can sit in different tiers depending on what it is deployed to do.",
        },
        {
          id: "b10",
          kind: "quiz",
          prompt:
            "A consumer car system requires an attentive driver. Marketing it as full autonomy is dangerous because:",
          choices: [
            "The system is not accurate enough",
            "Its safety depends on attention that the naming, and the system's own competence, both undermine",
            "Regulators have not approved the term",
            "It increases insurance costs",
          ],
          answer: 1,
          explanation:
            "A system handling almost everything makes sustained vigilance very hard, and language implying autonomy encourages exactly the disengagement the safety case relies on not happening.",
        },
        {
          id: "b11",
          kind: "quiz",
          prompt:
            "Across this course, which single question most changes how much scrutiny a deployed model deserves?",
          choices: [
            "Which architecture it uses",
            "How many parameters it has",
            "Whether a person who can genuinely overrule it stands between the output and the person affected",
            "Which company built it",
          ],
          answer: 2,
          explanation:
            "Architecture and scale are facts about the model. Whether anyone can catch an error before it lands on someone is a fact about the deployment, and it determines what a mistake actually costs.",
        },
      ],
    },
  ],
};
