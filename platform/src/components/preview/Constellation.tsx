"use client";

import { useEffect, useRef } from "react";

/**
 * The particle constellation: the signature visual of the style being tried.
 *
 * WHAT THE FIRST ATTEMPT GOT WRONG. It scattered particles along a curve to
 * suggest a leap, and the result read as a streak rather than an object:
 * spread thinly over a long path, nothing was dense enough to have a
 * silhouette, nothing connected to anything, and with no depth the whole
 * field sat flat on the black. A constellation is not dust. It is points
 * that clearly belong to one structure.
 *
 * WHAT THIS IS INSTEAD. A rigid cloud of nodes on a sphere, linked to their
 * neighbours, turning slowly in three dimensions, with a brighter stream of
 * particles sweeping around it on its own orbit. Three things do the work
 * the streak was missing:
 *
 *   density    nodes sit on a Fibonacci lattice, which distributes points
 *              over a sphere far more evenly than random sampling. Random
 *              points clump and leave holes, and at this scale that looks
 *              like a mistake rather than like nature.
 *
 *   structure  neighbours within a fixed distance are joined. Lines are
 *              what make a scatter read as a network, and they are the
 *              single biggest difference between this and the streak.
 *
 *   depth      everything is projected with perspective, so nodes at the
 *              back are smaller, dimmer and move more slowly across the
 *              frame than nodes at the front. Rotation then reads as a
 *              solid turning rather than as dots sliding about.
 *
 * Drawing is additive, so where particles overlap they brighten rather than
 * paint over each other. That is what gives the cloud a hot core and a
 * glow it would not otherwise have on pure black.
 *
 * The orbit is the one thing kept from the first attempt. An arc sweeping
 * up and around the cloud is still the brand's idea, and read against a
 * solid body it finally has something to be an arc around.
 */

const TAU = Math.PI * 2;
const ROTATIONS = 8;

/**
 * How far apart two nodes can be and still be joined, in sphere radii.
 *
 * Derived from the node count rather than fixed, because the spacing of a
 * lattice depends on how many points are on it: average separation over a
 * sphere goes as the square root of the count. A constant tuned to look
 * right at nine hundred nodes is smaller than the gap between neighbours
 * at three hundred, so a fixed value would quietly delete the entire
 * network on exactly the devices that get the smaller budget.
 */
function linkDistance(nodes: number): number {
  return 5.1 / Math.sqrt(Math.max(1, nodes));
}
/**
 * Links started per node.
 *
 * A cap per node rather than only a cap overall, which is the difference
 * between a network and a knot. Walking the lattice and stopping once a
 * global budget runs out spends every link on the handful of nodes the
 * loop happens to reach first, and because a Fibonacci lattice is
 * generated pole to pole those all sit in the same place: one dense tangle
 * at the top and nine hundred unconnected points everywhere else.
 */
const LINKS_PER_NODE = 3;
/** Lines are bucketed by depth and stroked as three paths, not one each. */
const DEPTH_BUCKETS = 3;

interface Budget {
  nodes: number;
  orbit: number;
  ambient: number;
  links: number;
}

/**
 * Work scales with the viewport.
 *
 * A phone gets roughly a third of the nodes and a quarter of the links. The
 * cloud stays legible because the lattice thins evenly rather than leaving
 * gaps, which is the other reason for using one.
 */
function budget(width: number): Budget {
  if (width < 520) return { nodes: 300, orbit: 90, ambient: 90, links: 500 };
  if (width < 900) return { nodes: 560, orbit: 150, ambient: 150, links: 1100 };
  return { nodes: 900, orbit: 220, ambient: 240, links: 1900 };
}

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

interface Node {
  x: number;
  y: number;
  z: number;
  size: number;
  colour: number;
  rotation: number;
  phase: number;
  speed: number;
  alpha: number;
}

