/**
 * The seal that marks a finished course.
 *
 * Inline SVG rather than a file, so it can use the theme's own colors and
 * be correct in light and dark from one definition. The scalloped edge is
 * a fourteen-lobe rosette generated rather than drawn by hand, which is
 * why the coordinates look arbitrary: they are points on two alternating
 * radii.
 *
 * It lives apart from the places that use it because there are now two:
 * the list on the account page and the course page itself. A second copy
 * would drift, and a seal that is not identical in both places stops
 * reading as one thing a student has earned.
 *
 * It is marked aria-hidden because the badge's meaning is in the text
 * beside it. A screen reader announcing "image, seal" before the course
 * name would add noise, not information.
 */
export function Seal({ size = 52 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M28.0 4.0 L32.6 8.0 L38.4 6.4 L40.8 12.0 L46.8 13.0 L46.5 19.1 L51.4 22.7 L48.5 28.0 L51.4 33.3 L46.5 36.9 L46.8 43.0 L40.8 44.0 L38.4 49.6 L32.6 48.0 L28.0 52.0 L23.4 48.0 L17.6 49.6 L15.2 44.0 L9.2 43.0 L9.5 36.9 L4.6 33.3 L7.5 28.0 L4.6 22.7 L9.5 19.1 L9.2 13.0 L15.2 12.0 L17.6 6.4 L23.4 8.0 Z"
        fill="var(--color-success-soft)"
        stroke="var(--color-success-line)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="28"
        cy="28"
        r="15"
        fill="none"
        stroke="var(--color-success-line)"
        strokeWidth="1.2"
        opacity="0.8"
      />
      <path
        d="M20.5 28.5 L25.5 33.5 L35.5 22.5"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
