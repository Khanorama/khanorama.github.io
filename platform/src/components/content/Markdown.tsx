import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/**
 * Lesson prose.
 *
 * Rendered in a server component, so markdown parsing happens at build time
 * and none of this library reaches the browser bundle.
 *
 * Instruction is set in the serif reading face at a constrained measure.
 * Interface text stays sans, so a student can always tell what the course is
 * saying apart from what the product is saying.
 */

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-9 mb-3 font-sans text-xl font-semibold text-ink first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-7 mb-2 font-sans text-base font-semibold text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-1.5 pl-6 marker:text-ink-faint">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-6 marker:text-ink-faint">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-2 border-line-strong pl-4 text-ink-muted">
      {children}
    </blockquote>
  ),
  // Inline code sits inside running prose, so it must not shout.
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.startsWith("language-"));
    if (!isBlock) {
      return (
        <code className="rounded-[4px] bg-surface-raised px-[0.35em] py-[0.1em] font-mono text-[0.88em] text-ink">
          {children}
        </code>
      );
    }
    return <code className="font-mono text-[13px] text-ink">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-control border border-line bg-surface px-3.5 py-3 leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-left font-sans text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-line-strong pb-2 pr-4 font-semibold text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line py-2 pr-4 align-top text-ink-muted">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-line" />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="font-reading text-reading text-ink">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
