import { pythonI } from "@/content/courses/python-i";
import { courseLessons } from "@/content/types";

/**
 * Temporary scaffold check. Replaced by the real landing page and catalog.
 * Kept deliberately plain so it proves the design tokens resolve.
 */
export default function Home() {
  const lessons = courseLessons(pythonI);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-brand text-2xl font-black tracking-tight">
        <span className="text-brand-blue">LEAP</span>
        <span className="text-brand-green">CODE</span>
      </p>

      <h1 className="mt-10 text-3xl font-semibold text-ink">
        {pythonI.title}
      </h1>
      <p className="mt-2 text-ink-muted">{pythonI.subtitle}</p>

      <p className="font-reading text-reading mt-6 text-ink">
        {pythonI.description}
      </p>

      <div className="mt-10 rounded-card border border-line bg-surface p-6">
        <p className="text-sm font-medium text-ink">
          {pythonI.units.length} units, {lessons.length} lessons
        </p>
        <ul className="mt-4 space-y-5">
          {pythonI.units.map((unit) => (
            <li key={unit.id}>
              <p className="text-sm font-semibold text-ink">{unit.title}</p>
              <ul className="mt-1 space-y-1">
                {unit.lessons.map((lesson) => (
                  <li key={lesson.id} className="text-sm text-ink-muted">
                    {lesson.title}
                    {lesson.kind === "progressCheck" && (
                      <span className="ml-2 rounded-control bg-surface-raised px-2 py-0.5 text-xs text-ink-faint">
                        check
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
