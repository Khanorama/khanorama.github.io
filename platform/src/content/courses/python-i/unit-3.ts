import type { Lesson, Unit } from "@/content/types";

/**
 * Unit 3: Control Flow.
 *
 * Corrections and additions, kept visible so they are reviewable:
 *   - The notebooks write statements as `number = 10;`. Semicolons are a habit
 *     from C and Java and are not idiomatic Python. Removed.
 *   - Indentation was 2 spaces in places. Normalised to 4, per PEP 8, since
 *     indentation is syntax in Python and students copy what they are shown.
 *   - None of the three lessons had a single exercise. All exercises here are
 *     written for this platform.
 *
 * The infinite loop in L3 is kept and made runnable on purpose. In a notebook
 * it hangs the kernel, so it could only ever be described. Here the runner
 * stops it after ten seconds and says why, which turns a warning into
 * something a student can safely watch happen.
 */

const lesson1: Lesson = {
  id: "py1-u3-l1",
  slug: "conditionals",
  title: "Conditionals",
  kind: "lesson",
  summary:
    "Branch between different paths with if, elif and else, and combine conditions with logic.",
  estimatedMinutes: 30,
  objectives: [
    "Write an if statement that runs only when a condition holds",
    "Add else and elif to handle the other cases",
    "Explain why indentation decides what belongs to a branch",
    "Combine conditions with and, or and not",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `Everything you have written so far runs top to bottom, every line, every time. **Conditionals** are what let a program decide, so it can behave differently depending on its data.

This rests directly on Booleans from Unit 1. A condition is just an expression that evaluates to \`True\` or \`False\`, and the conditional acts on the answer.`,
    },
    {
      id: "if-prose",
      kind: "prose",
      markdown: `## The if statement

An \`if\` runs a block of code only when its condition is \`True\`. If the condition is \`False\`, the block is skipped entirely.`,
    },
    {
      id: "if-example",
      kind: "example",
      caption: "Your first conditional",
      code: `number = 10

if number > 0:
    print("The number is positive!")`,
      expectedOutput: "The number is positive!",
    },
    {
      id: "if-anatomy",
      kind: "prose",
      markdown: `Three parts are doing work here:

- \`if\` starts the statement
- \`number > 0\` is the condition, which evaluates to \`True\` or \`False\`
- the **colon** at the end of the line says "the block starts here"

Then the indented line is the block. **Indentation is not decoration in Python, it is syntax.** The indented lines are what belongs to the \`if\`. In most other languages curly braces do this job; in Python, whitespace does.

Change \`10\` to \`-10\` and run it again. Nothing prints, because the block is skipped.`,
    },
    {
      id: "else-prose",
      kind: "prose",
      markdown: `## else

An \`else\` gives you the other path: it runs when the \`if\` condition is \`False\`. Between them, exactly one of the two blocks always runs.`,
    },
    {
      id: "else-example",
      kind: "example",
      caption: "Handling both cases",
      code: `number = -3

if number > 0:
    print("The number is positive!")
else:
    print("The number is not positive.")`,
      expectedOutput: "The number is not positive.",
    },
    {
      id: "elif-prose",
      kind: "prose",
      markdown: `## elif

\`elif\` is short for "else if", and it lets you test more than two possibilities. You can chain as many as you need.

One rule matters: Python checks them **in order** and stops at the first one that is \`True\`. Everything after that is skipped, even if it would also have been true. Order your conditions from most specific to most general.`,
    },
    {
      id: "elif-example",
      kind: "example",
      caption: "Three possible outcomes",
      code: `number = 0

if number > 0:
    print("The number is positive!")
elif number < 0:
    print("The number is negative!")
else:
    print("The number is zero!")`,
      expectedOutput: "The number is zero!",
    },
    {
      id: "nested-prose",
      kind: "prose",
      markdown: `## Nesting conditionals

A conditional can live inside another one, letting you ask a follow-up question only when the first answer warrants it.

The example below uses \`%\`, the **modulo** operator, which gives the remainder of a division. \`number % 2\` is \`0\` when a number divides evenly by two, so \`number % 2 == 0\` is the standard way to test for even.`,
    },
    {
      id: "nested-example",
      kind: "example",
      caption: "A question inside a question",
      code: `number = 4

if number > 0:
    if number % 2 == 0:
        print("The number is positive and even!")
    else:
        print("The number is positive and odd!")
else:
    print("The number is not positive.")`,
      expectedOutput: "The number is positive and even!",
    },
    {
      id: "logical-prose",
      kind: "prose",
      markdown: `## Combining conditions

Rather than nesting, you can often join conditions with **logical operators**:

- \`and\` is \`True\` only when **both** sides are true
- \`or\` is \`True\` when **at least one** side is true
- \`not\` flips a Boolean to its opposite`,
    },
    {
      id: "logical-example",
      kind: "example",
      caption: "Testing a range with and",
      code: `number = 7

if number > 0 and number <= 10:
    print("The number is positive and between 1 and 10!")
else:
    print("The number does not meet the criteria.")`,
      expectedOutput: "The number is positive and between 1 and 10!",
    },
    {
      id: "equality-warning",
      kind: "errorDemo",
      caption: "A single equals sign in a condition",
      code: `number = 5

if number = 5:
    print("Five!")`,
      expectedError: "SyntaxError",
      explanation: `This is the \`=\` versus \`==\` trap from Unit 1, now in the place it does the most damage.

\`=\` **assigns** a value. \`==\` **asks** whether two things are equal. A condition has to be a question, so Python refuses this outright with a **SyntaxError**.

Being rejected immediately is lucky. In some languages this is valid code that silently does the wrong thing forever.`,
    },
    {
      id: "conditionals-exercise",
      kind: "exercise",
      prompt: `Write a function called \`describe\` that takes one number and prints:

- \`positive\` if it is greater than zero
- \`negative\` if it is less than zero
- \`zero\` otherwise

Then call it with \`7\`, \`-3\` and \`0\`, giving:

\`\`\`
positive
negative
zero
\`\`\``,
      starter: `# Define describe() here


# Then call it three times

`,
      checks: [
        { kind: "stdoutLines", expected: ["positive", "negative", "zero"] },
        {
          kind: "sourceRequires",
          pattern: "def\\s+describe\\s*\\(",
          message: "Define a function called describe.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\belif\\b",
          message: "Use elif for the middle case rather than three separate ifs.",
        },
        {
          kind: "callCount",
          name: "describe",
          exactly: 3,
          message: "Call describe() exactly three times.",
        },
      ],
      hints: [
        "The function body needs if, elif and else, all indented inside the def.",
        "The else branch needs no condition. If it is neither positive nor negative, it must be zero.",
      ],
      solution: `def describe(number):
    if number > 0:
        print("positive")
    elif number < 0:
        print("negative")
    else:
        print("zero")


describe(7)
describe(-3)
describe(0)`,
    },
  ],
};

