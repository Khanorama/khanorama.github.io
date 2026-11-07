/*
 * Python execution worker (ES module worker).
 *
 * Runs student code off the main thread via Pyodide (CPython compiled to
 * WebAssembly). Nothing is sent to a server, which is what lets the whole
 * platform sit on static hosting at no cost.
 *
 * Pyodide is served from our own origin, not a CDN. Schools routinely block
 * public CDNs, and that is precisely the network our students are on. The
 * runtime is staged into public/pyodide by scripts/copy-pyodide.mjs at build
 * time, which also pins the exact version we tested against.
 *
 * Note on runaway loops: Unit 3 teaches while loops, so infinite loops are an
 * expected student mistake, not an edge case. Python here is single threaded
 * and cannot be interrupted from outside once it is spinning. Pyodide's
 * interrupt buffer needs SharedArrayBuffer, which needs cross-origin isolation
 * headers that GitHub Pages cannot send. So the main thread kills this worker
 * on timeout and starts a fresh one. That is handled in runner.ts.
 */

import { loadPyodide } from "/pyodide/pyodide.mjs";

const PYODIDE_BASE = "/pyodide/";

/** Python-side harness: captures output, cleans tracebacks, inspects the AST. */
const HARNESS = `
import ast, io, json, sys, traceback

def _lc_format_error(e):
    """Student-facing traceback: only frames from their own code."""
    etype = type(e)
    if isinstance(e, SyntaxError):
        return "".join(traceback.format_exception_only(etype, e)).strip()
    frames = [f for f in traceback.extract_tb(e.__traceback__)
              if f.filename == "<lesson>"]
    parts = []
    if frames:
        parts.append("Traceback (most recent call last):\\n")
        parts.extend(traceback.format_list(frames))
    parts.extend(traceback.format_exception_only(etype, e))
    return "".join(parts).strip()

def _lc_make_input(lines):
    """input() backed by pre-supplied lines, echoed like a real terminal."""
    pending = list(lines)
    def _input(prompt=""):
        if prompt:
            print(prompt, end="")
        if not pending:
            raise EOFError(
                "This program asked for more input than the lesson provided."
            )
        value = pending.pop(0)
        print(value)
        return value
    return _input

class _LcCappedWriter(io.StringIO):
    """
    stdout with a ceiling.

    A runaway loop that prints would otherwise accumulate output until the tab
    runs out of memory, and it would do so long before the ten second timeout
    could fire. Unit 3 tells students to run exactly such a loop on purpose,
    so this is an expected path rather than an edge case.
    """

    CAP = 200_000

    def __init__(self):
        super().__init__()
        self._written = 0
        self.truncated = False

    def write(self, s):
        remaining = self.CAP - self._written
        if remaining <= 0:
            self.truncated = True
            return len(s)
        if len(s) > remaining:
            super().write(s[:remaining])
            self._written = self.CAP
            self.truncated = True
        else:
            super().write(s)
            self._written += len(s)
        return len(s)


def _lc_run(src, stdin_lines):
    out, err = _LcCappedWriter(), _LcCappedWriter()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    result = {"ok": True, "stdout": "", "stderr": "", "error": None,
              "errorType": None, "truncated": False}
    scope = {"__name__": "__main__", "input": _lc_make_input(stdin_lines)}
    try:
        exec(compile(src, "<lesson>", "exec"), scope)
    except BaseException as e:
        result["ok"] = False
        result["errorType"] = type(e).__name__
        result["error"] = _lc_format_error(e)
    finally:
        sys.stdout, sys.stderr = old_out, old_err
        result["stdout"] = out.getvalue()
        result["stderr"] = err.getvalue()
        result["truncated"] = out.truncated or err.truncated
    return json.dumps(result)

def _lc_analyze(src):
    """
    Structural facts about the submission, read from the AST.

    Several exercises constrain how an answer is written ("exactly 8
    variables", "only one print()"). Parsing is used rather than regex so that
    a print() inside a string or a comment is not miscounted.
    """
    info = {"syntaxError": None, "callCounts": {}, "assignedNames": [],
            "assignCount": 0, "operators": [], "imports": []}
    try:
        tree = ast.parse(src)
    except SyntaxError as e:
        info["syntaxError"] = f"{e.msg} (line {e.lineno})"
        return json.dumps(info)

    calls, assigned, ops, imports = {}, [], set(), []

    def record_target(t):
        if isinstance(t, ast.Name):
            assigned.append(t.id)
        elif isinstance(t, (ast.Tuple, ast.List)):
            for el in t.elts:
                record_target(el)

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            fn = node.func
            name = fn.id if isinstance(fn, ast.Name) else (
                fn.attr if isinstance(fn, ast.Attribute) else None)
            if name:
                calls[name] = calls.get(name, 0) + 1
        elif isinstance(node, ast.Assign):
            for t in node.targets:
                record_target(t)
        elif isinstance(node, ast.AnnAssign):
            record_target(node.target)
        elif isinstance(node, ast.AugAssign):
            record_target(node.target)
            ops.add(type(node.op).__name__)
        elif isinstance(node, ast.BinOp):
            ops.add(type(node.op).__name__)
        elif isinstance(node, ast.UnaryOp):
            ops.add(type(node.op).__name__)
        elif isinstance(node, ast.BoolOp):
            ops.add(type(node.op).__name__)
        elif isinstance(node, ast.Compare):
            for o in node.ops:
                ops.add(type(o).__name__)
        elif isinstance(node, ast.Import):
            imports.extend(a.name for a in node.names)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.append(node.module)

    info["callCounts"] = calls
    info["assignedNames"] = assigned
    info["assignCount"] = len(set(assigned))
    info["operators"] = sorted(ops)
    info["imports"] = imports
    return json.dumps(info)
`;

let pyodidePromise = null;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const py = await loadPyodide({ indexURL: PYODIDE_BASE });
      py.runPython(HARNESS);
      return py;
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const { type, id, code, stdin } = event.data || {};

  if (type === "init") {
    try {
      await getPyodide();
      self.postMessage({ type: "ready" });
    } catch (error) {
      self.postMessage({ type: "initError", message: String(error) });
    }
    return;
  }

  if (type !== "run" && type !== "analyze") return;

  let py;
  try {
    py = await getPyodide();
  } catch (error) {
    self.postMessage({
      type: "result",
      id,
      ok: false,
      stdout: "",
      stderr: "",
      error: `Python failed to load: ${String(error)}`,
      errorType: "LoadError",
    });
    return;
  }

  try {
    if (type === "analyze") {
      const fn = py.globals.get("_lc_analyze");
      const json = fn(code);
      fn.destroy();
      self.postMessage({ type: "analysis", id, ...JSON.parse(json) });
      return;
    }

    const fn = py.globals.get("_lc_run");
    const json = fn(code, py.toPy(stdin || []));
    fn.destroy();
    self.postMessage({ type: "result", id, ...JSON.parse(json) });
  } catch (error) {
    // A failure out here is a harness fault, not a student mistake.
    self.postMessage({
      type: "result",
      id,
      ok: false,
      stdout: "",
      stderr: "",
      error: String(error),
      errorType: "HarnessError",
    });
  }
};
