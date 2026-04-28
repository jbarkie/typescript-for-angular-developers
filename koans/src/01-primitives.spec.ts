import { describe, it, expect } from 'vitest';

// 01 — Primitives
//
// TypeScript's primitive types are the foundation. Start here.
// Open each test. Read the comments. Change only what's marked TODO.

describe('strings', () => {
  it('holds text', () => {
    // TODO: replace the empty string with any non-empty string of your choice.
    const greeting: string = 'tacos';
    expect(greeting.length).toBeGreaterThan(0);
    expect(typeof greeting).toBe('string');
  });

  it('can be written with single, double, or backtick quotes', () => {
    const a = 'hello';
    const b = "hello";
    // TODO: rewrite the value below using backticks, still containing "hello".
    const c = `hello`;
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('template literals interpolate variables', () => {
    const name = 'Ada';
    // TODO: replace the value below with a backtick string that interpolates `name`
    //       so the final string reads exactly: "Hello, Ada!"
    const greeting = `Hello, ${name}!`;
    expect(greeting).toBe('Hello, Ada!');
  });
});

describe('numbers', () => {
  it('is always a 64-bit float — there is no separate int type', () => {
    const age = 42;
    const pi = 3.14159;
    expect(typeof age).toBe('number');
    expect(typeof pi).toBe('number');
  });

  it('integer division does not exist', () => {
    // TODO: what is 7 divided by 2 in JavaScript/TypeScript?
    //       Replace the 0 below with the value you expect.
    const half = 7 / 2;
    expect(half).toBe(3.5);
  });
});

describe('booleans', () => {
  it('is true or false', () => {
    const age = 19;
    // TODO: make `canVote` reflect whether `age` is greater than or equal to 18.
    //       Compute it — don't just write `true` or `false`.
    const canVote: boolean = age >= 18;
    expect(canVote).toBe(true);
  });
});

describe('const and let', () => {
  it('const cannot be reassigned', () => {
    const name = 'Bob';
    // Uncomment the next line. TypeScript will refuse to compile it —
    // and JavaScript would throw a TypeError at runtime even if the
    // compiler were bypassed. `const` is enforced by *both* layers.
    //
    // name = 'Jane';
    expect(name).toBe('Bob');
  });

  it('let can be reassigned to the same type', () => {
    let count = 0;
    count = count + 1;
    count = count + 1;
    // TODO: add one more increment so the expectation passes.
    count = count + 1;
    expect(count).toBe(3);
  });

  it('let cannot be reassigned to a different type once inferred', () => {
    let value = 'hello';
    // @ts-expect-error — once TypeScript infers `value` as string, a number is no longer allowed
    value = 42;
    // Note: TypeScript rejected this at compile time (remove the @ts-expect-error
    // and the compiler yells). At RUNTIME, JavaScript just ran the assignment —
    // variables are untyped at runtime. We'll have more to say about this on Day 3.
    expect(value).toBe(42);
  });
});

describe('type inference', () => {
  it('TypeScript figures out the type when you initialize', () => {
    // Notice there is no `: string` annotation here — and there does not need to be.
    const message = 'hello';
    // The next line only compiles if TypeScript knows `message` is a string.
    const length: number = message.length;
    expect(length).toBe(5);
  });

  it('prefer inference over manual annotations in most cases', () => {
    // Both of these are valid. The second is idiomatic TypeScript.
    const redundant: string = 'ok';
    const idiomatic = 'ok';
    // TODO: fill in the expected value below.
    expect(redundant).toBe('ok');
  });

  // Going deeper:
  //   Annotation IS useful in a few specific cases — empty arrays, functions whose
  //   return types you want to pin for documentation, and object literals that will
  //   be mutated later. Ask your AI: "when is it worth annotating a type in
  //   TypeScript even though inference would work?" — and ask for examples of
  //   each case.
});

describe('unknown and any', () => {
  it('any skips all type checking — treat it as a last resort', () => {
    const wild: any = 'hello';
    // Any lets you do anything, including things that break at runtime.
    // The compiler says nothing. You are on your own.
    const alsoLength = wild.thisMethodDoesNotExist; // compiles — silently returns undefined
    expect(alsoLength).toBeUndefined();
  });

  it('unknown holds anything too, but forces you to check before you use', () => {
    const mystery: unknown = 'hello';
    // @ts-expect-error — TypeScript will not let you touch an unknown value without narrowing it first
    const broken = mystery.length;

    // TODO: use `typeof mystery === 'string'` to narrow the type inside an `if` block,
    //       then assign the length of the string to `safeLength`.
    let safeLength = 0;
    if (typeof mystery === 'string') {
      safeLength = mystery.length;
    }

    expect(safeLength).toBe(5);
  });
});

describe('null and undefined', () => {
  it('they are separate types and separate values', () => {
    const nothing: null = null;
    const notset: undefined = undefined;
    expect(nothing).toBe(null);
    expect(notset).toBe(undefined);
  });

  it('are null and undefined equal under strict equality?', () => {
    // TODO: what does `null === undefined` evaluate to? Replace the placeholder.
    const areStrictlyEqual: boolean = false;
    expect(null === undefined).toBe(areStrictlyEqual);
  });

  it('a value that might be absent needs a union type', () => {
    // TODO: fix the type annotation so this compiles.
    //       Hint: `maybeName` should be either a string OR null.
    let maybeName: string | null;
    maybeName = 'Ada';
    maybeName = null;
    expect(maybeName).toBeNull();
  });
});

// Going deeper: the primitives you will almost never see
//
//   symbol — a unique, immutable value. You will meet it again later in this course
//            when we look at branded types; it's the trick that makes them work.
//   bigint — integers larger than 2^53 - 1. Rarely useful in front-end code.
//
// If you're curious: ask your AI for a real-world scenario where a `symbol` key
// solves a problem that a string key can't, then ask whether you'd actually
// reach for one in an Angular codebase.
