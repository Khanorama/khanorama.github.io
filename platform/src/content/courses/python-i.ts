import type { Course, Lesson } from "@/content/types";

/**
 * Python I.
 *
 * Structure follows the LCPB Python I syllabus: four units of three lessons,
 * each closed by a progress check. The source material is an eight-day
 * instructor-led bootcamp, so where a teacher would have filled a gap aloud,
 * the lesson text has to carry it instead.
 *
 * Known corrections applied while porting, kept here so they are reviewable:
 *   - Unit 1 is titled inconsistently in the notebooks ("Variables & Basic
 *     Functions" in L1 and the progress check, "Variables & Datatypes" in L2
 *     and L3). Standardised on "Variables and Datatypes", which matches what
 *     the three lessons actually cover.
 *   - L3 (Strings) ended by pointing forward to Integer/Float/Boolean, which
 *     is L2 and comes before it. Stale pointer, removed.
 *   - A stray paragraph about functions, duplicated from L1, was removed from
 *     the "What is a datatype?" cell in L2.
 */

const unit1Lesson1: Lesson = {
  id: "py1-u1-l1",
  slug: "variables",
  title: "Variables",
  kind: "lesson",
  summary:
    "Call your first function, store values in variables, and print them back out.",
  estimatedMinutes: 20,
  objectives: [
    "Describe what a function is and why it exists",
    "Use print() to display text and numbers",
    "Create a variable and assign it a value",
    "Print the value a variable is holding",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `Welcome to Python I. This unit covers the foundations the rest of the course is built on: how to give the computer an instruction, and how to make it remember a value.

We will start with something you will use in every single program you write from here on, the \`print()\` function.`,
    },
    {
      id: "what-is-a-function",
      kind: "prose",
      markdown: `## What is a function?

A **function** is a reusable block of code that performs one specific task. It takes inputs, called **parameters** or **arguments**, does something with them, and produces a result.

Think of a function as a machine you can hand something to. You do not need to know how the machine works inside. You only need to know what to put in and what comes out. That idea, using something without needing to know its internals, is called **abstraction**, and it is one of the most important ideas in programming.

Functions matter because they let you write a piece of logic once and reuse it everywhere, instead of repeating yourself.

The function you will meet first is \`print()\`, which displays whatever you give it.`,
    },
    {
      id: "print-example",
      kind: "example",
      caption: "The print() function",
      code: `# syntax: print(text to be printed)

print("Hello World!")`,
      expectedOutput: "Hello World!",
    },
    {
      id: "print-exercise",
      kind: "exercise",
      prompt: `Use \`print()\` three times to produce exactly this output:

\`\`\`
I love Python!
abcdefghijklmnopqrstuvwxyz
1234567890
\`\`\``,
      starter: `# Out: I love Python!


# Out: abcdefghijklmnopqrstuvwxyz


# Out: 1234567890
`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["I love Python!", "abcdefghijklmnopqrstuvwxyz", "1234567890"],
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 3,
          message: "Use exactly three print() calls, one for each line.",
        },
      ],
      hints: [
        "Text has to be wrapped in quotes so Python treats it as a string.",
        'The last line is digits, but it is still text here. `print("1234567890")` is fine.',
      ],
      solution: `print("I love Python!")
print("abcdefghijklmnopqrstuvwxyz")
print("1234567890")`,
    },
    {
      id: "what-is-a-variable",
      kind: "prose",
      markdown: `## What is a variable?

A **variable** is a named place to store a value, so you can refer to it later by name instead of repeating the value itself.

Think of it as a labelled box. You put something in the box and write a name on the front. Whenever you need what is inside, you ask for it by name. You can also swap the contents for something else later, which is exactly why it is called a *variable*.

In Python you create one with a name, an equals sign, and a value:`,
    },
    {
      id: "variable-example",
      kind: "example",
      caption: "Assigning two variables",
      code: `# syntax: variableName = value

age = 15
city = "Chicago"`,
      expectedOutput: "",
    },
    {
      id: "variable-print-prose",
      kind: "prose",
      markdown: `Here \`age\` is the variable name and \`15\` is the value assigned to it.

Note that \`15\` has no quotes but \`"Chicago"\` does. That is the difference between a number and text, and it is the subject of the next two lessons.

Now we can print what each variable holds. Notice there are no quotes around \`age\` below. Quoting it would print the word "age" rather than the value inside it.`,
    },
    {
      id: "variable-print-example",
      kind: "example",
      caption: "Printing a variable's value",
      code: `age = 15
city = "Chicago"

print(age)
print(city)`,
      expectedOutput: "15\nChicago",
    },
    {
      id: "variables-matter",
      kind: "prose",
      markdown: `Storing a value just to print it once looks like extra work, and here it is. Variables earn their place as soon as a program grows. When a value is used in twenty places, or has to change while the program runs, a name is the only practical way to keep track of it.`,
    },
    {
      id: "variable-exercise",
      kind: "exercise",
      prompt: `Create three variables so that the \`print()\` statements already written below produce this output:

\`\`\`
77
This is a cool sentence!
A1B2C3
\`\`\`

Do not change the \`print()\` lines. Work out what each variable has to be named and what it has to hold.`,
      starter: `# Create your three variables here


# Out: 77
print(number)

# Out: This is a cool sentence!
print(coolSentence)

# Out: A1B2C3
print(lettersAndNumbers)
`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["77", "This is a cool sentence!", "A1B2C3"],
        },
      ],
      hints: [
        "The names are already given to you by the print() statements: number, coolSentence and lettersAndNumbers.",
        "77 is a number, so it needs no quotes. The other two are text, so they do.",
      ],
      solution: `number = 77
coolSentence = "This is a cool sentence!"
lettersAndNumbers = "A1B2C3"

# Out: 77
print(number)

# Out: This is a cool sentence!
print(coolSentence)

# Out: A1B2C3
print(lettersAndNumbers)`,
    },
  ],
};

/** Metadata is accurate and final; blocks are filled in as each is ported. */
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
    {
      id: "py1-u1",
      slug: "variables-and-datatypes",
      title: "Variables and Datatypes",
      summary:
        "Store values, tell Python's basic types apart, and work with text.",
      lessons: [
        unit1Lesson1,
        pending(
          "py1-u1-l2",
          "numbers-and-booleans",
          "Numbers and Booleans",
          "Integers, floats, how Python mixes them, and True/False values.",
        ),
        pending(
          "py1-u1-l3",
          "strings",
          "Strings",
          "Build text with concatenation, then reach into it with indexing and slicing.",
        ),
        pending(
          "py1-u1-pc",
          "progress-check",
          "Unit 1 Progress Check",
          "Five problems covering variables, datatypes and strings.",
          "progressCheck",
          30,
        ),
      ],
    },
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
          "Problems covering conditionals and both kinds of loop.",
          "progressCheck",
          30,
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
          30,
        ),
      ],
    },
  ],
};
