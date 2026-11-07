import { Markdown } from "@/components/content/Markdown";
import { RunnableExample } from "@/components/blocks/RunnableExample";
import { ExerciseBlock } from "@/components/blocks/ExerciseBlock";
import { PredictBlock } from "@/components/blocks/PredictBlock";
import { WrittenBlock } from "@/components/blocks/WrittenBlock";
import type { Block } from "@/content/types";

type Rendered =
  | { kind: "proseRun"; id: string; markdown: string }
  | { kind: "block"; block: Block };

/**
 * Consecutive prose blocks are merged into one markdown document before
 * rendering.
 *
 * Authors split explanation into several prose blocks for editing reasons,
 * but to a reader it is continuous writing. Rendering each one in its own
 * container breaks the typographic flow: a heading that opens a block becomes
 * a first child, loses its top margin, and collides with the paragraph above
 * it. Merging restores normal vertical rhythm and lets margins collapse the
 * way they do inside any single document.
 */
function groupProse(blocks: Block[]): Rendered[] {
  const out: Rendered[] = [];

  for (const block of blocks) {
    if (block.kind !== "prose") {
      out.push({ kind: "block", block });
      continue;
    }
    const last = out[out.length - 1];
    if (last && last.kind === "proseRun") {
      last.markdown += `\n\n${block.markdown}`;
    } else {
      out.push({ kind: "proseRun", id: block.id, markdown: block.markdown });
    }
  }

  return out;
}

export function LessonBody({
  blocks,
  lessonId,
}: {
  blocks: Block[];
  lessonId: string;
}) {
  return (
    <div>
      {groupProse(blocks).map((entry) => {
        if (entry.kind === "proseRun") {
          return <Markdown key={entry.id}>{entry.markdown}</Markdown>;
        }

        const block = entry.block;
        switch (block.kind) {
          case "example":
            return (
              <RunnableExample
                key={block.id}
                code={block.code}
                caption={block.caption}
                editable={block.editable ?? true}
                stdin={block.stdin}
                tone={block.tone}
              />
            );

          case "exercise":
            return (
              <ExerciseBlock
                key={block.id}
                lessonId={lessonId}
                blockId={block.id}
                prompt={<Markdown>{block.prompt}</Markdown>}
                starter={block.starter}
                checks={block.checks}
                stdin={block.stdin}
                hints={block.hints}
                solution={block.solution}
              />
            );

          case "errorDemo":
            return (
              <div key={block.id} className="my-7">
                <RunnableExample
                  code={block.code}
                  caption={block.caption ?? "This one is meant to fail"}
                  editable={false}
                  tone="warning"
                />
                <div className="mt-2 rounded-control border border-warning-line bg-warning-soft px-4 py-3">
                  <p className="font-sans text-xs font-semibold tracking-wide uppercase text-warning">
                    Why it fails
                  </p>
                  <div className="mt-1">
                    <Markdown>{block.explanation}</Markdown>
                  </div>
                </div>
              </div>
            );

          case "sandbox":
            return (
              <div key={block.id} className="my-7">
                {block.prompt && <Markdown>{block.prompt}</Markdown>}
                <RunnableExample
                  code={block.starter ?? ""}
                  caption="Sandbox, nothing is graded here"
                />
              </div>
            );

          case "predict":
            return (
              <PredictBlock
                key={block.id}
                lessonId={lessonId}
                blockId={block.id}
                prompt={<Markdown>{block.prompt}</Markdown>}
                code={block.code}
                choices={block.choices}
                answer={block.answer}
                explanation={<Markdown>{block.explanation}</Markdown>}
              />
            );

          case "written":
            return (
              <WrittenBlock
                key={block.id}
                lessonId={lessonId}
                blockId={block.id}
                prompt={<Markdown>{block.prompt}</Markdown>}
                modelAnswer={<Markdown>{block.modelAnswer}</Markdown>}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
