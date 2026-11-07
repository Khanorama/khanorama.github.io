import { Markdown } from "@/components/content/Markdown";
import { RunnableExample } from "@/components/blocks/RunnableExample";
import { ExerciseBlock } from "@/components/blocks/ExerciseBlock";
import type { Block } from "@/content/types";

/**
 * Maps content blocks to components.
 *
 * This is a server component, so prose is parsed at build time and only the
 * genuinely interactive blocks ship JavaScript. Exercise prompts are rendered
 * here and passed down as nodes for the same reason.
 */
export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block) => {
        switch (block.kind) {
          case "prose":
            return <Markdown key={block.id}>{block.markdown}</Markdown>;

          case "example":
            return (
              <RunnableExample
                key={block.id}
                code={block.code}
                caption={block.caption}
                editable={block.editable ?? true}
              />
            );

          case "exercise":
            return (
              <ExerciseBlock
                key={block.id}
                prompt={<Markdown>{block.prompt}</Markdown>}
                starter={block.starter}
                checks={block.checks}
                hints={block.hints}
                solution={block.solution}
              />
            );

          case "errorDemo":
            return (
              <div key={block.id} className="my-6">
                <RunnableExample
                  code={block.code}
                  caption={block.caption ?? "This one is meant to fail"}
                  editable={false}
                />
                <div className="mt-2 rounded-control border border-warning/30 bg-warning-soft px-3.5 py-3">
                  <p className="font-sans text-xs font-semibold tracking-wide uppercase text-warning">
                    Why it fails
                  </p>
                  <div className="mt-1.5">
                    <Markdown>{block.explanation}</Markdown>
                  </div>
                </div>
              </div>
            );

          case "sandbox":
            return (
              <div key={block.id} className="my-6">
                {block.prompt && <Markdown>{block.prompt}</Markdown>}
                <RunnableExample
                  code={block.starter ?? ""}
                  caption="Sandbox, nothing is graded here"
                />
              </div>
            );

          // predict and written blocks get their own interactions during the
          // lesson port; no ported lesson uses them yet.
          default:
            return null;
        }
      })}
    </div>
  );
}