const lesson2: Lesson = {
  id: "py1-u3-l2",
  slug: "for-loops",
  title: "For Loops",
  kind: "lesson",
  summary:
    "Repeat an action across a sequence or a range of numbers, without repeating yourself.",
  estimatedMinutes: 30,
  objectives: [
    "Write a for loop over a sequence",
    "Generate numbers with range(), including start, stop and step",
    "Iterate in reverse",
    "Filter items by combining a loop with an if",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `A **for loop** repeats a block of code once for each item in a sequence. It is the tool for "do this to everything in here".

Everything in this lesson replaces copy and paste. Three print statements for three fruits is tolerable; three hundred is not, and a loop handles both identically.`,
    },
    {
      id: "basic-example",
      kind: "example",
      caption: "Looping over a list",
      code: `fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)`,
      expectedOutput: "apple\nbanana\ncherry",
    },
    {
      id: "basic-anatomy",
      kind: "prose",
      markdown: `Reading that out loud: "for each fruit in fruits, print the fruit".

- \`fruits\` is the sequence being walked through
- \`fruit\` is a variable the loop creates for you, holding one item at a time
- the indented block runs once per item

You choose the loop variable's name. \`fruit\` is good precisely because it says what one item is. Singular name for one item, plural for the collection, is a habit worth forming now.`,
    },
    {
      id: "reversed-example",
      kind: "example",
      caption: "Going backwards",
      code: `fruits = ["apple", "banana", "cherry"]

for fruit in reversed(fruits):
    print(fruit)`,
      expectedOutput: "cherry\nbanana\napple",
    },
    {
      id: "range-prose",
      kind: "prose",
      markdown: `## Counting with range()

Often you want to repeat something a set number of times rather than walk a list. \`range()\` generates a sequence of numbers for exactly that.

It takes up to three arguments:

- **start**, where it begins, included, defaulting to 0
- **stop**, where it ends, **excluded** and required
- **step**, how much to add each time, defaulting to 1

That exclusive stop is the same rule as string slicing, and the same source of off-by-one mistakes.`,
    },
    {
      id: "range-example",
      kind: "example",
      caption: "range(5) gives five numbers, starting at zero",
      code: `for num in range(5):
    print(num)`,
      expectedOutput: "0\n1\n2\n3\n4",
    },
    {
      id: "range-note",
      kind: "prose",
      markdown: `\`range(5)\` produces \`0, 1, 2, 3, 4\`. Five numbers, but ending at 4, because the stop value is excluded.

If you want 1 to 5, write \`range(1, 6)\`.`,
    },
    {
      id: "step-example",
      kind: "example",
      caption: "Stepping by two",
      code: `for num in range(0, 11, 2):
    print(num)`,
      expectedOutput: "0\n2\n4\n6\n8\n10",
    },
    {
      id: "step-note",
      kind: "prose",
      markdown: `Here the stop is \`11\` rather than \`10\`, because stop is excluded and we want \`10\` included. A negative step counts downwards, so \`range(10, 0, -1)\` goes from 10 to 1.`,
    },
    {
      id: "filter-example",
      kind: "example",
      caption: "A loop with an if inside it",
      code: `for num in range(1, 11):
    if num % 2 == 0:
        print(num)`,
      expectedOutput: "2\n4\n6\n8\n10",
    },
    {
      id: "filter-note",
      kind: "prose",
      markdown: `Two levels of indentation now. The \`if\` is inside the loop, and the \`print\` is inside the \`if\`. The loop visits all ten numbers; the \`if\` decides which ones get printed.

Getting indentation wrong here changes the meaning rather than causing an error, which is why it is worth being deliberate about.`,
    },
    {
      id: "for-exercise",
      kind: "exercise",
      prompt: `Use a \`for\` loop and \`range()\` to print the squares of the numbers 1 through 5:

\`\`\`
1
4
9
16
25
\`\`\`

Write **one** \`print()\` statement inside a loop. Five separate prints will not be accepted.`,
      starter: `# One loop, one print

`,
      checks: [
        { kind: "stdoutLines", expected: ["1", "4", "9", "16", "25"] },
        {
          kind: "sourceRequires",
          pattern: "\\bfor\\b",
          message: "Use a for loop.",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "Use exactly one print(), inside the loop.",
        },
        {
          kind: "callCount",
          name: "range",
          atLeast: 1,
          message: "Generate the numbers with range().",
        },
      ],
      hints: [
        "range(1, 6) gives you 1 through 5, because the stop value is excluded.",
        "A number squared is the number multiplied by itself, or num ** 2.",
      ],
      solution: `for num in range(1, 6):
    print(num * num)`,
    },
  ],
};

