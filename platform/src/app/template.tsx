"use client";

import { useEffect } from "react";
import { watchReveals } from "@/lib/motion/reveal";

/**
 * Wraps every page, and is remounted on every navigation.
 *
 * That remount is the whole reason this is a template rather than part of
 * the layout: a layout persists across routes, so it could not give each
 * page an entrance, and the reveal watcher would never get a clean start.
 *
 * The entrance is deliberately the smallest move in the system. A route
 * change already replaces everything on screen, so the animation only has
 * to say "this is new", and anything more than a few pixels reads as the
 * page lurching into place.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => watchReveals(), []);

  return <div className="page-enter">{children}</div>;
}