interface Orbiter {
  /** Angle around its own ring, advanced every frame. */
  angle: number;
  radius: number;
  /** Small offset out of the ring plane, so the stream has thickness. */
  lift: number;
  size: number;
  colour: number;
  rotation: number;
  alpha: number;
}

interface Ambient {
  nx: number;
  ny: number;
  size: number;
  colour: number;
  rotation: number;
  phase: number;
  speed: number;
  alpha: number;
}

/**
 * Points spread evenly over a sphere.
 *
 * The golden angle is what makes this even. Stepping by it means no two
 * consecutive points land near the same meridian, so the lattice never
 * develops the seams and clusters that uniform random sampling does.
 */
function fibonacciSphere(count: number, random: () => number): Node[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: Node[] = [];

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    // A little jitter off the shell, so it reads as a cloud with thickness
    // rather than as a wireframe ball.
    const radius = 0.93 + random() * 0.14;

    nodes.push({
      x: Math.cos(theta) * ring * radius,
      y: y * radius,
      z: Math.sin(theta) * ring * radius,
      size: 3.4 + random() * 2.4,
      colour: 0,
      rotation: Math.floor(random() * ROTATIONS),
      phase: random() * TAU,
      speed: 0.3 + random() * 0.7,
      alpha: 0.55 + random() * 0.45,
    });
  }

  return nodes;
}

/**
 * Which nodes are joined, worked out once.
 *
 * The cloud is rigid: it only ever rotates, so the pairs never change and
 * there is no reason to measure distances again on every frame. Doing this
 * up front turns the per-frame cost of the links from a distance check
 * between every pair of nodes into a fixed list to walk.
 */
function findLinks(nodes: Node[], limit: number): Uint16Array<ArrayBuffer> {
  const pairs: number[] = [];
  const reach = linkDistance(nodes.length);
  const maxSquared = reach * reach;

  for (let i = 0; i < nodes.length; i += 1) {
    if (pairs.length >= limit * 2) break;
    const a = nodes[i];
    let started = 0;

    for (let j = i + 1; j < nodes.length && started < LINKS_PER_NODE; j += 1) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      if (dx * dx + dy * dy + dz * dz < maxSquared) {
        pairs.push(i, j);
        started += 1;
      }
    }
  }

  // Built explicitly rather than with Uint16Array.from, which is typed as
  // backed by ArrayBufferLike and so will not assign to a plain Uint16Array.
  const packed = new Uint16Array(pairs.length);
  packed.set(pairs);
  return packed;
}

/**
 * One glyph per colour per rotation, drawn once.
 *
 * Each sprite is a soft radial glow with the reference's outlined triangle
 * sitting in the middle of it. Pre-rendering is what makes a cloud this
 * size affordable: per frame every particle is a single scaled blit rather
 * than a gradient and a stroked path built from scratch.
 */
