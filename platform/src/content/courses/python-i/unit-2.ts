import type { Lesson, Unit } from "@/content/types";

/**
 * Unit 2: Modules and Functions.
 *
 * Corrections and additions, kept visible so they are reviewable:
 *   - L2's notebook is titled "UNIT 2: VARIABLES & BASIC FUNCTIONS", which is
 *     Unit 1's name. Corrected.
 *   - L1 demonstrated random.randint() with no print(). That works in a
 *     notebook, which displays the last expression, but prints nothing when
 *     run as a program. Wrapped in print().
 *   - L1's string-method exercise supplied `numSentence` as an integer while
 *     asking for string methods, which would raise AttributeError. Made it a
 *     string, which is also what isnumeric() needs to be interesting.
 *   - Lessons 2 and 3 had no exercises at all. All exercises here are written
 *     for this platform.
 *
 * Added because a teacher would have said it aloud and the notebooks do not:
 *   - return versus print, the single most common beginner confusion about
 *     functions, taught through a prediction that produces None.
 *   - input() always returns a string, even when the user types digits.
 */

const lesson1: Lesson = {
  id: "py1-u2-l1",
  slug: "modules",
  title: "Modules",
  kind: "lesson",
  summary:
    "Import and use the math and random modules, then meet the methods built into every string.",
  estimatedMinutes: 30,
  objectives: [
    "Explain what a module is and how it differs from a function",
    "Import a module and call its functions",
    "Generate a random integer in a given range",
    "Use string methods to transform and inspect text",
  ],
  blocks: [
    {
      id: "what-is-a-module",
      kind: "prose",
      markdown: `## What is a module?

A **module** is a file of Python code that someone else has already written, which you can use in your own program.

This sounds like a function, and the two are related. The difference is one of scale: a function does one task, while a module is a **collection** of functions grouped around a theme. You import the module, then call the functions inside it.

Almost everything useful in programming is built this way. Rather than writing your own square root algorithm, you import \`math\` and call the one that ships with Python.

This lesson covers two modules, \`math\` and \`random\`, plus the methods that come attached to strings. In Python II you will write modules of your own.`,
    },
    {
      id: "math-module",
      kind: "prose",
      markdown: `## The math module

The \`math\` module provides mathematical functions and constants. The ones this course uses:

| Function | What it gives you |
| --- | --- |
| \`sqrt(x)\` | the square root of x |
| \`cbrt(x)\` | the cube root of x |
| \`pow(x, y)\` | x raised to the power y |
| \`ceil(x)\` | the smallest whole number greater than or equal to x |
| \`floor(x)\` | the largest whole number less than or equal to x |
| \`factorial(x)\` | the factorial of x |
| \`trunc(x)\` | x with everything after the decimal point removed |

Before you can use any of them, you have to **import** the module.`,
    },
    {
      id: "math-example",
      kind: "example",
      caption: "Importing and using math",
      code: `import math

print(math.sqrt(25))
print(math.cbrt(27))
print(math.pow(2, 4))
print(math.ceil(6.22))
print(math.floor(6.22))
print(math.factorial(4))
print(math.trunc(28.3563759273654))`,
      expectedOutput: "5.0\n3.0\n16.0\n7\n6\n24\n28",
    },
    {
      id: "math-notes",
      kind: "prose",
      markdown: `Two things worth noticing in that output.

\`math.sqrt(25)\` gives \`5.0\`, not \`5\`. Most \`math\` functions return a float, because in general their answers are not whole numbers, and a function has to return the same type every time.

\`ceil\` and \`floor\` are the exceptions, returning integers, because rounding to a whole number is precisely their job. \`floor(6.22)\` is \`6\` and \`ceil(6.22)\` is \`7\`: floor goes down, ceiling goes up, the same way a floor is below you and a ceiling above.`,
    },
    {
      id: "math-sandbox",
      kind: "sandbox",
      prompt: `Try the \`math\` functions with your own numbers. Negative numbers and \`floor\` behave in a way that surprises most people, so that is worth a look.`,
      starter: `import math

print(math.floor(-6.22))
print(math.trunc(-6.22))`,
    },
    {
      id: "math-exercise",
      kind: "exercise",
      prompt: `Import \`math\` and print, each on its own line:

1. the square root of 144
2. the ceiling of 7.2
3. 2 raised to the power 10

\`\`\`
12.0
8
1024.0
\`\`\``,
      starter: `# Import the module first


`,
      checks: [
        { kind: "stdoutLines", expected: ["12.0", "8", "1024.0"] },
        {
          kind: "importsModule",
          module: "math",
          message: "Import the math module.",
        },
        {
          kind: "sourceForbids",
          pattern: "12\\.0|1024\\.0",
          message: "Let math work the answers out rather than typing them.",
        },
      ],
      hints: [
        "Every call has to be written as math.functionName(...) once the module is imported.",
        "Look again at which of these return a float and which return an integer.",
      ],
      solution: `import math

print(math.sqrt(144))
print(math.ceil(7.2))
print(math.pow(2, 10))`,
    },
    {
      id: "random-module",
      kind: "prose",
      markdown: `## The random module

The \`random\` module generates random values, which makes it useful for games, simulations and sampling. This course uses one function from it, \`randint()\`.`,
    },
    {
      id: "random-example",
      kind: "example",
      caption: "A random integer between 1 and 10",
      code: `import random

x = 1
y = 10

# randint gives a whole number from x to y, both included
print(random.randint(x, y))`,
    },
    {
      id: "random-inclusive",
      kind: "prose",
      markdown: `Run that a few times. The value changes, which is the point.

Note one detail that contradicts something you already learned. With slicing, the end index is **excluded**. With \`randint()\`, the end value is **included**, so \`10\` really can come up.

There is no deep principle here, the two were simply designed by different people for different purposes. It is worth remembering precisely because it is inconsistent.`,
    },
    {
      id: "string-methods",
      kind: "prose",
      markdown: `## String methods

A **method** is a function that belongs to a particular value. You call it with a dot: \`"example".upper()\`.

Strings come with a large set of them. Because strings are immutable, no method ever changes the original. Each one returns a **new** string and leaves the old one untouched, which means you have to store or print the result, or it is simply thrown away.

The ten most useful:

| Method | What it does | Example |
| --- | --- | --- |
| \`lower()\` | everything lowercase | \`"Hello".lower()\` is \`'hello'\` |
| \`upper()\` | everything uppercase | \`"hello".upper()\` is \`'HELLO'\` |
| \`strip()\` | removes surrounding whitespace | \`"  hi  ".strip()\` is \`'hi'\` |
| \`replace(old, new)\` | swaps every occurrence | \`"a-b".replace("-", "+")\` is \`'a+b'\` |
| \`split(sep)\` | breaks into a list | \`"a,b".split(",")\` is \`['a', 'b']\` |
| \`join(items)\` | joins a list into a string | \`",".join(['a','b'])\` is \`'a,b'\` |
| \`find(sub)\` | index of first match, or -1 | \`"hello".find("e")\` is \`1\` |
| \`startswith(p)\` | True if it begins with p | \`"hello".startswith("he")\` is \`True\` |
| \`endswith(s)\` | True if it ends with s | \`"hello".endswith("lo")\` is \`True\` |
| \`isnumeric()\` | True if it is all digits | \`"123".isnumeric()\` is \`True\` |

In your unit test you will be given this list of string methods. You will **not** be given a reference for \`math\` and \`random\`.`,
    },
    {
      id: "string-methods-example",
      kind: "example",
      caption: "Methods return new strings",
      code: `greeting = "  Hello There  "

print(greeting.strip())
print(greeting.strip().upper())
print(greeting.find("There"))

# The original is untouched
print(greeting)`,
      expectedOutput: "Hello There\nHELLO THERE\n8\n  Hello There  ",
    },
    {
      id: "string-methods-sandbox",
      kind: "sandbox",
      prompt: `Experiment with the two strings below. Try \`isnumeric()\` on each and see which one surprises you.`,
      starter: `alphaSentence = "My name is Ali. I am really into Python. Programming is my dream, and I love cookies."
numSentence = "145673753836439347493748936736"

print(alphaSentence.isnumeric())
print(numSentence.isnumeric())`,
    },
    {
      id: "string-methods-exercise",
      kind: "exercise",
      prompt: `Using \`alphaSentence\` and string methods only, print three lines:

1. the whole sentence in uppercase
2. the index where \`"Python"\` starts
3. the sentence with \`"cookies"\` replaced by \`"code"\``,
      starter: `alphaSentence = "My name is Ali. I am really into Python. Programming is my dream, and I love cookies."


`,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "MY NAME IS ALI. I AM REALLY INTO PYTHON. PROGRAMMING IS MY DREAM, AND I LOVE COOKIES.",
            "33",
            "My name is Ali. I am really into Python. Programming is my dream, and I love code.",
          ],
        },
        {
          kind: "callCount",
          name: "upper",
          atLeast: 1,
          message: "Use the upper() method.",
        },
        {
          kind: "callCount",
          name: "find",
          atLeast: 1,
          message: "Use the find() method rather than counting by hand.",
        },
        {
          kind: "callCount",
          name: "replace",
          atLeast: 1,
          message: "Use the replace() method.",
        },
      ],
      hints: [
        "Each method is called on the string with a dot, like alphaSentence.upper().",
        "find() returns a number, so you can print it directly.",
        "replace() takes two arguments: what to look for, and what to put in its place.",
      ],
      solution: `alphaSentence = "My name is Ali. I am really into Python. Programming is my dream, and I love cookies."

print(alphaSentence.upper())
print(alphaSentence.find("Python"))
print(alphaSentence.replace("cookies", "code"))`,
    },
  ],
};

