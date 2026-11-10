/**
 * Scroll reveals, as an attribute rather than a wrapper component.
 *
 * Any element anywhere can opt in by carrying data-reveal, and optionally a
 * --reveal-delay custom property for its place in a stagger. Nothing has to
 * be wrapped, which matters more than it sounds: a reveal that wraps its
 * target in a div cannot be used on a <li> without breaking the list, or on
 * a flex child without inserting a box that changes the layout. The styling
 * lives in globals.css; this file only decides when each element has
 * arrived.
 *
 * One observer serves the whole document. The alternative, an observer per
 * element, means the browser tracking dozens of separate intersection
 * targets on a long lesson page for no benefit, since they all want the
 * same threshold.
 */

import type { CSSProperties } from "react";

type Arrived = (element: Element) => void;

const REVEALED = "data-visible";

let observer: IntersectionObserver | null = null;

function intersectionObserver(onArrive: Arrived): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Reveals happen once. Releasing the target immediately keeps the
          // observer's list proportional to what is still waiting rather
          // than to how long the page is.
          observer?.unobserve(entry.target);
          onArrive(entry.target);
        }
      },
      {
        // Hold off until the element is a little way in. Firing exactly at
        // the viewport edge means the animation plays while the element is
        // still mostly off screen, so a reader scrolling at any speed sees
        // only the tail of it and the effect reads as a flicker.
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.01,
      },
    );
  }
  return observer;
}

function arrive(element: Element) {
  element.setAttribute(REVEALED, "");
}

function claim(root: ParentNode) {
  const pending = root.querySelectorAll(`[data-reveal]:not([${REVEALED}])`);
  if (pending.length === 0) return;
  const io = intersectionObserver(arrive);
  for (const element of pending) io.observe(element);
}

/**
 * Starts watching the document, including anything added to it later.
 *
 * The mutation observer is not belt and braces. Several parts of the site
 * render their real content only after Firebase resolves, the course outline
 * behind its enrollment gate most obviously, so a single pass at mount would
 * leave exactly those sections hidden for good. Scanning is batched into one
 * animation frame so a burst of DOM changes costs a single query.
 */
export function watchReveals(): () => void {
  if (typeof window === "undefined") return () => {};

  // Nothing to reveal if the browser cannot observe. Everything stays
  // visible, because the hidden state is scoped to .js and this is the only
  // thing that would ever uncover it.
  if (!("IntersectionObserver" in window)) return () => {};

  claim(document);

  if (!("MutationObserver" in window)) return () => {};

  let queued = 0;
  const mutations = new MutationObserver(() => {
    if (queued) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      claim(document);
    });
  });

  mutations.observe(document.body, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    if (queued) cancelAnimationFrame(queued);
    observer?.disconnect();
    observer = null;
  };
}

/**
 * The props an element needs to take part in a reveal.
 *
 * Spread onto any element, in a server component or a client one. The delay
 * is what turns a row of cards from four things appearing at once into one
 * movement traveling across the page.
 */
export function reveal(delayMs = 0) {
  return {
    "data-reveal": "",
    style: delayMs
      ? ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties)
      : undefined,
  };
}
