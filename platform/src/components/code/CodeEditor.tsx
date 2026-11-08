"use client";

import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  syntaxHighlighting,
  HighlightStyle,
  indentUnit,
  bracketMatching,
} from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags } from "@lezer/highlight";

/**
 * Code highlighting, deliberately near-monochrome.
 *
 * Most editor themes colour a dozen token types, which turns a beginner's
 * first program into confetti and implies distinctions they cannot read yet.
 * This uses three signals only: literals are green, keywords are blue,
 * commentary recedes. Everything else is body ink.
 */
const highlightStyle = HighlightStyle.define([
  { tag: [tags.comment], color: "var(--color-ink-faint)", fontStyle: "italic" },
  { tag: [tags.string, tags.special(tags.string)], color: "var(--color-success)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--color-warning)" },
  {
    tag: [tags.keyword, tags.operatorKeyword, tags.controlKeyword],
    color: "var(--color-accent)",
    fontWeight: "500",
  },
  { tag: [tags.function(tags.variableName), tags.labelName], color: "var(--color-navy-soft)" },
  { tag: [tags.definition(tags.variableName)], color: "var(--color-ink)" },
  { tag: [tags.operator, tags.punctuation], color: "var(--color-ink-muted)" },
  { tag: [tags.invalid], color: "var(--color-danger)" },
]);

const editorTheme = EditorView.theme({
  "&": {
    fontSize: "13.5px",
    backgroundColor: "var(--color-paper)",
    color: "var(--color-ink)",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.65",
    /*
      Ligatures off, deliberately.

      JetBrains Mono fuses == into a single long bar and renders <= and >= as
      the mathematical glyphs ≤ and ≥. On a platform teaching Python syntax
      that is actively misleading: a beginner types two characters and sees
      one, and ≤ is not a character Python accepts. Experienced developers
      like these; people learning what the operators are should not have them
      disguised.

      Both properties are needed. font-variant-ligatures covers the standard
      liga feature, while JetBrains Mono drives most of its operator
      substitutions through calt, which only font-feature-settings disables.
    */
    fontVariantLigatures: "none",
    fontFeatureSettings: '"liga" 0, "calt" 0',
  },
  ".cm-content": {
    padding: "12px 0",
    /*
      The caret, and the reason it needs setting explicitly.

      CodeMirror only draws its own .cm-cursor element when the
      drawSelection extension is enabled, which it is not here, so the
      browser's native caret is used instead. That is governed by
      caret-color, and CodeMirror's base theme hard-codes it to black for
      any theme not registered with { dark: true }.

      This theme is neither light nor dark: it is built from CSS variables
      that swap with the page, so a static dark flag would be wrong half the
      time. Setting caret-color from the same tokens keeps it correct in
      both, and was previously invisible against the dark editor background.
    */
    caretColor: "var(--color-accent)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-ink-faint)",
    border: "none",
    borderRight: "1px solid var(--color-line)",
    paddingRight: "2px",
  },
  /*
    The gutter does not inherit the scroller's line-height, so without this
    the numbers sit ~15.5px apart against 22.3px content rows. The error
    accumulates down the file: by line 6 the number is already 44px adrift,
    and on a long listing the numbering is simply wrong.
  */
  ".cm-gutterElement": {
    lineHeight: "1.65",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-surface-raised)",
    color: "var(--color-ink-muted)",
  },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--color-surface) 60%, transparent)" },
  // Only takes effect if drawSelection() is ever added; the native caret
  // above is what is actually rendered today. Kept so the two agree.
  ".cm-cursor": { borderLeftColor: "var(--color-accent)", borderLeftWidth: "2px" },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--color-accent-soft)",
  },
  ".cm-matchingBracket": {
    backgroundColor: "var(--color-accent-soft)",
    outline: "none",
  },
});

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  /** Accessible label, since a bare editor is opaque to screen readers. */
  ariaLabel?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  ariaLabel = "Python code editor",
}: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const readOnlyComp = useRef(new Compartment());
  // Held in a ref so changing the handler never forces the editor to rebuild.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        indentUnit.of("    "),
        python(),
        syntaxHighlighting(highlightStyle),
        editorTheme,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        readOnlyComp.current.of(EditorState.readOnly.of(readOnly)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
        EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
      ],
    });

    const instance = new EditorView({ state, parent: host.current });
    view.current = instance;
    return () => {
      instance.destroy();
      view.current = null;
    };
    // Built once. Value and readOnly are synced by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (such as Reset) without losing the cursor on
  // ordinary typing.
  useEffect(() => {
    const instance = view.current;
    if (!instance) return;
    const current = instance.state.doc.toString();
    if (current === value) return;
    instance.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    });
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({
      effects: readOnlyComp.current.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  return <div ref={host} className="overflow-hidden" />;
}