const lesson3: Lesson = {
  id: "py1-u3-l3",
  slug: "while-loops",
  title: "While Loops",
  kind: "lesson",
  summary:
    "Repeat while a condition holds, stop early with break, skip with continue, and avoid looping forever.",
  estimatedMinutes: 30,
  objectives: [
    "Write a while loop that terminates",
    "Explain what causes an infinite loop",
    "Exit a loop early with break",
    "Skip one iteration with continue",
    "Choose between a for loop and a while loop",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `A **while loop** repeats for as long as its condition stays \`True\`.

The difference from a \`for\` loop is knowledge. A \`for\` loop is for when you know what you are iterating over: these five fruits, those ten numbers. A \`while\` loop is for when you do not know how many repetitions it will take, only when to stop.`,
    },
    {
      id: "basic-example",
      kind: "example",
      caption: "Counting to five",
      code: `count = 1

while count <= 5:
    print("Count is:", count)
    count += 1`,
      expectedOutput:
        "Count is: 1\nCount is: 2\nCount is: 3\nCount is: 4\nCount is: 5",
    },
    {
      id: "basic-anatomy",
      kind: "prose",
      markdown: `Three things have to be true for a while loop to work, and all three are visible above:

1. The variable is **set up before** the loop. \`count = 1\`.
2. The condition can **become false**. \`count <= 5\` will fail once count passes 5.
3. Something inside the loop **moves it towards** that. \`count += 1\`.

\`count += 1\` is shorthand for \`count = count + 1\`.

Miss the third and the loop never ends.`,
    },
    {
      id: "infinite-loop-demo",
      kind: "example",
      caption: "An infinite loop. Run it, this is safe here",
      tone: "warning",
      code: `count = 0

while count < 5:
    print("Count is:", count)
    # The increment is missing, so count never changes
    # and the condition is never false`,
    },
    {
      id: "infinite-loop-note",
      kind: "prose",
      markdown: `That is an **infinite loop**. \`count\` stays \`0\` forever, so \`count < 5\` is always \`True\`.

Run it and watch what happens. After about ten seconds the page stops it and tells you why. On your own machine nothing would stop it: the program would hang, spew output until it ran out of memory, and you would have to kill it yourself.

Now fix it. Add \`count += 1\` as the last line inside the loop and run it again.

This is the one genuinely dangerous mistake in this unit, and it is always the same mistake: the condition depends on something the loop never changes.`,
    },
    {
      id: "break-prose",
      kind: "prose",
      markdown: `## break

\`break\` exits a loop immediately, whatever the condition says. It is for when you have found what you were looking for and there is no reason to keep going.`,
    },
    {
      id: "break-example",
      kind: "example",
      caption: "Leaving early",
      code: `count = 1

while count <= 5:
    print("Count is:", count)
    if count == 3:
        print("Breaking the loop!")
        break
    count += 1`,
      expectedOutput:
        "Count is: 1\nCount is: 2\nCount is: 3\nBreaking the loop!",
    },
    {
      id: "continue-prose",
      kind: "prose",
      markdown: `## continue

\`continue\` abandons the current pass and jumps straight to the next one. Use it to skip items you do not care about.

In a \`while\` loop \`continue\` is genuinely hazardous, because it skips the rest of the block, **including anything that updates your loop variable**. Note how the example below has to increment \`count\` before the \`continue\`, or it would hang exactly like the loop above.`,
    },
    {
      id: "continue-while-example",
      kind: "example",
      caption: "continue in a while loop, with the trap avoided",
      code: `count = 1

while count <= 5:
    if count == 3:
        count += 1   # must happen BEFORE continue
        continue
    print("Count is:", count)
    count += 1`,
      expectedOutput:
        "Count is: 1\nCount is: 2\nCount is: 4\nCount is: 5",
    },
    {
      id: "continue-for-example",
      kind: "example",
      caption: "The same thing with a for loop",
      code: `for count in range(1, 6):
    if count == 3:
        continue
    print("Count is:", count)`,
      expectedOutput:
        "Count is: 1\nCount is: 2\nCount is: 4\nCount is: 5",
    },
    {
      id: "which-loop",
      kind: "prose",
      markdown: `Those two produce identical output, and the \`for\` version is plainly better. It cannot loop forever, because \`range\` is finite and the loop variable is managed for you.

That is the rule worth taking away:

- **for** when the number of repetitions is known or you are walking a collection
- **while** when you are waiting for a condition and cannot know how long that takes

If you find yourself writing a \`while\` loop with a counter you increment by hand, a \`for\` loop is almost always the better choice.`,
    },
    {
      id: "while-exercise",
      kind: "exercise",
      prompt: `Use a \`while\` loop to count down from 5 to 1, then print \`Liftoff!\`:

\`\`\`
5
4
3
2
1
Liftoff!
\`\`\`

Make sure your loop actually ends.`,
      starter: `count = 5

# Your while loop here


`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["5", "4", "3", "2", "1", "Liftoff!"],
        },
        {
          kind: "sourceRequires",
          pattern: "\\bwhile\\b",
          message: "Use a while loop.",
        },
        {
          kind: "callCount",
          name: "print",
          atMost: 2,
          message:
            "One print inside the loop and one for Liftoff. Printing each number separately defeats the point.",
        },
      ],
      hints: [
        "Counting down means subtracting. count -= 1 is shorthand for count = count - 1.",
        "The loop should run while count is greater than or equal to 1.",
        "Liftoff! prints after the loop finishes, so it is not indented inside it.",
      ],
      solution: `count = 5

while count >= 1:
    print(count)
    count -= 1

print("Liftoff!")`,
    },
  ],
};

