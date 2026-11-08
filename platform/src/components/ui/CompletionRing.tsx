import type { LessonStatus } from "@/lib/progress/useProgress";

interface CompletionRingProps {
  status: LessonStatus;
  /** 0 to 1. Drawn as an arc while a lesson is partly done. */
  fraction?: number;
  size?: number;
}

const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Per-lesson completion indicator.
 *
 * Three states, each legible at a glance down a long list:
 *   empty    hairline ring, clearly a slot waiting to be filled
 *   partial  an arc showing how far through the exercises you are
 *   complete solid green disc with a tick
 *
 * The partial arc is the point. A lesson with four exercises and three done
 * is not "not finished", and a binary tick would throw that away. Showing the
 * arc is also what makes returning to a half-done lesson feel worth doing.
 *
 * Green appears only on completion, consistent with green meaning earned
 * progress everywhere else in the product.
 */
export function CompletionRing({
  status,
  fraction = 0,
  size = 22,
}: CompletionRingProps) {
  const complete = status === "complete";

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={[
        "shrink-0 transition-colors",
        complete ? "text-success" : "text-line-strong",
      ].join(" ")}
    >
      {complete ? (
        /*
          Completion is the one moment in the product worth marking, so the
          disc arrives with a slight overshoot and the tick is drawn on
          behind it rather than appearing whole.

          transform-box: fill-box is what makes the scale happen about the
          disc's own centre. Without it an SVG transform-origin resolves
          against the viewport, and the ring would swing in from the corner
          of the page.
        */
        <g
          className="animate-pop"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path
            d="M7.2 12.3l3.2 3.2 6.4-6.9"
            fill="none"
            stroke="var(--color-paper)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="15"
            style={{
              animation:
                "tick-draw var(--dur-slow) var(--ease-snap) 90ms backwards",
            }}
          />
        </g>
      ) : (
        <>
          <circle
            cx="12"
            cy="12"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {fraction > 0 && (
            <circle
              cx="12"
              cy="12"
              r={RADIUS}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE * fraction} ${CIRCUMFERENCE}`}
              transform="rotate(-90 12 12)"
              style={{ transition: "stroke-dasharray 400ms ease" }}
            />
          )}
        </>
      )}
    </svg>
  );
}