function makeSprites(colours: string[], dpr: number): HTMLCanvasElement[] {
  const edge = Math.ceil(30 * dpr);
  const centre = edge / 2;
  const sprites: HTMLCanvasElement[] = [];

  for (const colour of colours) {
    for (let r = 0; r < ROTATIONS; r += 1) {
      const sprite = document.createElement("canvas");
      sprite.width = edge;
      sprite.height = edge;

      const ctx = sprite.getContext("2d");
      if (!ctx) continue;

      const glow = ctx.createRadialGradient(
        centre,
        centre,
        0,
        centre,
        centre,
        centre,
      );
      glow.addColorStop(0, colour);
      glow.addColorStop(0.18, colour);
      glow.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.26;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, edge, edge);

      ctx.globalAlpha = 1;
      ctx.translate(centre, centre);
      ctx.rotate((r / ROTATIONS) * TAU);
      ctx.beginPath();
      const reach = centre * 0.34;
      for (let corner = 0; corner < 3; corner += 1) {
        const a = (corner / 3) * TAU - Math.PI / 2;
        const x = Math.cos(a) * reach;
        const y = Math.sin(a) * reach;
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
    let nodes: Node[] = [];
    let links = new Uint16Array(0);
    let orbiters: Orbiter[] = [];
    let ambient: Ambient[] = [];
    let sized: Budget | null = null;
    let frame = 0;
    let onScreen = true;
    let started = 0;

    // Projected positions, reused every frame so the hot loop allocates
    // nothing. Garbage collected arrays at 60fps are a stutter you can see.
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pd = new Float32Array(0);

    let aimX = 0;
    let aimY = 0;
    let panX = 0;
    let panY = 0;

    function populate(want: Budget) {
      const random = seededRandom(0x1eac);

      nodes = fibonacciSphere(want.nodes, random);
      for (const node of nodes) {
        node.colour = Math.floor(random() * colours.length);
      }
      links = findLinks(nodes, want.links);

      px = new Float32Array(nodes.length);
      py = new Float32Array(nodes.length);
      pd = new Float32Array(nodes.length);

      orbiters = [];
      for (let i = 0; i < want.orbit; i += 1) {
        // A comet rather than a ring: packed and bright at the head, thinning
        // and fading along the tail. The exponent biases the distribution
        // towards zero, and brightness and size then fall off with the same
        // value, so the densest part is also the brightest. Getting that
        // relationship the wrong way round, as the first version did, puts
        // the dim particles where the crowd is and reads as a smudge.
        const along = Math.pow(random(), 2.2);
        orbiters.push({
          angle: along * Math.PI * 1.7,
          radius: 1.18 + random() * 0.2,
          lift: (random() - 0.5) * 0.26,
          size: (2.6 + random() * 2.4) * (1 - along * 0.45),
          colour: Math.floor(random() * colours.length),
          rotation: Math.floor(random() * ROTATIONS),
          alpha: 0.45 + (1 - along) * 0.55,
        });
      }

      ambient = [];
      for (let i = 0; i < want.ambient; i += 1) {
        ambient.push({
          nx: random(),
          ny: random(),
          size: 2 + random() * 1.8,
          colour: Math.floor(random() * colours.length),
          rotation: Math.floor(random() * ROTATIONS),
          phase: random() * TAU,
          speed: 0.25 + random() * 0.6,
          alpha: 0.12 + random() * 0.2,
        });
      }

      sized = want;
    }

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
      if (!sized || sized.nodes !== want.nodes) populate(want);

      return true;
    }

    function draw(elapsed: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, width, height);

      panX += (aimX - panX) * 0.05;
      panY += (aimY - panY) * 0.05;

      const cx = width / 2 + panX;
      const cy = height / 2 + panY;
      // Leaves room for the orbit, which reaches past the sphere itself.
      const scale = Math.min(width, height) * 0.33;

      // Overlapping particles should brighten rather than cover each other.
      // It is what gives the cloud a hot centre instead of a flat crowd,
      // and it also means draw order stops mattering, so nothing has to be
      // depth sorted.
      ctx!.globalCompositeOperation = "lighter";

      // Ambient first, so the cloud sits in front of its own atmosphere.
      for (const dust of ambient) {
        const twinkle =
          0.55 + 0.45 * Math.sin(elapsed * dust.speed + dust.phase);
        ctx!.globalAlpha = dust.alpha * twinkle;
        ctx!.drawImage(
          sprites[dust.colour * ROTATIONS + dust.rotation],
          dust.nx * width - dust.size * 1.5,
          dust.ny * height - dust.size * 1.5,
          dust.size * 3,
          dust.size * 3,
        );
      }

      const spin = elapsed * 0.16;
      const sinSpin = Math.sin(spin);
      const cosSpin = Math.cos(spin);
      // A fixed tilt, so the lattice is seen at an angle rather than
      // edge on, which is what makes the sphere read as a sphere.
      const tilt = 0.42;
      const sinTilt = Math.sin(tilt);
      const cosTilt = Math.cos(tilt);
      const perspective = 3.1;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        const rx = node.x * cosSpin - node.z * sinSpin;
        const rz = node.x * sinSpin + node.z * cosSpin;
        const ry = node.y * cosTilt - rz * sinTilt;
        const rzz = node.y * sinTilt + rz * cosTilt;

        // Nearer is larger and brighter. Without this the sphere turns but
        // never looks solid.
        const depth = perspective / (perspective + rzz);
        px[i] = cx + rx * scale * depth;
        py[i] = cy + ry * scale * depth;
        pd[i] = depth;
      }

      // Links, bucketed by depth and stroked as one path each. A separate
      // stroke per line would be two thousand state changes a frame; three
      // paths give the same depth falloff for three.
      for (let bucket = 0; bucket < DEPTH_BUCKETS; bucket += 1) {
        ctx!.beginPath();
        let drew = false;

        for (let p = 0; p < links.length; p += 2) {
          const a = links[p];
          const b = links[p + 1];
          const depth = (pd[a] + pd[b]) / 2;
          const band = Math.min(
            DEPTH_BUCKETS - 1,
            Math.max(0, Math.floor((depth - 0.74) / 0.18)),
          );
          if (band !== bucket) continue;
          ctx!.moveTo(px[a], py[a]);
          ctx!.lineTo(px[b], py[b]);
          drew = true;
        }

        if (!drew) continue;
        // Faint, but not so faint they vanish. The first pass at these was
        // four per cent, which against the particles' own glow may as well
        // have been nothing: the sphere read as loose dots again.
        ctx!.globalAlpha = 0.1 + bucket * 0.085;
        ctx!.strokeStyle = colours[0];
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const depth = pd[i];
        const twinkle =
          0.62 + 0.38 * Math.sin(elapsed * node.speed + node.phase);

        // Cube the depth falloff so the back of the cloud recedes properly
        // instead of being a second crowd of equally bright points.
        const alpha = node.alpha * twinkle * depth * depth * depth * 0.72;
        if (alpha < 0.012) continue;

        const size = node.size * depth * 3;
        ctx!.globalAlpha = Math.min(1, alpha);
        ctx!.drawImage(
          sprites[node.colour * ROTATIONS + node.rotation],
          px[i] - size / 2,
          py[i] - size / 2,
          size,
          size,
        );
      }

      // The orbit, on its own tilted plane so it crosses in front of the
      // cloud and then behind it.
      const sweep = elapsed * 0.34;
      for (const orbiter of orbiters) {
        const angle = orbiter.angle + sweep;
        const ox = Math.cos(angle) * orbiter.radius;
        const oz = Math.sin(angle) * orbiter.radius;
        const oy = orbiter.lift + oz * 0.34;

        const rx = ox * cosSpin - oz * sinSpin;
        const rz = ox * sinSpin + oz * cosSpin;
        const ry = oy * cosTilt - rz * sinTilt;
        const rzz = oy * sinTilt + rz * cosTilt;

        const depth = perspective / (perspective + rzz);
        const size = orbiter.size * depth * 3;

        ctx!.globalAlpha = Math.min(1, orbiter.alpha * depth * depth * 0.85);
        ctx!.drawImage(
          sprites[orbiter.colour * ROTATIONS + orbiter.rotation],
          cx + rx * scale * depth - size / 2,
          cy + ry * scale * depth - size / 2,
          size,
          size,
        );
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";
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
      stop();
      if (still.matches) {
        // One frame, at an angle that shows the lattice rather than at the
        // start of the rotation. The structure is the point; the spin is not.
        draw(4.2);
      } else {
        started = 0;
        start();
      }
    }

    restart();

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
      aimX = ((event.clientX - rect.left) / rect.width - 0.5) * -22;
      aimY = ((event.clientY - rect.top) / rect.height - 0.5) * -16;
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
      role="presentation"
    />
  );
}