const lesson2: Lesson = {
  id: "py1-u2-l2",
  slug: "creating-basic-functions",
  title: "Creating Basic Functions",
  kind: "lesson",
  summary:
    "Define your own functions, give them parameters, and return values back to the caller.",
  estimatedMinutes: 30,
  objectives: [
    "Define a function with def and call it",
    "Give a function parameters and pass it arguments",
    "Return a value from a function",
    "Explain the difference between returning and printing",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `In Unit 1 you used functions that already existed. Now you will write your own.

A function you define is a named piece of code that runs only when you call it. Writing one has four payoffs:

1. **Reuse.** Write the logic once, call it anywhere.
2. **Readability.** A good name explains a block of code better than a comment.
3. **Debugging.** When something breaks, the problem is inside one function rather than spread across the program.
4. **Modularity.** You can change how a function works without touching anything that calls it.

The shape of a function definition:

\`\`\`
def function_name(parameters):
    # the body, indented
    return output
\`\`\`

- \`def\` starts the definition
- \`function_name\` should describe what it does
- \`parameters\` are the inputs, in parentheses, and are optional
- \`return\` sends a value back, and is also optional`,
    },
    {
      id: "first-function",
      kind: "example",
      caption: "Defining and calling a function",
      code: `def greet():
    print("Hello, welcome to coding!")

# Nothing happens until you call it
greet()`,
      expectedOutput: "Hello, welcome to coding!",
    },
    {
      id: "first-function-note",
      kind: "prose",
      markdown: `Delete the last line and run it again. Nothing is printed.

Defining a function does not run it. It only tells Python "here is a thing called \`greet\`, remember it". The code inside runs when, and only when, you call it with \`greet()\`. The parentheses are what make the call happen.`,
    },
    {
      id: "parameters-prose",
      kind: "prose",
      markdown: `## Parameters and arguments

A function that always does exactly the same thing is limited. **Parameters** let you hand it different values each time.

The two words are easy to mix up:

- A **parameter** is the placeholder in the definition, like \`name\` below
- An **argument** is the actual value you pass when calling, like \`"Alice"\``,
    },
    {
      id: "parameters-example",
      kind: "example",
      caption: "A function with a parameter",
      code: `def greet_user(name):
    print("Hello, " + name + "! Welcome to coding!")

greet_user("Alice")
greet_user("Bob")
greet_user("Charlie")`,
      expectedOutput:
        "Hello, Alice! Welcome to coding!\nHello, Bob! Welcome to coding!\nHello, Charlie! Welcome to coding!",
    },
    {
      id: "return-prose",
      kind: "prose",
      markdown: `## Returning values

So far the functions have printed. Printing shows something to a human and then it is gone. **Returning** hands a value back to the rest of your program, where you can store it, do math with it, or pass it to another function.

\`return\` also ends the function immediately. Any code after it never runs.`,
    },
    {
      id: "return-example",
      kind: "example",
      caption: "A function that returns",
      code: `def add_numbers(a, b):
    return a + b

result = add_numbers(5, 7)

print("The sum is:", result)
print(add_numbers(2, 3) * 10)`,
      expectedOutput: "The sum is: 12\n50",
    },
    {
      id: "return-vs-print-predict",
      kind: "predict",
      prompt: `This is the single most common mistake people make with functions. \`double\` **prints** rather than **returns**. What does this program output?`,
      code: `def double(n):
    print(n * 2)

result = double(5)
print(result)`,
      choices: ["10", "10 and then 10", "10 and then None", "Error"],
      answer: "10 and then None",
      explanation: `The first line, \`10\`, comes from the \`print\` inside the function.

The second is the problem. \`double\` has no \`return\`, and a function that returns nothing gives back \`None\`, Python's word for "no value at all". So \`result\` is \`None\`, and printing it shows \`None\`.

This is why the distinction matters. **Printing** shows a value to a person. **Returning** gives a value back to the program. If you want to use the answer later, the function must return it.

Changing \`print(n * 2)\` to \`return n * 2\` fixes it.`,
    },
    {
      id: "function-exercise",
      kind: "exercise",
      prompt: `Write a function called \`average\` that takes two numbers and **returns** their average. Do not print inside the function.

Then use it to print the average of 8 and 12, and the average of 5 and 2:

\`\`\`
10.0
3.5
\`\`\``,
      starter: `# Define your function here


# Then print the two averages

`,
      checks: [
        { kind: "stdoutLines", expected: ["10.0", "3.5"] },
        {
          kind: "sourceRequires",
          pattern: "def\\s+average\\s*\\(",
          message: "Define a function called average.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\breturn\\b",
          message: "The function must return the average, not print it.",
        },
        {
          kind: "callCount",
          name: "average",
          atLeast: 2,
          message: "Call average() twice, once for each pair.",
        },
      ],
      hints: [
        "An average of two numbers is their sum divided by 2.",
        "Remember / always produces a float, which is why the expected output has .0 on the first line.",
        "Print the result of calling the function: print(average(8, 12)).",
      ],
      solution: `def average(a, b):
    return (a + b) / 2

print(average(8, 12))
print(average(5, 2))`,
    },
  ],
};

