"use client";

import { useEffect, useRef } from "react";

/**
 * The particle constellation: the signature visual of the style being tried.
 *
 * The reference calls for thousands of tiny outlined triangles in a vivid
 * spectrum, forming an organic shape against pure black, with looser
 * particles drifting through the space around it. It is the one piece of
 * imagery the style allows, so it has to carry the whole hero on its own.
 *
 * WHAT SHAPE, AND WHY NOT A BRAIN. The reference forms its cloud into a
 * brain, which reads as "a model is thinking". That is their claim, not
 * ours: nothing here is an AI product and borrowing the gesture would say
 * something untrue about what students are signing up to. The field is
 * shaped instead as a leap, a trajectory launching low and blooming where
 * it arrives, which is the name of the organisation and the actual promise.
 * The shape is a quadratic curve with particles scattered either side of
 * it, tight at the launch and spreading as it rises.
 *
 * HOW IT IS DRAWN. Stroking two and a half thousand triangle paths per
 * frame is several milliseconds of path building for shapes that are four
 * pixels wide, so each colour and rotation is drawn once into a small
 * offscreen canvas and every particle is then a single scaled drawImage.
 * That turns per-frame work into a blit, which is what makes this
 * affordable on a phone rather than merely possible on a laptop.
 *
 * Positions are kept normalised and multiplied by the canvas size each
 * frame, so resizing the window costs nothing and never reshuffles the
 * field: the constellation a reader was looking at is still the same one
 * after they drag the window wider.
 */

const TAU = Math.PI * 2;
const ROTATIONS = 10;
const SPRITE_PX = 16;

/** Largest particle count by viewport width. See the note in build(). */
function budget(width: number): number {
  if (width < 520) return 700;
  if (width < 900) return 1500;
  return 2500;
}

/**
 * Deterministic noise, so the field is identical on every mount.
 *
 * Math.random would redraw a different constellation on every navigation,
 * which turns the brand's one piece of imagery into something that never
 * looks the same twice.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  /** Normalised to the canvas, so resizing is free. */
  nx: number;
  ny: number;
  size: number;
  colour: number;
  rotation: number;
  /** Twinkle: a sine per particle, not per-frame noise, which reads as static. */
  phase: number;
  speed: number;
  alpha: number;
  /** How much of the pointer parallax this one takes. Depth, cheaply. */
  depth: number;
}

/** The leap. Launches bottom left, apex high, arrives right of centre. */
const P0 = { x: 0.08, y: 0.95 };
const P1 = { x: 0.52, y: 0.02 };
const P2 = { x: 0.96, y: 0.52 };

function curveAt(t: number) {
  const m = 1 - t;
  return {
    x: m * m * P0.x + 2 * m * t * P1.x + t * t * P2.x,
    y: m * m * P0.y + 2 * m * t * P1.y + t * t * P2.y,
    // Tangent, for the perpendicular the scatter is measured along.
    dx: 2 * m * (P1.x - P0.x) + 2 * t * (P2.x - P1.x),
    dy: 2 * m * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
  };
}

function build(
  count: number,
  colourCount: number,
  random: () => number,
): Particle[] {
  const particles: Particle[] = [];

  // A fifth of the field drifts loose in the surrounding space. Without it
  // the shape reads as a cut-out sitting on the black rather than something
  // suspended in it.
  const ambient = Math.round(count * 0.2);

  for (let i = 0; i < count; i += 1) {
    const loose = i < ambient;

    let nx: number;
    let ny: number;

    if (loose) {
      nx = random();
      ny = random();
    } else {
      // Biased towards the far end of the curve, so the arc thickens as it
      // rises instead of being an evenly dusted line.
      const t = Math.pow(random(), 0.72);
      const point = curveAt(t);

      // Three uniforms summed approximate a normal distribution well enough
      // for a visual, and are much cheaper than Box-Muller.
      const spread = (random() + random() + random() - 1.5) / 1.5;
      const width = 0.015 + 0.17 * Math.pow(t, 1.35);

      const length = Math.hypot(point.dx, point.dy) || 1;
      nx = point.x + (-point.dy / length) * spread * width;
      ny = point.y + (point.dx / length) * spread * width;
    }

    particles.push({
      nx,
      ny,
      size: loose ? 2.2 + random() * 1.6 : 2.6 + random() * 2.9,
      colour: Math.floor(random() * colourCount),
      rotation: Math.floor(random() * ROTATIONS),
      phase: random() * TAU,
      speed: 0.25 + random() * 0.65,
      alpha: loose ? 0.16 + random() * 0.24 : 0.4 + random() * 0.6,
      depth: loose ? 0.35 + random() * 0.65 : 0.1 + random() * 0.5,
    });
  }

  return particles;
}

