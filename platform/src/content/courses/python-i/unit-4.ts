import type { Lesson, Unit } from "@/content/types";

/**
 * Unit 4: Data Structures.
 *
 * Corrections and additions, kept visible so they are reviewable:
 *   - The notebooks name variables `list` and `dict`, which shadow Python's
 *     own built-in types. Renamed, and the reason is taught rather than
 *     silently fixed, because the resulting bug is baffling when you hit it.
 *   - L2 had no exercise at all. One is written here.
 *   - Progress check problem 2 said "element at index 0 of the first list
 *     corresponds to element at index 2 of the second list", which does not
 *     describe the task and cannot be satisfied. Dropped; the requirement is
 *     now stated plainly.
 *   - Progress check problem 3 said "a copy of the first of names" and never
 *     specified dictionary keys, so no two students could produce the same
 *     output. Keys are now given explicitly.
 */

const lesson1: Lesson = {
  id: "py1-u4-l1",
  slug: "lists-part-1",
  title: "Lists, Part 1",
  kind: "lesson",
  summary:
    "Hold many values in one variable, reach them by index, and add or remove items.",
  estimatedMinutes: 30,
  objectives: [
    "Create a list and print it",
    "Access items by positive and negative index",
    "Add and remove items with append, insert, remove and pop",
    "Loop over a list and test membership with in",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `Until now a variable has held one value. A **list** holds many, in order, under a single name.

Lists have three defining properties:

- **Ordered**: items keep the position you put them in
- **Mutable**: you can change, add and remove items after creating it
- **Dynamic**: they grow and shrink as needed, with no fixed size

You write one with square brackets and commas.`,
    },
    {
      id: "create-example",
      kind: "example",
      caption: "Two lists",
      code: `numbers = [1, 2, 3, 4, 5]

# A list can mix types, though in practice it usually should not
mixed = [1, "hello", 3.14, True]

print(numbers)
print(mixed)`,
      expectedOutput: "[1, 2, 3, 4, 5]\n[1, 'hello', 3.14, True]",
    },
    {
      id: "naming-warning",
      kind: "prose",
      markdown: `A note on naming before going further. It is tempting to call a list \`list\`, but \`list\` is already the name of Python's built-in list type. Reusing it replaces the original for the rest of your program, and the error you eventually get will point somewhere that looks completely unrelated.

The same applies to \`dict\`, \`str\`, \`type\` and \`sum\`. Name your list for what is in it: \`numbers\`, \`fruits\`, \`students\`.`,
    },
    {
      id: "index-example",
      kind: "example",
      caption: "Reading by position",
      code: `numbers = [1, 2, 3, 4, 5]

print(numbers[0])    # first item
print(numbers[2])    # third item
print(numbers[-1])   # last item
print(numbers[-2])   # second from last`,
      expectedOutput: "1\n3\n5\n4",
    },
    {
      id: "index-note",
      kind: "prose",
      markdown: `Indexing works exactly as it did for strings, starting at \`0\`. A string really is a sequence of characters, and a list a sequence of anything, so the same rules apply to both.

Negative indexes count from the end, and \`-1\` is the last item. That saves you writing \`numbers[len(numbers) - 1]\` every time.`,
    },
    {
      id: "modify-prose",
      kind: "prose",
      markdown: `## Changing a list

Unlike strings, lists are **mutable**, so you can change one in place:

- assign to an index to replace an item
- \`.append(x)\` adds to the end
- \`.insert(i, x)\` adds at a position
- \`.remove(x)\` deletes the first item equal to x
- \`.pop()\` removes and returns the last item`,
    },
    {
      id: "modify-example",
      kind: "example",
      caption: "Five ways to change a list",
      code: `numbers = [1, 2, 3, 4, 5]

numbers[1] = 10
print("After update:", numbers)

numbers.append(6)
print("After append:", numbers)

numbers.insert(2, 99)
print("After insert:", numbers)

numbers.remove(99)
print("After remove:", numbers)

numbers.pop()
print("After pop:", numbers)`,
      expectedOutput: `After update: [1, 10, 3, 4, 5]
After append: [1, 10, 3, 4, 5, 6]
After insert: [1, 10, 99, 3, 4, 5, 6]
After remove: [1, 10, 3, 4, 5, 6]
After pop: [1, 10, 3, 4, 5]`,
    },
    {
      id: "mutation-note",
      kind: "prose",
      markdown: `Notice that none of those methods were assigned to anything. \`numbers.append(6)\` changes \`numbers\` directly.

This is the opposite of string methods, where \`.upper()\` returns a new string and leaves the original alone. Strings are immutable so they must return something new; lists are mutable so they can change themselves. Writing \`numbers = numbers.append(6)\` is a common mistake, and it sets \`numbers\` to \`None\`.`,
    },
    {
      id: "loop-example",
      kind: "example",
      caption: "Looping over a list",
      code: `numbers = [1, 10, 3, 4, 5]

for num in numbers:
    print(num)`,
      expectedOutput: "1\n10\n3\n4\n5",
    },
    {
      id: "membership-example",
      kind: "example",
      caption: "Checking whether something is there",
      code: `numbers = [1, 10, 3, 4, 5]

print(10 in numbers)
print(99 in numbers)`,
      expectedOutput: "True\nFalse",
    },
    {
      id: "lists-exercise",
      kind: "exercise",
      prompt: `Starting from the list given, in order:

1. append \`"grape"\`
2. insert \`"kiwi"\` at position 1
3. remove \`"banana"\`
4. print the final list
5. print whether \`"kiwi"\` is in the list

\`\`\`
['apple', 'kiwi', 'cherry', 'grape']
True
\`\`\``,
      starter: `fruits = ["apple", "banana", "cherry"]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["['apple', 'kiwi', 'cherry', 'grape']", "True"],
        },
        {
          kind: "callCount",
          name: "append",
          atLeast: 1,
          message: "Use append() to add grape.",
        },
        {
          kind: "callCount",
          name: "insert",
          atLeast: 1,
          message: "Use insert() to place kiwi.",
        },
        {
          kind: "callCount",
          name: "remove",
          atLeast: 1,
          message: "Use remove() to take banana out.",
        },
      ],
      hints: [
        "insert() takes the position first, then the item: fruits.insert(1, 'kiwi').",
        "Do not assign the method calls to anything. They change the list directly.",
        "The membership test is printed with: print('kiwi' in fruits).",
      ],
      solution: `fruits = ["apple", "banana", "cherry"]

fruits.append("grape")
fruits.insert(1, "kiwi")
fruits.remove("banana")

print(fruits)
print("kiwi" in fruits)`,
    },
  ],
};

const lesson2: Lesson = {
  id: "py1-u4-l2",
  slug: "lists-part-2",
  title: "Lists, Part 2",
  kind: "lesson",
  summary:
    "Slice lists, use the common list methods, combine lists, and copy them without surprises.",
  estimatedMinutes: 30,
  objectives: [
    "Slice a list, including with a step",
    "Use len, index, count, sort and reverse",
    "Combine lists with + and extend",
    "Explain why assigning a list does not copy it",
  ],
  blocks: [
    {
      id: "slicing-prose",
      kind: "prose",
      markdown: `## Slicing lists

Lists slice exactly like strings: \`list[start:end:step]\`, with the start included and the end excluded.`,
    },
    {
      id: "slicing-example",
      kind: "example",
      caption: "Three slices",
      code: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(numbers[2:6])
print(numbers[::2])
print(numbers[::-1])`,
      expectedOutput:
        "[2, 3, 4, 5]\n[0, 2, 4, 6, 8]\n[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]",
    },
    {
      id: "slicing-note",
      kind: "prose",
      markdown: `The last one is worth remembering. A step of \`-1\` walks the list backwards, so \`[::-1]\` is the shortest way to reverse anything that slices, lists and strings alike.`,
    },
    {
      id: "methods-prose",
      kind: "prose",
      markdown: `## Common list methods

| Call | What it does |
| --- | --- |
| \`len(items)\` | how many items there are |
| \`.index(value)\` | position of the first match |
| \`.count(value)\` | how many times a value appears |
| \`.sort()\` | sorts the list in place |
| \`.reverse()\` | reverses the list in place |

\`len()\` is a plain function, written \`len(items)\`, while the rest are methods written \`items.sort()\`. The inconsistency is historical and simply has to be memorised.`,
    },
    {
      id: "methods-example",
      kind: "example",
      caption: "Inspecting and reordering",
      code: `numbers = [3, 1, 4, 1, 5, 9]

print("Length:", len(numbers))
print("Index of 4:", numbers.index(4))
print("Occurrences of 1:", numbers.count(1))

numbers.sort()
print("Sorted:", numbers)

numbers.reverse()
print("Reversed:", numbers)`,
      expectedOutput: `Length: 6
Index of 4: 2
Occurrences of 1: 2
Sorted: [1, 1, 3, 4, 5, 9]
Reversed: [9, 5, 4, 3, 1, 1]`,
    },
    {
      id: "combine-example",
      kind: "example",
      caption: "Two ways to join lists",
      code: `list1 = [1, 2, 3]
list2 = [4, 5, 6]

combined = list1 + list2
print("With +:", combined)

list1.extend(list2)
print("After extend:", list1)`,
      expectedOutput: "With +: [1, 2, 3, 4, 5, 6]\nAfter extend: [1, 2, 3, 4, 5, 6]",
    },
    {
      id: "combine-note",
      kind: "prose",
      markdown: `The results match, but the two differ in an important way. \`+\` builds a **new** list and leaves both originals alone. \`.extend()\` **changes** \`list1\` in place. Look at the example again: after it runs, \`list1\` is no longer \`[1, 2, 3]\`.`,
    },
    {
      id: "copy-prose",
      kind: "prose",
      markdown: `## Copying, and why assignment is not a copy

This one causes real bugs.

Writing \`b = a\` for a list does **not** make a copy. It gives the same list a second name. Change it through either name and both appear to change, because there was only ever one list.

To get an independent copy, use \`.copy()\` or a full slice, \`a[:]\`.`,
    },
    {
      id: "copy-trap-example",
      kind: "example",
      caption: "The trap, then the fix",
      code: `original = [1, 2, 3]

# NOT a copy, just a second name
same = original
same.append(4)
print("original:", original)

# An actual copy
real = original.copy()
real.append(99)
print("original:", original)
print("real:", real)`,
      expectedOutput:
        "original: [1, 2, 3, 4]\noriginal: [1, 2, 3, 4]\nreal: [1, 2, 3, 4, 99]",
    },
    {
      id: "lists2-exercise",
      kind: "exercise",
      prompt: `Using the list given, print four lines:

1. the first three scores
2. the scores reversed, using a slice
3. how many times \`7\` appears
4. the scores sorted, **without changing** the original list

Then print the original list to prove it is unchanged.

\`\`\`
[7, 2, 9]
[4, 7, 5, 9, 2, 7]
2
[2, 4, 5, 7, 7, 9]
[7, 2, 9, 5, 7, 4]
\`\`\``,
      starter: `scores = [7, 2, 9, 5, 7, 4]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "[7, 2, 9]",
            "[4, 7, 5, 9, 2, 7]",
            "2",
            "[2, 4, 5, 7, 7, 9]",
            "[7, 2, 9, 5, 7, 4]",
          ],
        },
        {
          kind: "callCount",
          name: "count",
          atLeast: 1,
          message: "Use count() for the number of sevens.",
        },
      ],
      hints: [
        "A slice of the first three is scores[:3].",
        "Reversing with a slice is scores[::-1].",
        "sort() changes the list in place, which would break the last line. Sort a copy instead.",
      ],
      solution: `scores = [7, 2, 9, 5, 7, 4]

print(scores[:3])
print(scores[::-1])
print(scores.count(7))

ordered = scores.copy()
ordered.sort()
print(ordered)

print(scores)`,
    },
  ],
};

const lesson3: Lesson = {
  id: "py1-u4-l3",
  slug: "tuples-and-dictionaries",
  title: "Tuples and Dictionaries",
  kind: "lesson",
  summary:
    "Fixed collections with tuples, and data you look up by name with dictionaries.",
  estimatedMinutes: 30,
  objectives: [
    "Create a tuple and explain when to prefer one over a list",
    "Create a dictionary and read values by key",
    "Add, update and remove dictionary entries",
    "Loop over keys, values and pairs",
  ],
  blocks: [
    {
      id: "tuples-prose",
      kind: "prose",
      markdown: `## Tuples

A **tuple** is an ordered collection like a list, with one difference: it is **immutable**. Once made, it cannot be changed.

You write one with parentheses instead of square brackets.`,
    },
    {
      id: "tuples-example",
      kind: "example",
      caption: "Creating tuples",
      code: `empty = ()
single = (1,)          # the comma is required
myTuple = (1, 2, 3, "hello")

print(myTuple)
print(myTuple[0])
print(len(myTuple))`,
      expectedOutput: "(1, 2, 3, 'hello')\n1\n4",
    },
    {
      id: "single-tuple-note",
      kind: "prose",
      markdown: `That trailing comma in \`(1,)\` is not a typo. Without it, \`(1)\` is just the number 1 in brackets, the same way \`(2 + 3)\` is 5. The comma is what makes it a tuple.

**When to use one.** If a collection should not change, a tuple says so, and Python will enforce it. Coordinates, a date as \`(year, month, day)\`, a fixed configuration. Reaching for a tuple is a way of writing down an intention that a reader can rely on.`,
    },
    {
      id: "tuple-immutable-demo",
      kind: "errorDemo",
      caption: "Trying to change a tuple",
      code: `coordinates = (10, 20)

coordinates[0] = 99`,
      expectedError: "TypeError",
      explanation: `The same **TypeError** you saw when trying to change a string, for the same reason. Reading \`coordinates[0]\` is fine; assigning to it is not.

If a value genuinely needs to change, it should have been a list.`,
    },
    {
      id: "dicts-prose",
      kind: "prose",
      markdown: `## Dictionaries

A **dictionary** stores **key-value pairs**. Instead of looking something up by position, you look it up by name.

This matters as soon as data has structure. A person as a list, \`["Alice", 25, "New York"]\`, forces you to remember that age lives at index 1. The same person as a dictionary lets you ask for \`person["age"]\`.

Keys must be unique. Values can be anything.`,
    },
    {
      id: "dicts-example",
      kind: "example",
      caption: "Creating and reading",
      code: `person = {"name": "Alice", "age": 25, "city": "New York"}

print(person)
print(person["name"])
print(person.get("age"))`,
      expectedOutput:
        "{'name': 'Alice', 'age': 25, 'city': 'New York'}\nAlice\n25",
    },
    {
      id: "get-note",
      kind: "prose",
      markdown: `There are two ways to read a value, and they fail differently.

\`person["age"]\` raises a **KeyError** if the key is missing, stopping the program. \`person.get("age")\` returns \`None\` instead.

Use square brackets when the key should definitely be there, so a mistake is loud. Use \`.get()\` when it is genuinely optional.`,
    },
    {
      id: "dicts-modify-example",
      kind: "example",
      caption: "Adding, updating and removing",
      code: `person = {"name": "Alice", "age": 25, "city": "New York"}

person["job"] = "Engineer"   # adds a new key
person["age"] = 26           # updates an existing one
print(person)

del person["city"]           # removes a key
job = person.pop("job")      # removes it and hands it back

print(person)
print("Removed:", job)`,
      expectedOutput: `{'name': 'Alice', 'age': 26, 'city': 'New York', 'job': 'Engineer'}
{'name': 'Alice', 'age': 26}
Removed: Engineer`,
    },
    {
      id: "dicts-loop-example",
      kind: "example",
      caption: "Three ways to loop",
      code: `person = {"name": "Alice", "age": 26}

for key in person:
    print("Key:", key)

for value in person.values():
    print("Value:", value)

for key, value in person.items():
    print(key, "->", value)`,
      expectedOutput: `Key: name
Key: age
Value: Alice
Value: 26
name -> Alice
age -> 26`,
    },
    {
      id: "loop-note",
      kind: "prose",
      markdown: `Looping over a dictionary directly gives you the **keys**. Use \`.values()\` for the values, and \`.items()\` when you want both at once.

That last form unpacks each pair into two variables in one step, and it is the one you will reach for most.`,
    },
    {
      id: "dicts-exercise",
      kind: "exercise",
      prompt: `Using the dictionary given, in order:

1. print the value of \`itemThree\` using \`.get()\`
2. add \`itemFour\` with the value \`4\`
3. print \`itemFour\` **without** using \`.get()\`
4. change \`itemTwo\` to \`0\`
5. loop with \`.items()\` and print each pair as \`key -> value\`
6. delete \`itemOne\` with \`del\`
7. remove \`itemFour\` with \`.pop()\` and print what came back
8. print the final dictionary

\`\`\`
3
4
itemOne -> 1
itemTwo -> 0
itemThree -> 3
itemFour -> 4
4
{'itemTwo': 0, 'itemThree': 3}
\`\`\``,
      starter: `items = {"itemOne": 1, "itemTwo": 2, "itemThree": 3}

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "3",
            "4",
            "itemOne -> 1",
            "itemTwo -> 0",
            "itemThree -> 3",
            "itemFour -> 4",
            "4",
            "{'itemTwo': 0, 'itemThree': 3}",
          ],
        },
        {
          kind: "callCount",
          name: "get",
          atLeast: 1,
          message: "Use .get() for the first line.",
        },
        {
          kind: "callCount",
          name: "items",
          atLeast: 1,
          message: "Use .items() for the loop.",
        },
        {
          kind: "callCount",
          name: "pop",
          atLeast: 1,
          message: "Use .pop() to remove itemFour.",
        },
      ],
      hints: [
        "Dictionaries keep insertion order, so itemFour appears last in the loop.",
        'Print the pair with: print(key, "->", value).',
        "pop() returns the value it removed, so you can print it directly.",
      ],
      solution: `items = {"itemOne": 1, "itemTwo": 2, "itemThree": 3}

print(items.get("itemThree"))

items["itemFour"] = 4
print(items["itemFour"])

items["itemTwo"] = 0

for key, value in items.items():
    print(key, "->", value)

del items["itemOne"]

removed = items.pop("itemFour")
print(removed)

print(items)`,
    },
  ],
};

const progressCheck: Lesson = {
  id: "py1-u4-pc",
  slug: "progress-check",
  title: "Unit 4 Progress Check",
  kind: "progressCheck",
  summary:
    "Three problems combining loops, conditionals, lists, tuples and dictionaries.",
  estimatedMinutes: 40,
  objectives: [
    "Filter a list by type",
    "Build tuples by pairing two lists",
    "Assemble dictionaries from parallel lists",
  ],
  blocks: [
    {
      id: "intro",
      kind: "prose",
      markdown: `The final check. These problems pull in everything: loops from Unit 3, functions and types from Unit 2, and the structures from this unit.`,
    },
    {
      id: "p1",
      kind: "exercise",
      prompt: `### Problem 1: Filtering by type

*Skills: for loops, type(), lists, conditionals*

Create a new empty list. Loop through \`vals\`, add every value that is **not** an integer to the new list, and print it.

\`\`\`
['Bob', 'Suzy']
\`\`\``,
      starter: `vals = [10, 0, "Bob", 89, "Suzy"]

`,
      checks: [
        { kind: "stdoutLines", expected: ["['Bob', 'Suzy']"] },
        {
          kind: "sourceRequires",
          pattern: "\\bfor\\b",
          message: "Loop through the list.",
        },
        {
          kind: "callCount",
          name: "append",
          atLeast: 1,
          message: "Build the new list with append().",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "Print the finished list once, after the loop.",
        },
      ],
      hints: [
        "type(value) != int tests whether something is not an integer.",
        "Create the empty list before the loop, not inside it.",
        "The print goes after the loop, so it is not indented.",
      ],
      solution: `vals = [10, 0, "Bob", 89, "Suzy"]

nonIntegers = []

for value in vals:
    if type(value) != int:
        nonIntegers.append(value)

print(nonIntegers)`,
    },
    {
      id: "p2",
      kind: "exercise",
      prompt: `### Problem 2: Pairing into tuples

*Skills: for loops, list slicing, list methods, tuples*

\`ages\` has eight entries but there are only four people.

1. Take the **first half** of \`ages\`
2. Reverse it
3. Pair each person with the age at the same position, as a tuple
4. Collect those tuples into a list and print it

\`\`\`
[('Bob', 65), ('Suzy', 78), ('Ali', 46), ('Julian', 27)]
\`\`\``,
      starter: `ages = [27, 46, 78, 65, 55, 101, 21, 36]
people = ["Bob", "Suzy", "Ali", "Julian"]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: ["[('Bob', 65), ('Suzy', 78), ('Ali', 46), ('Julian', 27)]"],
        },
        {
          kind: "sourceRequires",
          pattern: "\\bfor\\b",
          message: "Build the pairs with a loop.",
        },
        {
          kind: "callCount",
          name: "print",
          exactly: 1,
          message: "Print the finished list once.",
        },
      ],
      hints: [
        "The first half of an eight-item list is ages[:4].",
        "Reverse it with a slice, ages[:4][::-1], or with .reverse() on a copy.",
        "Loop over a range of positions so you can index both lists at once: for i in range(len(people)).",
      ],
      solution: `ages = [27, 46, 78, 65, 55, 101, 21, 36]
people = ["Bob", "Suzy", "Ali", "Julian"]

firstHalf = ages[:4]
firstHalf.reverse()

pairs = []

for i in range(len(people)):
    pairs.append((people[i], firstHalf[i]))

print(pairs)`,
    },
    {
      id: "p3",
      kind: "exercise",
      prompt: `### Problem 3: Building dictionaries

*Skills: for loops, list methods, dictionaries*

Make a copy of \`firstNames\` and reverse the copy. That reversed copy is the list of last names, so every list now lines up by position.

Then build one dictionary per person with exactly these four keys, in this order, and print each on its own line:

\`firstName\`, \`lastName\`, \`age\`, \`profession\`

\`\`\`
{'firstName': 'Rose', 'lastName': 'Gerald', 'age': 32, 'profession': 'Marine Biologist'}
{'firstName': 'Smith', 'lastName': 'Carter', 'age': 45, 'profession': 'Accountant'}
{'firstName': 'Carter', 'lastName': 'Smith', 'age': 19, 'profession': 'Doctor'}
{'firstName': 'Gerald', 'lastName': 'Rose', 'age': 88, 'profession': 'Retired'}
\`\`\``,
      starter: `firstNames = ["Rose", "Smith", "Carter", "Gerald"]
ages = [32, 45, 19, 88]
professions = ["Marine Biologist", "Accountant", "Doctor", "Retired"]

`,
      checks: [
        {
          kind: "stdoutLines",
          expected: [
            "{'firstName': 'Rose', 'lastName': 'Gerald', 'age': 32, 'profession': 'Marine Biologist'}",
            "{'firstName': 'Smith', 'lastName': 'Carter', 'age': 45, 'profession': 'Accountant'}",
            "{'firstName': 'Carter', 'lastName': 'Smith', 'age': 19, 'profession': 'Doctor'}",
            "{'firstName': 'Gerald', 'lastName': 'Rose', 'age': 88, 'profession': 'Retired'}",
          ],
        },
        {
          kind: "callCount",
          name: "copy",
          atLeast: 1,
          message:
            "Copy the list before reversing it, or you will destroy firstNames.",
        },
        {
          kind: "sourceRequires",
          pattern: "\\bfor\\b",
          message: "Build the dictionaries with a loop.",
        },
      ],
      hints: [
        "If you reverse firstNames directly instead of a copy, the first names are wrong too. This is the copy trap from lesson 2.",
        "Dictionaries print their keys in insertion order, so add them in the order given.",
        "Loop over positions with for i in range(len(firstNames)) so you can index all four lists.",
      ],
      solution: `firstNames = ["Rose", "Smith", "Carter", "Gerald"]
ages = [32, 45, 19, 88]
professions = ["Marine Biologist", "Accountant", "Doctor", "Retired"]

lastNames = firstNames.copy()
lastNames.reverse()

people = []

for i in range(len(firstNames)):
    person = {
        "firstName": firstNames[i],
        "lastName": lastNames[i],
        "age": ages[i],
        "profession": professions[i],
    }
    people.append(person)

for person in people:
    print(person)`,
    },
  ],
};

export const unit4: Unit = {
  id: "py1-u4",
  slug: "data-structures",
  title: "Data Structures",
  summary: "Hold many values at once with lists, tuples and dictionaries.",
  lessons: [lesson1, lesson2, lesson3, progressCheck],
};
