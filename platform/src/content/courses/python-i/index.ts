import type { Course } from "@/content/types";
import { unit1 } from "@/content/courses/python-i/unit-1";
import { unit2 } from "@/content/courses/python-i/unit-2";
import { unit3 } from "@/content/courses/python-i/unit-3";
import { unit4 } from "@/content/courses/python-i/unit-4";

/**
 * Python I.
 *
 * Structure follows the LCPB Python I syllabus: four units of three lessons,
 * each closed by a progress check.
 *
 * The source material is an eight-day instructor-led bootcamp, so in places a
 * teacher was filling a gap aloud and the notebook simply does not contain the
 * explanation. Where that happens the lesson carries it instead, and every
 * such addition, along with every correction to the source, is documented at
 * the top of the unit file it belongs to.
 *
 * The final exam and class project from the syllabus are deliberately absent.
 * A static client cannot secure a graded assessment, because every expected
 * answer ships in the bundle, so those remain instructor-run.
 */
export const pythonI: Course = {
  id: "python-i",
  slug: "python-i",
  title: "Python I",
  subtitle: "Build a real foundation in Python, one worked idea at a time.",
  description:
    "Python I covers the core of the language: variables and datatypes, modules and your own functions, conditionals and loops, and the data structures that hold everything together. You write and run code in every lesson, and the exercises check your work as you go.",
  level: "Beginner",
  status: "available",
  units: [unit1, unit2, unit3, unit4],
};