/** One outlined triangle per colour per rotation, drawn once up front. */
function makeSprites(colours: string[], dpr: number): HTMLCanvasElement[] {
  const edge = Math.ceil(SPRITE_PX * dpr);
  const sprites: HTMLCanvasElement[] = [];

  for (const colour of colours) {
    for (let r = 0; r < ROTATIONS; r += 1) {
      const sprite = document.createElement("canvas");
      sprite.width = edge;
      sprite.height = edge;

      const ctx = sprite.getContext("2d");
      if (!ctx) continue;

      const centre = edge / 2;
      // Leaves room for the stroke so no sprite is clipped at its own edge.
      const radius = centre * 0.72;
      const angle = (r / ROTATIONS) * TAU;

      ctx.translate(centre, centre);
      ctx.rotate(angle);
      ctx.beginPath();
      for (let corner = 0; corner < 3; corner += 1) {
        const a = (corner / 3) * TAU - Math.PI / 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        if (corner === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = colour;
      ctx.lineJoin = "round";
      ctx.stroke();

      sprites.push(sprite);
    }
  }

  return sprites;
}

export function Constellation({
  colours,
  className,
}: {
  colours: string[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let sprites: HTMLCanvasElement[] = [];
    let particles: Particle[] = [];
    let frame = 0;
    let onScreen = true;
    let started = 0;

    // Pointer parallax, eased towards the target rather than snapped, so a
    // fast mouse move glides instead of jumping the whole field.
    let aimX = 0;
    let aimY = 0;
    let panX = 0;
    let panY = 0;

    function measure() {
      const rect = canvas!.getBoundingClientRect();
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      if (width < 1 || height < 1) return false;

      canvas!.width = Math.round(width * nextDpr);
      canvas!.height = Math.round(height * nextDpr);

      if (nextDpr !== dpr || sprites.length === 0) {
        dpr = nextDpr;
        sprites = makeSprites(colours, dpr);
      }

      const want = budget(window.innerWidth);
      if (particles.length !== want) {
        particles = build(want, colours.length, seededRandom(0x1eac));
      }

      return true;
    }

    function draw(elapsed: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      // The whole field breathes, very slowly, independently of the
      // twinkle. Two unrelated periods are what stop the motion reading as
      // a single loop.
      const driftX = Math.sin(elapsed * 0.045) * 10;
      const driftY = Math.cos(elapsed * 0.031) * 8;

      panX += (aimX - panX) * 0.045;
      panY += (aimY - panY) * 0.045;

      for (const particle of particles) {
        const twinkle =
          0.55 + 0.45 * Math.sin(elapsed * particle.speed + particle.phase);
        const alpha = particle.alpha * twinkle;
        if (alpha < 0.012) continue;

        const size = particle.size;
        const x =
          particle.nx * width +
          (driftX + panX) * particle.depth -
          size / 2;
        const y =
          particle.ny * height +
          (driftY + panY) * particle.depth -
          size / 2;

        // Cheaper than clipping, and keeps offscreen drift from costing a
        // draw call per particle.
        if (x < -size || y < -size || x > width + size || y > height + size) {
          continue;
        }

        ctx!.globalAlpha = alpha;
        ctx!.drawImage(
          sprites[particle.colour * ROTATIONS + particle.rotation],
          x,
          y,
          size,
          size,
        );
      }

      ctx!.globalAlpha = 1;
    }

    function tick(now: number) {
      if (!started) started = now;
      draw((now - started) / 1000);
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    function start() {
      if (frame || still.matches) return;
      frame = requestAnimationFrame(tick);
    }

    function restart() {
      if (!measure()) return;
      if (still.matches) {
        // One static frame. The shape is the point; the twinkle is not.
        stop();
        draw(0);
      } else {
        stop();
        started = 0;
        start();
      }
    }

    restart();

    // Only run while actually in view. A hero constellation scrolled past
    // has no reader, and an animation that never stops means a laptop fan
    // that never stops either.
    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    watcher.observe(canvas);

    const sizer = new ResizeObserver(() => restart());
    sizer.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else if (onScreen) start();
    }

    function onPointer(event: PointerEvent) {
      if (!fine.matches || still.matches) return;
      const rect = canvas!.getBoundingClientRect();
      aimX = ((event.clientX - rect.left) / rect.width - 0.5) * -26;
      aimY = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    still.addEventListener("change", restart);

    return () => {
      stop();
      watcher.disconnect();
      sizer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      still.removeEventListener("change", restart);
    };
  }, [colours]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // Decorative. A reader using a screen reader loses nothing by never
      // hearing about it, and there is no text in it to describe.
      role="presentation"
    />
  );
}
