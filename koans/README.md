# TypeScript Koans

Small, focused exercises. Open a file, read the tests, make them pass by filling in the blanks.

## A note on the name

"Koan" comes from Zen Buddhist practice — a short story, question, or riddle a teacher gives a student, not to be solved with logic but to be sat with until something gives way. Famous ones: "What is the sound of one hand clapping?", "Does a dog have Buddha nature?" The student returns with a demonstration of their understanding, the teacher accepts or rejects, and the cycle continues. The point is never the answer. It's the changing mind.

The technical-koan format isn't ours. It comes from **Ruby Koans**, created by Jim Weirich and Joe O'Brien around 2009. Failing tests; each one a small turn of the wheel; you move from red to green and, with any luck, understand a little more about the language than you did five minutes ago. Weirich was a rare kind of teacher — the kind who could make hard things feel obvious without making you feel small for finding them hard. He passed away in 2014. If you ever want to see the form done well, the original Ruby Koans is still online and still worth your time.

These TypeScript koans aren't formally related to that project. But they're the same idea, grateful for the pattern, aimed at the same thing: understanding, not just a green bar.

## Setup

```bash
npm install
npm test
```

That runs Vitest in watch mode. Save a file, the tests re-run.

There's a second feedback loop that matters too:

```bash
npm run typecheck
```

This runs the TypeScript compiler over everything. It catches *compile-time* errors — the ones that would stop your Angular project from building. Some of the koans specifically teach what the type checker can catch at compile time and what it can't catch until runtime. Run both, notice the difference between the two kinds of feedback.

## How to use these

Each file covers one area (primitives, objects, functions, defining types, narrowing, utility types, and so on). Inside a file, each `describe` block groups one idea, and each `it` teaches one small thing.

Most tests fail when you open them. Your job is to change what's marked `TODO` until the test passes.

You will see three kinds of prompts:

- **"Fill in a value."** The test has a placeholder value that's wrong. Replace it with something that makes the expectation pass.
- **"Fix a type."** The type annotation is wrong or missing. Change it so the code compiles.
- **`// @ts-expect-error`** lines. These tell TypeScript "we *expect* this line to have a type error." Leave these alone. They are part of the teaching — they prove the type system catches a specific kind of mistake.

## A note on AI

You are going to be tempted to paste a failing test into an AI and ask for the answer. Try not to. The point of these exercises is to build the mental model — and the mental model doesn't form if you outsource the thinking.

Here's a better way to use AI with the koans:

- **Stuck?** Ask *"what is this test trying to teach me?"* instead of *"what's the answer?"*
- **Solved it but don't know why it worked?** Ask *"explain this solution to me in a different way"* — and keep asking for new framings until one clicks.
- **Solved it easily?** Ask *"what are the ways my solution could go wrong in a larger codebase?"* The answer is rarely nothing.
- **Want more?** Ask AI to generate a harder variation of the same idea and give it to you as a new failing test.

The koans ship with `Going deeper` sidebars in the comments. Those are optional — they point to questions an advanced student might ask, with suggested AI prompts you can use to chase them down on your own.

## File order

Files are numbered. Each one assumes you've been through the earlier ones. If something in a later file feels like it came out of nowhere, back up — the build-up is probably in `03` or `04`.