const lesson3: Lesson = {
  id: "py1-u2-l3",
  slug: "input-type-and-comments",
  title: "input(), type() and Comments",
  kind: "lesson",
  summary:
    "Read input from the user, check what type a value is, and leave notes in your code.",
  estimatedMinutes: 25,
  objectives: [
    "Write single-line and multi-line comments",
    "Use type() to inspect what a value is",
    "Read user input with input()",
    "Explain why input() always returns a string, and convert it",
  ],
  blocks: [
    {
      id: "comments-prose",
      kind: "prose",
      markdown: `## Comments

A **comment** is a note for humans that Python ignores. Start one with \`#\` and everything after it on that line is skipped.

Comments exist to explain *why* code does something. The code already says *what* it does, so a comment repeating that is just something else to keep up to date.`,
    },
    {
      id: "comments-example",
      kind: "example",
      caption: "A commented-out line never runs",
      code: `# print(7)
print("This line runs")`,
      expectedOutput: "This line runs",
    },
    {
      id: "multiline-comments",
      kind: "prose",
      markdown: `For several lines at once, wrap the text in triple quotes, \`'''\` or \`"""\`.

Strictly these are strings rather than comments, but a string sitting on its own does nothing, so the effect is the same.`,
    },
    {
      id: "multiline-example",
      kind: "example",
      caption: "Triple quotes across several lines",
      code: `'''
print("A comment")
This whole block is ignored.
'''

print("Not a comment")`,
      expectedOutput: "Not a comment",
    },
    {
      id: "type-prose",
      kind: "prose",
      markdown: `## The type() function

\`type()\` tells you what kind of value something is. It is the fastest way to answer "why is this not working", because the answer is very often that a value is not the type you assumed.`,
    },
    {
      id: "type-example",
      kind: "example",
      caption: "Checking three values",
      code: `number = 9
secondNum = 9.0
notANumber = "9.0"

print(type(number))
print(type(secondNum))
print(type(notANumber))`,
      expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>",
    },
    {
      id: "type-note",
      kind: "prose",
      markdown: `Look at the third one. \`"9.0"\` is wrapped in quotes, so it is a **string** that happens to contain digits. It looks like a number to you and is text to Python, and \`"9.0" + 1\` would fail.`,
    },
    {
      id: "input-prose",
      kind: "prose",
      markdown: `## The input() function

\`input()\` pauses the program, waits for the user to type a line, and gives back what they typed.

In these lessons there is no keyboard to type at, so each example supplies its answers in advance. You will see them appear in the output as though someone had typed them.`,
    },
    {
      id: "input-example",
      kind: "example",
      caption: "Reading a line from the user",
      code: `print("Input anything")
inputVal = input()
print("Your input was:", inputVal)`,
      stdin: ["hello"],
      expectedOutput: "Input anything\nhello\nYour input was: hello",
      editable: false,
    },
    {
      id: "input-always-string",
      kind: "prose",
      markdown: `## input() always gives you a string

This catches nearly everyone, and the notebooks do not mention it.

Whatever the user types, \`input()\` hands back a **string**. Type \`42\` and you get \`"42"\`, not \`42\`. So this fails:

\`\`\`
age = input()
print(age + 1)     # TypeError: can only concatenate str to str
\`\`\`

To do math with it, convert it first with \`int()\` or \`float()\`:

\`\`\`
age = int(input())
print(age + 1)     # works
\`\`\``,
    },
    {
      id: "input-exercise",
      kind: "exercise",
      prompt: `Read one line of input, then print the value and its type.

The lesson will supply \`42\` as the input, so you should see:

\`\`\`
42
42
<class 'str'>
\`\`\`

The first \`42\` is the input being echoed. Look carefully at the third line and make sure you understand why it says \`str\`.`,
      starter: `# Read a line, store it, then print the value and its type

`,
      stdin: ["42"],
      checks: [
        { kind: "stdoutLines", expected: ["42", "42", "<class 'str'>"] },
        {
          kind: "callCount",
          name: "input",
          exactly: 1,
          message: "Call input() exactly once.",
        },
        {
          kind: "callCount",
          name: "type",
          atLeast: 1,
          message: "Use type() to inspect the value.",
        },
      ],
      hints: [
        "Store the result of input() in a variable so you can use it twice.",
        "Do not convert it. The point of the exercise is to see that it arrives as a string.",
      ],
      solution: `value = input()

print(value)
print(type(value))`,
    },
  ],
};