const progressCheck: Lesson = {
  id: "py1-u3-pc",
  slug: "progress-check",
  title: "Unit 3 Progress Check",
  kind: "progressCheck",
  summary:
    "Five problems covering conditionals, for loops, while loops, break and continue.",
  estimatedMinutes: 40,
  objectives: [
    "Combine a loop with a conditional",
    "Control iteration with range start, stop and step",
    "Use continue to skip and break to stop",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `Five problems covering the whole unit. Match the expected output exactly, including capitalisation.`,
    },
    {
      id: "p1",
      kind: "exercise",
      prompt: `### Problem 1

Iterate over \`numbers\` and print whether each one is even or odd, in this exact format:

\`\`\`
1 is odd
2 is even
3 is odd
4 is even
5 is odd
\`\`\``,
      starter: `numbers = [1, 2, 3, 4, 5]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "1 is odd",
            "2 is even",
            "3 is odd",
            "4 is even",
            "5 is odd",
          ],
        },
        {
          kind: "sourceRequires",
          pattern: "\\bfor\\b",
          message: "Use a for loop.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\bif\\b",
          message: "Decide even or odd with a conditional.",
        },
      ],
      hints: [
        "number % 2 == 0 is True for even numbers.",
        'To join a number and text, use print(number, "is odd") with a comma. Python adds the space.',
      ],
      solution: `numbers = [1, 2, 3, 4, 5]

for number in numbers:
    if number % 2 == 0:
        print(number, "is even")
    else:
        print(number, "is odd")`,
    },
    {
      id: "p2",
      kind: "exercise",
      prompt: `### Problem 2

Using a \`for\` loop and \`reversed()\`, print the fruits in reverse order:

\`\`\`
date
cherry
banana
apple
\`\`\``,
      starter: `fruits = ["apple", "banana", "cherry", "date"]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["date", "cherry", "banana", "apple"],
        },
        {
          kind: "callCount",
          name: "reversed",
          atLeast: 1,
          message: "Use the reversed() function.",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "One print, inside the loop.",
        },
      ],
      hints: ["reversed(fruits) can go straight into the for statement."],
      solution: `fruits = ["apple", "banana", "cherry", "date"]

for fruit in reversed(fruits):
    print(fruit)`,
    },
    {
      id: "p3",
      kind: "exercise",
      prompt: `### Problem 3

Using \`range()\`, print every **third** number between 10 and 50, including both ends where they fall on the sequence:

\`\`\`
10
13
16
19
22
25
28
31
34
37
40
43
46
49
\`\`\``,
      starter: ``,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "10",
            "13",
            "16",
            "19",
            "22",
            "25",
            "28",
            "31",
            "34",
            "37",
            "40",
            "43",
            "46",
            "49",
          ],
        },
        {
          kind: "callCount",
          name: "range",
          atLeast: 1,
          message: "Use range() with a step value.",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "One print, inside the loop.",
        },
      ],
      hints: [
        "range() takes three arguments: start, stop and step.",
        "The stop value is excluded, so to include 49 you need to stop above it.",
      ],
      solution: `for number in range(10, 51, 3):
    print(number)`,
    },
    {
      id: "p4",
      kind: "exercise",
      prompt: `### Problem 4

Loop through the numbers 1 to 20 and print:

- \`Divisible by both\` when the number divides by 3 **and** 5
- \`Divisible by 3\` when it only divides by 3
- \`Divisible by 5\` when it only divides by 5

Skip everything else using \`continue\`. Order matters: check the "both" case first, or 15 will be reported wrongly.`,
      starter: ``,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "Divisible by 3",
            "Divisible by 5",
            "Divisible by 3",
            "Divisible by 3",
            "Divisible by 5",
            "Divisible by 3",
            "Divisible by both",
            "Divisible by 3",
            "Divisible by 5",
          ],
        },
        {
          kind: "sourceRequires",
          pattern: "\\bcontinue\\b",
          message: "Use continue to skip the numbers that match nothing.",
        },
      ],
      hints: [
        "Test the combined case first with: if number % 3 == 0 and number % 5 == 0.",
        "The continue goes in the branch where the number divides by neither.",
      ],
      solution: `for number in range(1, 21):
    if number % 3 == 0 and number % 5 == 0:
        print("Divisible by both")
    elif number % 3 == 0:
        print("Divisible by 3")
    elif number % 5 == 0:
        print("Divisible by 5")
    else:
        continue`,
    },
    {
      id: "p5",
      kind: "exercise",
      prompt: `### Problem 5

Write a \`while\` loop that counts from 1 to 10, but:

- skips printing \`3\` using \`continue\`
- stops entirely when the number reaches \`5\`, using \`break\`

\`\`\`
1
2
4
\`\`\`

Be careful: \`continue\` in a while loop skips the rest of the block, so make sure your counter still advances.`,
      starter: `count = 1

`,
      checks: [
        { kind: "stdoutLines", expected: ["1", "2", "4"] },
        {
          kind: "sourceRequires",
          pattern: "\\bwhile\\b",
          message: "Use a while loop.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\bcontinue\\b",
          message: "Skip the 3 with continue.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\bbreak\\b",
          message: "Stop at 5 with break.",
        },
      ],
      hints: [
        "Check for 5 and break before you print, otherwise 5 appears in the output.",
        "Increment the counter before continue, or the loop will hang on 3.",
      ],
      solution: `count = 1

while count <= 10:
    if count == 5:
        break
    if count == 3:
        count += 1
        continue
    print(count)
    count += 1`,
    },
  ],
};

export const unit3: Unit = {
  id: "py1-u3",
  slug: "control-flow",
  title: "Control Flow",
  summary: "Make decisions and repeat work without repeating yourself.",
  lessons: [lesson1, lesson2, lesson3, progressCheck],
};
