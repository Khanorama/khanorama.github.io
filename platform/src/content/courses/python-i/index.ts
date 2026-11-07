import type { Course, Lesson } from "@/content/types";
import { unit1 } from "@/content/courses/python-i/unit-1";

/**
 * Python I.
 *
 * Structure follows the LCPB Python I syllabus: four units of three lessons,
 * each closed by a progress check.
 *
 * The source material is an eight-day instructor-led bootcamp, so in places a
 * teacher was filling a gap aloud and the notebook simply does not contain the
 * explanation. Where that happens the lesson text has to carry it, and those
 * additions are called out in each unit file.
 */

/** Metadata is accurate and final; blocks are filled in as each unit is ported. */
function pending(
  id: string,
  slug: string,
  title: string,
  summary: string,
  kind: Lesson["kind"] = "lesson",
  estimatedMinutes = 25,
): Lesson {
  return {
    id,
    slug,
    title,
    kind,
    summary,
    estimatedMinutes,
    objectives: [],
    blocks: [],
  };
}

export const pythonI: Course = {
  id: "python-i",
  slug: "python-i",
  title: "Python I",
  subtitle: "Build a real foundation in Python, one worked idea at a time.",
  description:
    "Python I covers the core of the language: variables and datatypes, modules and your own functions, conditionals and loops, and the data structures that hold everything together. You write and run code in every lesson, and the exercises check your work as you go.",
  level: "Beginner",
  status: "inDevelopment",
  units: [
    unit1,
    {
      id: "py1-u2",
      slug: "modules-and-functions",
      title: "Modules and Functions",
      summary:
        "Use code other people wrote, then start writing your own functions.",
      lessons: [
        pending(
          "py1-u2-l1",
          "modules",
          "Modules",
          "Import and use the math and random modules, plus built-in string methods.",
        ),
        pending(
          "py1-u2-l2",
          "creating-basic-functions",
          "Creating Basic Functions",
          "Define your own functions with parameters and return values.",
        ),
        pending(
          "py1-u2-l3",
          "input-type-and-comments",
          "input(), type() and Comments",
          "Read input from the user, inspect a value's type, and document your code.",
        ),
        pending(
          "py1-u2-pc",
          "progress-check",
          "Unit 2 Progress Check",
          "Problems covering modules, functions and user input.",
          "progressCheck",
          30,
        ),
      ],
    },
    {
      id: "py1-u3",
      slug: "control-flow",
      title: "Control Flow",
      summary: "Make decisions and repeat work without repeating yourself.",
      lessons: [
        pending(
          "py1-u3-l1",
          "conditionals",
          "Conditionals",
          "Branch between different paths with if, elif and else.",
        ),
        pending(
          "py1-u3-l2",
          "for-loops",
          "For Loops",
          "Repeat an action across a range or a sequence.",
        ),
        pending(
          "py1-u3-l3",
          "while-loops",
          "While Loops",
          "Repeat while a condition holds, and avoid looping forever.",
        ),
        pending(
          "py1-u3-pc",
          "progress-check",
          "Unit 3 Progress Check",
          "Five problems covering conditionals and both kinds of loop.",
          "progressCheck",
          35,
        ),
      ],
    },
    {
      id: "py1-u4",
      slug: "data-structures",
      title: "Data Structures",
      summary: "Hold many values at once with lists, tuples and dictionaries.",
      lessons: [
        pending(
          "py1-u4-l1",
          "lists-part-1",
          "Lists, Part 1",
          "Create lists, index into them, and add or remove items.",
        ),
        pending(
          "py1-u4-l2",
          "lists-part-2",
          "Lists, Part 2",
          "Slice lists, use the common list methods, and copy them safely.",
        ),
        pending(
          "py1-u4-l3",
          "tuples-and-dictionaries",
          "Tuples and Dictionaries",
          "Fixed collections with tuples, and key-value data with dictionaries.",
        ),
        pending(
          "py1-u4-pc",
          "progress-check",
          "Unit 4 Progress Check",
          "Problems covering lists, tuples and dictionaries.",
          "progressCheck",
          35,
        ),
      ],
    },
  ],
};
