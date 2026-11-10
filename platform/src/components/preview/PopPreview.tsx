"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Constellation } from "@/components/preview/Constellation";

/**
 * A whole page built in the style of the supplied reference, so the
 * direction can be looked at rather than described.
 *
 * It is deliberately a separate route and is linked from nowhere. The
 * reference reverses several decisions the live system made on purpose
 * (pure black against warm paper, no borders, no shadows, no cards, one or
 * two elements per viewport), and those are not changes to make four days
 * before a launch on the strength of a style guide. This way the choice can
 * be made by looking at the real content in the real typeface.
 *
 * The content is LeapCode's own, pulled from the same files the live pages
 * use, because the only thing worth judging here is how this treatment
 * holds actual copy. A reference page full of placeholder text would look
 * better and tell nobody anything.
 */

/** Six-colour spectra for the particle field, one per palette. */
const SPECTRUM = {
  leapcode: ["#4d9bff", "#35d98a", "#8cc6ff", "#6ee7b0", "#ffffff", "#2a7fe0"],
  reference: ["#8052ff", "#ffb829", "#15846e", "#b794ff", "#4d7cff", "#ff5fa8"],
} as const;

type Palette = keyof typeof SPECTRUM;

export interface PopCourse {
  title: string;
  note: string;
  level: string;
  state: string;
  href?: string;
}

export interface PopFigure {
  value: string;
  label: string;
}

/**
 * Splits a headline so each word arrives on its own beat.
 *
 * Words, not characters. A screen reader meeting a headline wrapped letter
 * by letter announces it as a string of fragments, while words survive the
 * split as words. The space between them is a real text node outside the
 * spans, so the line still breaks where it naturally would: a non-breaking
 * space inside each span would hold the whole headline on one line and
 * overflow every narrow screen.
 */
