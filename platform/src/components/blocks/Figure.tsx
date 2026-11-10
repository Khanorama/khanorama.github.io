import { reveal } from "@/lib/motion/reveal";

interface FigureProps {
  svg?: string;
  src?: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}

/**
 * A diagram.
 *
 * Inline SVG is injected as markup, which deserves a word rather than a
 * lint suppression. The string comes from a content file in this repository,
 * committed and reviewed in a diff like any other source. It is never a
 * runtime value, never student input and never fetched. Under that condition
 * it is no more dangerous than the component itself, and it buys the thing
 * that matters for a course taught in diagrams: the markup is part of the
 * page, so a figure can draw itself with the site's own colour tokens and be
 * correct in light and dark from one definition.
 *
 * A linked <img> cannot do that. An SVG loaded through src is a separate
 * document that inherits nothing from this page, so a diagram drawn that way
 * is either two files or wrong in one theme.
 *
 * The container is marked role="img" with the alt text as its label, and the
 * markup inside hidden from assistive technology. Without that, a screen
 * reader walks the shapes and reads out a pile of unlabelled paths.
 *
 * The caption is plain text rather than markdown, which is a deliberate
 * narrowing. Running it through the markdown renderer wrapped it in the same
 * paragraph styling as body copy, so a caption came out at reading size in
 * the serif face and competed with the prose it was meant to annotate. A
 * caption is one quiet sentence; it does not need headings or links.
 */
export function Figure({ svg, src, alt, caption, maxWidth }: FigureProps) {
  const style = maxWidth ? { maxWidth: `${maxWidth}px` } : undefined;

  return (
    <figure className="my-8" {...reveal()}>
      <div
        className="mx-auto overflow-hidden rounded-card border border-line bg-surface px-4 py-5"
        style={style}
      >
        {svg ? (
          <div
            role="img"
            aria-label={alt}
            className="[&>svg]:mx-auto [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="mx-auto h-auto w-full"
          />
        ) : null}
      </div>

      {caption && (
        <figcaption className="mx-auto mt-2.5 max-w-prose text-center font-sans text-xs leading-relaxed text-ink-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