const progressCheck: Lesson = {
  id: "py1-u2-pc",
  slug: "progress-check",
  title: "Unit 2 Progress Check",
  kind: "progressCheck",
  summary:
    "Two problems covering the math and random modules, string methods, functions and input.",
  estimatedMinutes: 30,
  objectives: [
    "Combine two modules in one program",
    "Write a function that processes user input",
    "Use string methods to handle inconsistent capitalisation",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `Two problems, each combining several things from this unit.`,
    },
    {
      id: "p1",
      kind: "exercise",
      prompt: `### Problem 1: Random number square root

*Skills: the math and random modules, type()*

Generate a random whole number between 1 and 1000 and store it in a variable. Then print:

1. the type of that number
2. its square root

The square root will differ every run, which is expected. The type line will not.`,
      starter: `# Import both modules you need


`,
      checks: [
        {
          kind: "stdoutContains",
          needle: "<class 'int'>",
          message: "Print the type of the random number.",
        },
        {
          kind: "importsModule",
          module: "random",
          message: "Import the random module.",
        },
        {
          kind: "importsModule",
          module: "math",
          message: "Import the math module.",
        },
        {
          kind: "callCount",
          name: "randint",
          exactly: 1,
          message: "Generate the number with randint().",
        },
        {
          kind: "callCount",
          name: "sqrt",
          exactly: 1,
          message: "Use math.sqrt() for the square root.",
        },
      ],
      hints: [
        "You need two import lines, one for each module.",
        "Store the random number in a variable, otherwise you cannot print its type and its square root.",
        "randint includes both ends, so randint(1, 1000) can produce 1000.",
      ],
      solution: `import math
import random

number = random.randint(1, 1000)

print(type(number))
print(math.sqrt(number))`,
    },
    {
      id: "p2",
      kind: "exercise",
      prompt: `### Problem 2: Input evaluator

*Skills: input(), string methods, writing and calling functions*

Define a function that takes a string and prints the index where \`"he"\` appears in it. It must ignore capitalisation, so \`"HEllo"\` behaves the same as \`"hello"\`.

Then read a line of input and call your function with it.

The lesson supplies \`HEllo there\` as the input, so you should see:

\`\`\`
HEllo there
0
\`\`\``,
      starter: `# Define your function, then read input and call it

`,
      stdin: ["HEllo there"],
      checks: [
        { kind: "stdoutLines", expected: ["HEllo there", "0"] },
        {
          kind: "sourceRequires",
          pattern: "def\\s+\\w+\\s*\\(",
          message: "Define a function.",
        },
        {
          kind: "callCount",
          name: "input",
          exactly: 1,
          message: "Read the string with input().",
        },
        {
          kind: "callCount",
          name: "lower",
          atLeast: 1,
          message:
            "Use lower() so capitalisation does not matter. Checking both cases by hand does not scale.",
        },
        {
          kind: "callCount",
          name: "find",
          atLeast: 1,
          message: "Use find() to locate the index.",
        },
      ],
      hints: [
        'Lowercase the whole string first, then search it. That way "HE", "He" and "he" all become "he".',
        "find() returns the index of the first match, or -1 if there is none.",
        "The echoed input line is printed for you. Your function only needs to print the index.",
      ],
      solution: `def find_he(text):
    print(text.lower().find("he"))


userInput = input()
find_he(userInput)`,
    },
  ],
};

export const unit2: Unit = {
  id: "py1-u2",
  slug: "modules-and-functions",
  title: "Modules and Functions",
  summary: "Use code other people wrote, then start writing your own functions.",
  lessons: [lesson1, lesson2, lesson3, progressCheck],
};
