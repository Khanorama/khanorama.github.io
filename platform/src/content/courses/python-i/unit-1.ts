import type { Lesson, Unit } from "@/content/types";

/**
 * Unit 1: Variables and Datatypes.
 *
 * Corrections applied while porting, kept visible so they are reviewable:
 *   - The notebooks title this unit two different ways ("Variables & Basic
 *     Functions" in L1 and the progress check, "Variables & Datatypes" in L2
 *     and L3). Standardised on the latter, which matches what is taught.
 *   - L3 closed by pointing forward to Integer/Float/Boolean, which is L2 and
 *     comes before it. Stale pointer, removed.
 *   - A paragraph about functions, duplicated from L1, was sitting inside the
 *     "What is a datatype?" cell in L2. Removed.
 *   - Progress check problem 3 asked for "all math operations" but supplied a
 *     print using only + and -. Reworked so the requirement is satisfiable.
 *   - The L3 slicing exercise gave no target output, so there was nothing to
 *     be right about. Concrete targets added.
 */

const lesson1: Lesson = {
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

const lesson2: Lesson = {
  id: "py1-u1-l2",
  slug: "numbers-and-booleans",
  title: "Numbers and Booleans",
  kind: "lesson",
  summary:
    "Integers, floats, how Python mixes them, and the True/False values behind every decision.",
  estimatedMinutes: 25,
  objectives: [
    "Name the four datatypes used in this course",
    "Tell an integer apart from a float",
    "Predict what happens when an integer and a float are mixed",
    "Produce True and False using comparison and equality operators",
  ],
  blocks: [
    {
      id: "datatypes",
      kind: "prose",
      markdown: `## What is a datatype?

A **datatype** describes what kind of value something is, which in turn decides what you are allowed to do with it. This course uses four:

- **String**: text, written in quotes, like \`"Hello"\` or \`"123"\`
- **Integer**: whole numbers, like \`5\` or \`-10\`
- **Float**: numbers with a decimal point, like \`3.14\` or \`-0.5\`
- **Boolean**: one of exactly two values, \`True\` or \`False\`

Types matter because they decide what an operation means. \`5 + 5\` is \`10\`, but \`"5" + "5"\` is \`"55"\`, because adding numbers and joining text are different operations that happen to share a symbol.

Let us look at each one.`,
    },
    {
      id: "integers",
      kind: "prose",
      markdown: `## Integers

An **integer** is a whole number, positive or negative, with no decimal point. You can use the four basic maths operators on them: \`+\`, \`-\`, \`*\` and \`/\`.`,
    },
    {
      id: "integers-example",
      kind: "example",
      caption: "Arithmetic on integers",
      code: `val1 = 8
val2 = 2

print(val1 + val2)
print(val1 - val2)
print(val1 * val2)
print(val1 / val2)`,
      expectedOutput: "10\n6\n16\n4.0",
    },
    {
      id: "division-note",
      kind: "prose",
      markdown: `Look closely at the last line. Dividing \`8\` by \`2\` gives \`4.0\`, not \`4\`.

In Python, \`/\` **always** produces a float, even when the numbers divide evenly. That is deliberate: division is the one operation on two integers that frequently has no integer answer, so Python gives you the type that can always hold the result.`,
    },
    {
      id: "floats",
      kind: "prose",
      markdown: `## Floats

A **float** is a number with a decimal point. The same four operators work on them.`,
    },
    {
      id: "floats-example",
      kind: "example",
      caption: "Arithmetic on floats",
      code: `val1 = 8.5
val2 = 2.5

print(val1 + val2)
print(val1 - val2)
print(val1 * val2)
print(val1 / val2)`,
      expectedOutput: "11.0\n6.0\n21.25\n3.4",
    },
    {
      id: "mixing",
      kind: "prose",
      markdown: `## Mixing integers and floats

You can freely combine the two. When you do, Python converts the result to a **float**, because a float can represent anything an integer can, plus fractions. Going the other way would risk throwing away part of the answer.

This automatic conversion is called **implicit type conversion**.`,
    },
    {
      id: "mixing-example",
      kind: "example",
      caption: "An integer and a float together",
      code: `val1 = 4
val2 = 4.5

print(val1 + val2)
print(val1 - val2)
print(val1 * val2)
print(val1 / val2)`,
      expectedOutput: "8.5\n-0.5\n18.0\n0.8888888888888888",
    },
    {
      id: "predict-mixing",
      kind: "predict",
      prompt: `Both of these are whole numbers in everyday terms. What will Python print?`,
      code: `print(8 + 4.0)`,
      choices: ["12", "12.0", "84.0", "Error"],
      answer: "12.0",
      explanation: `\`4.0\` is a float, so the result is a float, and Python shows a float as \`12.0\` rather than \`12\`.

The value is twelve either way. The type is what changed, and the trailing \`.0\` is Python telling you so.`,
    },
    {
      id: "booleans",
      kind: "prose",
      markdown: `## Booleans

A **Boolean** has only two possible values: \`True\` or \`False\`. Both must be capitalised. They represent whether something is the case, and they are what every decision in a program ultimately rests on.

You rarely type \`True\` yourself. Far more often a Boolean is the *result* of a question:

- **Comparison**: \`5 > 3\` is \`True\`, \`5 < 3\` is \`False\`
- **Equality**: \`7 == 7\` is \`True\`, \`7 == 8\` is \`False\`

Note \`==\` with two equals signs. One equals sign *assigns* a value, two *asks whether they are equal*. Confusing the two is one of the most common beginner mistakes, and you will meet it again in Unit 3.`,
    },
    {
      id: "booleans-example",
      kind: "example",
      caption: "The two Boolean values",
      code: `bool1 = True   # note the capital T
bool2 = False  # note the capital F

print(bool1)
print(bool2)`,
      expectedOutput: "True\nFalse",
    },
    {
      id: "equality-example",
      kind: "example",
      caption: "Asking whether things are equal",
      code: `bool1 = True
bool2 = False

print(bool1 == True)
print(bool2 == True)
print(bool1 == bool2)`,
      expectedOutput: "True\nFalse\nFalse",
    },
    {
      id: "comparison-example",
      kind: "example",
      caption: "Comparing numbers",
      code: `val1 = 2
val2 = 3

print(val1 > 2)
print(val2 > 2)
print(val1 < val2)`,
      expectedOutput: "False\nTrue\nTrue",
    },
    {
      id: "numbers-booleans-exercise",
      kind: "exercise",
      prompt: `Assign values to all eight variables so the program prints exactly this:

\`\`\`
2
True
-1
True
False
11.2
\`\`\`

Three rules:

- Use **exactly eight** variables, and use every one of them
- Use **both** inequality operators, \`<\` and \`>\`
- Use the equality operator \`==\` at least once`,
      starter: `var1 =
var2 =
var3 =
var4 =
var5 =
var6 =
var7 =
var8 =

print(var1)
print(var2 > var1)
print(var3)
print(var4 == var5)
print(var6 < var7)
print(var8)
`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["2", "True", "-1", "True", "False", "11.2"],
        },
        {
          kind: "assignCount",
          exactly: 8,
          message: "Use exactly eight variables.",
        },
        {
          kind: "usesOperators",
          operators: ["<", ">", "=="],
          message: "Use both inequalities and the equality operator.",
        },
      ],
      hints: [
        "The print statements are already written. Work backwards from each expected line to decide what the variables must be.",
        "`var2 > var1` has to be True, so var2 must be bigger than var1.",
        "`var6 < var7` has to be False, so var6 must NOT be smaller than var7.",
      ],
      solution: `var1 = 2
var2 = 3
var3 = -1
var4 = 4
var5 = 4
var6 = 9
var7 = 1
var8 = 11.2

print(var1)
print(var2 > var1)
print(var3)
print(var4 == var5)
print(var6 < var7)
print(var8)`,
    },
    {
      id: "closing",
      kind: "prose",
      markdown: `In the next lesson we look at strings, the one remaining datatype, which can be taken apart and rebuilt in far more ways than a number can.`,
    },
  ],
};

