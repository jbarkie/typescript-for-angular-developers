# The Limits of TypeScript

We've spent most of this course on what TypeScript can do. For the last stretch, let's talk about what it can't.

## A scenario

The app you've been working on has a backend. For this course, the backend is mocked — but the mocks are real in the sense that the app doesn't know they're mocks. It makes HTTP requests. It gets JSON back. It displays things.

There's a scenario switcher built into the mocks. One scenario, deliberately broken, is called `malformed-data`. It returns data that *looks* like a catalog response but has wrong types — a `licenseCount` that's a string, a library entry missing its `license` field.

Flip to it. Watch the UI fall over.

The types didn't change. The component didn't change. The template didn't change. The TypeScript compiler is still strict. The build is green. And the app is broken.

What happened?

## Where TypeScript lives

TypeScript runs at compile time. When you write:

```ts
const payload = (await request.json()) as CatalogItem;
```

the compiler reads that cast and believes it. The `as` is not a check — it's a *promise* from you, the programmer, that the value on the right really is a `CatalogItem`. The compiler has no way to verify this. It can't. The value doesn't exist yet; at compile time, it's just a name.

When the app runs, TypeScript is gone. It has been compiled away. All that remains is JavaScript, holding whatever data actually arrived from the network. If you promised it would be a `CatalogItem` and it isn't, the compiler has no reason to know. It already left the building.

This is the gap. It's not a bug. It's the design.

TypeScript's job is to help you reason about your code while you're writing it. It isn't a runtime type checker — that would make every application bigger, slower, more verbose — and for most of the code you write, the inputs come from other code you wrote and can vouch for. Inside the perimeter of your own code, the compiler's reasoning is enough.

At the perimeter, though — where data crosses in from a network, a form, a file, a URL parameter — the compiler's reasoning stops working. Not because the compiler is weak, but because the compiler isn't there.

So we need a different tool.

## Zod — the inversion

The trick we've been pulling all course: write a type, write some code, let the compiler keep the code honest against the type.

Zod works the other direction.

With Zod, you write a *schema* — a value that describes a shape and can check data against it at runtime. The type is *derived* from the schema, not the other way around.

```ts
import { z } from 'zod';

const CatalogItemSchema = z.object({
  kind: z.literal('application'),
  id: z.string(),
  name: z.string(),
  vendor: z.string(),
  licenseCount: z.number(),
});

type CatalogItem = z.infer<typeof CatalogItemSchema>;
```

The schema is a real object. You can call methods on it. `CatalogItemSchema.parse(data)` runs at runtime and either returns a `CatalogItem` (guaranteed — it actually checked) or throws.

The type is what it's always been — a compile-time construct, erased before the code runs.

The two are linked. Change the schema, the type changes. You can't drift, because there's only one thing to change.

If you're used to writing types first, this reversal will feel strange. Sit with it. The value isn't that one order is cleverer than the other. The value is that runtime validation and compile-time types have become two views of the same definition. You write it once.

## `parse` and `safeParse`

Every Zod schema has two ways of running.

`.parse(data)` runs the schema. If the data matches, it returns the parsed value, typed as your derived TypeScript type. If it doesn't match, it throws. Reach for this when you'd rather throw than branch — at a boundary where bad data is exceptional, or in code that runs once during startup.

`.safeParse(data)` runs the schema and returns a *result*:

```ts
{ success: true; data: CatalogItem } | { success: false; error: ZodError }
```

Look at that type carefully. It's a discriminated union. The same shape you've been seeing all course — when we talked about modeling states, when we refactored the list page, now here at the very end.

That's not a coincidence. Once you've seen the shape, you start seeing it everywhere.

## Two layers

In the catalog app, the Zod schema and the signal form work together. Two layers. Two jobs.

**The form** (`@angular/forms/signals`) validates at the field level, in real time, while the user is typing. Required-ness. Minimum lengths. Formatting rules. These are checks the user can act on — "you forgot to fill in the name." Immediate feedback, close to where the action is happening.

**The schema** checks at the boundary. Before the payload goes on the wire, we `safeParse` it. The schema is the definitive contract with the rest of the world — the thing that says "this is what we'll send, and this is what we'll accept back."

Another way to think about it: the form is for the user. The schema is for the universe. The universe is a bigger and more indifferent place than the user, and it deserves the stricter check.

Both matter. The form catches things the user can fix; the schema catches things the user *can't*. When both are in place, failures become specific rather than mysterious — "your name is too short" vs. "something went wrong."

## What this buys you

Before: a type cast, a crossed-fingers HTTP call, and an application that silently breaks when the data doesn't match what you expected.

After: a type derived from a schema, a schema that checks at the boundary, and a failure mode that is explicit and handled. The bad payload doesn't render wrong — it becomes the `error` branch of your state type, which your template has already decided how to show.

You can feel the difference. Flip to the `malformed-data` scenario before you've added a schema: the UI falls over. Flip to it after: the app says "the server returned unexpected data." Small change in the code. Large change in what happens when things go wrong.

## How to write Angular code from now on

If one thing from this course travels home with you, let it be this.

Your types are a tool for reasoning about code that you wrote and can vouch for. Your schemas are a tool for reasoning about data you didn't write and can't vouch for. Both are valuable. Both have a place. The trick is knowing when you've crossed the boundary.

Every HTTP response is a boundary. Every form submission is a boundary. Every URL parameter, every `localStorage` read, every `postMessage`, every file upload. These are places where data arrives from somewhere you don't control. At each of them, a schema *can* earn its keep.

Not every boundary is worth the same rigor. A `localStorage` read for a minor UI preference — if it's missing or malformed, you show a default and nobody notices. Not worth a schema. A financial submission, or an auth response, or the initial load of data that drives the whole page — those you want to be specific and definitive about. Most of your boundaries are somewhere between, and the judgment is yours.

Think of it as a rough product: **likelihood of a problem times impact of a failure.** High-likelihood, high-impact boundaries get full schemas. Low-likelihood, low-impact boundaries get a quick null check and a shrug. The interesting thinking happens in the middle.

Inside the boundary, trust your types. Outside the boundary, trust your schemas where it matters. That's the shape of the practice.

---

Try this in your own app, not later this week — today:

> "In the Angular app I'm working on right now, where are the boundaries? List every place where data enters the app from somewhere the TypeScript compiler can't see."

Then look at each boundary and decide: is there a schema there? Should there be?

Ask your AI if you need a second opinion. But the list is yours to make.