function Words({
  text,
  from = 0,
  step = 55,
}: {
  text: string;
  from?: number;
  step?: number;
}) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            className="pop-word"
            // Inline because the reduced-motion rule in globals.css zeroes
            // animation-delay with !important, which an inline style must
            // not be able to beat.
            style={{ animationDelay: `${from + index * step}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function PopPreview({
  courses,
  figures,
  mission,
}: {
  courses: PopCourse[];
  figures: PopFigure[];
  mission: string[];
}) {
  /*
    Which spectrum the page is wearing.

    This switch is scaffolding, not part of the design. The reference is
    built on one saturated violet with an amber spark, and the real question
    is whether that palette belongs to an organisation whose wordmark is
    already blue and green. Arguing about it in prose is slower than looking
    at it, so both are here and the default is LeapCode's own.
  */
  const [palette, setPalette] = useState<Palette>("leapcode");

  return (
    <div className="pop" data-palette={palette}>
      <div className="pop-shell">
        <div className="pop-switch">
          <span>Spectrum</span>
          {(
            [
              ["leapcode", "LeapCode blue and green"],
              ["reference", "Reference violet and amber"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="pop-switch__button"
              aria-pressed={palette === key}
              onClick={() => setPalette(key)}
            >
              {label}
            </button>
          ))}
          <span className="pop-switch__note">
            Preview route. Not linked from the site.
          </span>
        </div>

        <nav className="pop-nav" aria-label="Preview">
          <Link href="/preview/pop/" className="pop-mark pop-nav__mark">
            <Mark />
            LeapCode
          </Link>

          <div className="pop-nav__links">
            <a href="#courses" className="pop-ghost">
              Courses
            </a>
            <a href="#compete" className="pop-ghost">
              Compete
            </a>
            <a href="#mission" className="pop-ghost">
              Mission
            </a>
          </div>

          <Link href="/account/" className="pop-pill pop-nav__pill">
            Create account
          </Link>
        </nav>

        <header className="pop-hero">
          <div className="pop-hero__stack">
            <p className="pop-label pop-enter" style={{ animationDelay: "0ms" }}>
              Code. Compete. Connect.
            </p>

            <h1 className="pop-display">
              <Words text="From a first line to a foundation." from={90} />
            </h1>

            <p className="pop-body pop-enter" style={{ animationDelay: "480ms" }}>
              Courses, competitions and resources for anyone learning to code.
              Free, and taught by people who remember being beginners.
            </p>

            <div
              className="pop-actions pop-enter"
              style={{ animationDelay: "570ms" }}
            >
              <a href="#courses" className="pop-pill">
                Explore courses
              </a>
              <Link href="/about/" className="pop-ghost">
                About LeapCode
              </Link>
            </div>
          </div>

          <div className="pop-hero__art">
            <Constellation colours={[...SPECTRUM[palette]]} />
          </div>
        </header>

        <section aria-label="At a glance">
          <hr className="pop-rule" />
          <dl className="pop-figures">
            {figures.map((figure, index) => (
              <div key={figure.label} {...revealProps(index * 80)}>
                <dd className="pop-figure__value">{figure.value}</dd>
                <dt className="pop-figure__label">{figure.label}</dt>
              </div>
            ))}
          </dl>
          <hr className="pop-rule" />
        </section>

        <section className="pop-section" id="courses">
          <div className="pop-stack pop-intro">
            <p className="pop-label" {...revealProps()}>
              Courses
            </p>
            <h2 className="pop-h1" {...revealProps(60)}>
              What there is to learn.
            </h2>
            <p className="pop-body pop-body--quiet" {...revealProps(120)}>
              One course is written and running. The next two are being built,
              and are listed here as what they are rather than as something you
              can start today.
            </p>
          </div>

          {/*
            Courses as rows of type rather than cards. The reference forbids
            a container with a border, a fill or a shadow, so what replaces
            the card is a rule, an index and a lot of air, and the hover has
            to be carried by the text itself since there is no box to lift.
          */}
          <ul className="pop-list">
            {courses.map((course, index) => (
              <li key={course.title} {...revealProps(index * 70)}>
                <CourseRow course={course} index={index + 1} />
              </li>
            ))}
          </ul>
        </section>

        <section className="pop-section pop-split pop-split--flip" id="compete">
          <div className="pop-split__art pop-hero__art" aria-hidden="true">
            <Constellation colours={[...SPECTRUM[palette]]} />
          </div>

          <div className="pop-stack">
            <p className="pop-label" {...revealProps()}>
              Compete
            </p>
            <h2 className="pop-h2" {...revealProps(60)}>
              Build something in a weekend.
            </h2>
            <p className="pop-body pop-body--quiet" {...revealProps(120)}>
              Hackathons, contests and challenges, open to every student here
              whether or not they have finished a course. Entries are read by
              the people who teach, and everyone who submits gets written
              feedback.
            </p>
            <Link href="/compete/" className="pop-ghost" {...revealProps(180)}>
              See what is on
            </Link>
          </div>
        </section>

        <section className="pop-section pop-split" id="mission">
          <div>
            <h2 className="pop-h1" {...revealProps()}>
              Coding is a way in.
            </h2>
          </div>
          <div className="pop-stack">
            <p className="pop-label" {...revealProps(60)}>
              Our mission
            </p>
            {mission.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className="pop-body pop-body--quiet"
                {...revealProps(120 + index * 70)}
              >
                {paragraph}
              </p>
            ))}
            <Link href="/about/" className="pop-ghost" {...revealProps(280)}>
              Meet the team
            </Link>
          </div>
        </section>

        <section className="pop-section">
          <h2 className="pop-display" {...revealProps()}>
            Start where you are.
          </h2>
          <div className="pop-actions pop-actions--spaced" {...revealProps(90)}>
            <Link href="/account/" className="pop-pill">
              Create an account
            </Link>
            <a href="#courses" className="pop-ghost">
              Look through the courses
            </a>
          </div>
        </section>

        <footer className="pop-footer">
          <hr className="pop-rule pop-rule--full" />
          <p className="pop-footer__note">
            A design preview of leapcode.org, built to try a supplied style
            reference against real content. Not the live site, and not linked
            from it.
          </p>
        </footer>
      </div>
    </div>
  );
}

/**
 * Scroll reveals, reusing the system already in the stylesheet.
 *
 * The observer is started once by the app template, so an element only has
 * to carry the attribute and its place in the stagger. Writing it out here
 * rather than importing keeps the preview from being a reason the shared
 * helper can never change.
 */
function revealProps(delay = 0) {
  return {
    "data-reveal": "",
    style: delay
      ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
      : undefined,
  };
}

function CourseRow({ course, index }: { course: PopCourse; index: number }) {
  const body = (
    <>
      <span className="pop-row__index">
        {String(index).padStart(2, "0")}
      </span>

      <div>
        <h3 className="pop-row__title">{course.title}</h3>
        <div className="pop-row__meta">
          <span>{course.level}</span>
          <span>{course.state}</span>
        </div>
      </div>

      <div>
        <p className="pop-row__note">{course.note}</p>
        {course.href ? <span className="pop-row__go">Start &rarr;</span> : null}
      </div>
    </>
  );

  if (!course.href) {
    return <div className="pop-row">{body}</div>;
  }

  return (
    <Link href={course.href} className="pop-row pop-row--link">
      {body}
    </Link>
  );
}

/** The angular fragment the reference pairs with its wordmark. */
function Mark() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path d="M2 17 L10 2 L18 17 Z" fill="var(--iris)" />
      <path d="M10 2 L18 17 L10 11 Z" fill="var(--spark)" opacity="0.85" />
    </svg>
  );
}