const lesson3: Lesson = {
  id: "py1-u1-l3",
  slug: "strings",
  title: "Strings",
  kind: "lesson",
  summary:
    "Build text with concatenation, then reach into it with indexing and slicing.",
  estimatedMinutes: 25,
  objectives: [
    "Join strings together with concatenation",
    "Explain why string indexing starts at 0",
    "Read a single character out of a string by index",
    "Slice a string, and predict which characters a slice includes",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `A **string** is a sequence of characters used to represent text. You write one by wrapping it in single quotes (\`'Hello'\`), double quotes (\`"Hello"\`), or triple quotes for text spanning several lines (\`"""Hello"""\`).

A string can hold letters, digits, symbols and spaces, and it is always treated as text. \`"123"\` is a string, not a number, and you cannot do arithmetic with it.

Strings are also **immutable**: once created, a string cannot be changed. You can build new strings out of existing ones, but you can never edit one in place. That rule explains a lot of what follows.`,
    },
    {
      id: "concatenation-prose",
      kind: "prose",
      markdown: `## Concatenation

Joining strings end to end is called **concatenation**, and it uses the \`+\` operator. This is the same symbol as addition, doing a different job because the operands are a different type.`,
    },
    {
      id: "concatenation-example",
      kind: "example",
      caption: "Joining strings with +",
      code: `string1 = "Python"
string2 = " is "
string3 = "great"

print(string1 + string2 + string3 + "!")`,
      expectedOutput: "Python is great!",
    },
    {
      id: "concat-spaces",
      kind: "prose",
      markdown: `Notice that \`string2\` is \`" is "\` with a space at each end. Concatenation joins strings exactly as given and adds nothing, so every space you want in the output has to be in one of the strings.`,
    },
    {
      id: "indexing-prose",
      kind: "prose",
      markdown: `## Indexing

Before slicing, you need indexing. Every character in a string sits at a numbered position, and in Python **counting starts at 0**.

For the string \`"Hello"\`:

| Character | \`H\` | \`e\` | \`l\` | \`l\` | \`o\` |
| --- | --- | --- | --- | --- | --- |
| Index | 0 | 1 | 2 | 3 | 4 |

So \`"Hello"\` has five characters with indexes 0 to 4. The last index is always one less than the length, which trips up nearly everyone at first.`,
    },
    {
      id: "indexing-example",
      kind: "example",
      caption: "Reading one character at a time",
      code: `# syntax: variableName[index]

string = "Hello"

print(string[0])
print(string[1])
print(string[2])
print(string[3])
print(string[4])`,
      expectedOutput: "H\ne\nl\nl\no",
    },
    {
      id: "immutability-demo",
      kind: "errorDemo",
      caption: "Trying to change a character",
      code: `string = "Hello"

string[1] = "Y"

print(string)`,
      expectedError: "TypeError",
      explanation: `This is the immutability rule in action. Reading \`string[1]\` is fine, but assigning to it is not, so Python raises a **TypeError**.

To get \`"Hyllo"\` you would build a new string instead: \`string[0] + "y" + string[2:]\`. The original is never modified, you simply stop using it.`,
    },
    {
      id: "slicing-prose",
      kind: "prose",
      markdown: `## Slicing

A **slice** takes a range of characters and gives you a brand new string. The syntax is \`string[start:end]\`.

The rule that catches people out: the start index is **included** and the end index is **excluded**. So \`[1:3]\` gives you characters 1 and 2, but not 3.

Using \`"Hello"\`:

- \`string[1:]\` is \`"ello"\` (from index 1 to the end)
- \`string[:3]\` is \`"Hel"\` (from the start up to, not including, 3)
- \`string[1:3]\` is \`"el"\`

Leaving a side blank means "all the way to that end". Only the end index is exclusive; slicing always begins exactly at the start index you give.`,
    },
    {
      id: "slicing-exercise",
      kind: "exercise",
      prompt: `Using only slices of \`words\`, fill in the three variables so the program prints:

\`\`\`
coding
warms
heart
\`\`\`

Count the indexes carefully, and remember the end index is excluded.`,
      starter: `words = "coding warms the heart"

slice1 =
slice2 =
slice3 =

print(slice1)
print(slice2)
print(slice3)
`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["coding", "warms", "heart"],
        },
        {
          kind: "sourceForbids",
          pattern: '"coding"|"warms"|"heart"',
          message: "Slice the words variable rather than typing the answers.",
        },
      ],
      hints: [
        '"coding" starts at index 0 and is six characters long, so it ends just before index 6.',
        'The space after "coding" is at index 6, so "warms" starts at index 7.',
        '"heart" runs to the very end, so you can leave the end of the slice blank.',
      ],
      solution: `words = "coding warms the heart"

slice1 = words[0:6]
slice2 = words[7:12]
slice3 = words[17:]

print(slice1)
print(slice2)
print(slice3)`,
    },
    {
      id: "closing",
      kind: "prose",
      markdown: `Strings also come with built-in **methods** such as \`.upper()\`, \`.lower()\` and \`.replace()\`, which do much of this work for you. Those arrive in Unit 2, once you have met modules and functions properly.`,
    },
  ],
};

const progressCheck: Lesson = {
  id: "py1-u1-pc",
  slug: "progress-check",
  title: "Unit 1 Progress Check",
  kind: "progressCheck",
  summary:
    "Five problems covering variables, datatypes, comparison and string slicing.",
  estimatedMinutes: 35,
  objectives: [
    "Combine comparison and equality operators to produce required Booleans",
    "Build an exact string using only concatenation",
    "Use all four arithmetic operators in one program",
    "Produce a target string using only slices",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `This check covers lessons 1 to 3. Work through it without looking back if you can, then revisit whichever lesson any problem sends you back to. Being sent back is information, not failure.`,
    },
    {
      id: "p1",
      kind: "exercise",
      prompt: `### Problem 1

Using the four variables given, and only comparison and equality operators, print exactly:

\`\`\`
True
True
False
True
\`\`\``,
      starter: `a = 1
b = 2
c = -1
d = -2

`,
      checks: [
        { kind: "stdoutLines", expected: ["True", "True", "False", "True"] },
        {
          kind: "usesOperators",
          operators: ["<", ">", "=="],
          message: "Use comparison operators and the equality operator.",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 4,
          message: "Print one Boolean per line, so four print() calls.",
        },
      ],
      hints: [
        "a and b are positive, c and d are negative. Comparisons between them are an easy source of True and False.",
        "For the False line you need a comparison that does not hold, such as `c > a`.",
      ],
      solution: `a = 1
b = 2
c = -1
d = -2

print(b > a)
print(c > d)
print(c > a)
print(a == 1)`,
    },
    {
      id: "p2",
      kind: "exercise",
      prompt: `### Problem 2

Using **only** the variables given, string concatenation, and **exactly one** \`print()\` statement, produce:

\`\`\`
brggra smibrg ttraaa
\`\`\``,
      starter: `s = "brg"
t = "rde"
u = "gra"
v = " "
w = "ttr"
x = "sni"
y = "smi"
z = "aaa"

print()
`,
      checks: [
        { kind: "stdout", expected: "brggra smibrg ttraaa" },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "Use exactly one print() statement.",
        },
        {
          kind: "sourceForbids",
          pattern: '"brggra|brggra"',
          message: "Build the line from the variables rather than typing it out.",
        },
      ],
      hints: [
        "Break the target into chunks that match the variables you have: brg, gra, space, smi, brg, space, ttr, aaa.",
        "`v` is the space. You need it twice.",
      ],
      solution: `s = "brg"
t = "rde"
u = "gra"
v = " "
w = "ttr"
x = "sni"
y = "smi"
z = "aaa"

print(s + u + v + y + s + v + w + z)`,
    },
    {
      id: "p3",
      kind: "exercise",
      prompt: `### Problem 3

Define the four variables \`h\`, \`i\`, \`j\` and \`k\` so that the \`print()\` below outputs \`14\`.

You must use **all four** arithmetic operators (\`+\`, \`-\`, \`*\`, \`/\`) somewhere while working out those values, and you may not simply assign the four final numbers directly.`,
      starter: `# Define h, i, j and k here, using +, -, * and /


print(h - i + j - k)
`,
      checks: [
        { kind: "stdout", expected: "14" },
        {
          kind: "assignCount",
          exactly: 4,
          message: "Define exactly four variables: h, i, j and k.",
        },
        {
          kind: "usesOperators",
          operators: ["+", "-", "*", "/"],
          message: "Use all four arithmetic operators.",
        },
      ],
      hints: [
        "The print statement computes h - i + j - k. Pick values that land on 14, then write each one as a small calculation.",
        "Division produces a float, which would make the answer print as 14.0. Use division somewhere it cancels out, or on a value that stays whole.",
      ],
      solution: `h = 10 * 2
i = 8 - 3
j = 6 + 4
k = 22 / 2

print(h - i + j - k)`,
    },
    {
      id: "p4",
      kind: "exercise",
      prompt: `### Problem 4

By **only** slicing \`sentence\` and joining the pieces onto \`out\`, produce:

\`\`\`
greCode itendou hon i
\`\`\`

You may not type any of the target text yourself. Every character must come from a slice.`,
      starter: `sentence = "Coding with CodeStar in Python is stupendously great!"

out =

print(out)
`,
      checks: [
        { kind: "stdout", expected: "greCode itendou hon i" },
        {
          kind: "sourceForbids",
          pattern: "greCode|endou|hon",
          message: "Every piece must come from a slice of sentence, not from typed text.",
        },
        {
          kind: "sourceRequires",
          pattern: "sentence\\s*\\[",
          message: "Build the answer from slices of sentence.",
        },
      ],
      hints: [
        'Write out the target and find each piece inside the sentence. "gre" appears near the end, in "great".',
        'Some pieces are only two characters, like " i". You will need several slices joined with +.',
        'There is no " it" anywhere in the sentence, so that piece has to be built from two separate slices.',
      ],
      solution: `sentence = "Coding with CodeStar in Python is stupendously great!"

out = (
    sentence[47:50]
    + sentence[12:16]
    + sentence[20:22]
    + sentence[9:10]
    + sentence[38:43]
    + sentence[23:24]
    + sentence[27:30]
    + sentence[20:22]
)

print(out)`,
    },
    {
      id: "p5",
      kind: "written",
      prompt: `### Problem 5

In two or three sentences, explain the difference between an integer and a float. Make sure you say what happens when the two are used together in a calculation.`,
      modelAnswer: `An integer is a whole number with no decimal point, such as \`7\` or \`-2\`, while a float is a number that carries a decimal point and can represent fractional values, such as \`7.5\`.

When the two are combined in a calculation, Python converts the result to a float, because a float can represent everything an integer can plus fractions, so no part of the answer is lost. This is why \`8 + 4.0\` gives \`12.0\` rather than \`12\`.

It is also why \`/\` always returns a float, even for a division that comes out evenly.`,
    },
  ],
};

export const unit1: Unit = {
  id: "py1-u1",
  slug: "variables-and-datatypes",
  title: "Variables and Datatypes",
  summary: "Store values, tell Python's basic types apart, and work with text.",
  lessons: [lesson1, lesson2, lesson3, progressCheck],
};
