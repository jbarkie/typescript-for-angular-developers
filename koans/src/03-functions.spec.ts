import { describe, it, expect } from 'vitest';

// 03 — Functions
//
// Functions are values in JavaScript. That one sentence changes a lot.
// If you are coming from C#, Java, or similar, some of what follows will feel
// unusual. Sit with it — by the end of the file, functions-as-values will stop
// feeling exotic and start feeling useful.

describe('function declarations', () => {
  it('takes inputs and returns an output', () => {
    // TODO: implement `add` so it returns the sum of its two arguments.
    function add(a: number, b: number): number {
      return 0;
    }
    expect(add(2, 3)).toBe(5);
    expect(add(10, 20)).toBe(30);
  });

  it('return types can usually be inferred', () => {
    // No return-type annotation here. TypeScript figures it out.
    function multiply(a: number, b: number) {
      return a * b;
    }
    // TODO: what is the inferred return type of `multiply`?
    //       Fix the annotation on `product` so this compiles.
    const product: string = multiply(4, 5);
    expect(product).toBe(20);
  });
});

describe('arrow functions', () => {
  it('a compact form for short functions', () => {
    // Two equivalent ways to write the same function.
    function squareA(n: number): number {
      return n * n;
    }
    const squareB = (n: number): number => n * n;

    // TODO: write a third version using the arrow form, with a block body and an explicit return.
    const squareC = (n: number): number => 0;

    expect(squareA(4)).toBe(16);
    expect(squareB(4)).toBe(16);
    expect(squareC(4)).toBe(16);
  });

  it('a single-expression arrow can omit the braces and the return keyword', () => {
    // TODO: rewrite this as a one-liner with no braces and no `return`.
    const double = (n: number): number => {
      return n * 2;
    };
    expect(double(3)).toBe(6);
  });

  // Going deeper:
  //   Arrow functions and the `function` keyword differ in how they handle `this`.
  //   This will bite you eventually in Angular code that uses older APIs.
  //   Ask your AI: "show me an example where replacing `function() {...}` with an
  //   arrow function changes behavior, specifically around `this`." Then ask
  //   whether you'd ever see the non-arrow form in modern Angular code.
});

describe('optional and default parameters', () => {
  it('optional parameters use a ? and may be undefined at call-time', () => {
    // TODO: add a `?` to make `title` optional.
    function greet(name: string, title: string): string {
      if (title === undefined) {
        return `Hello, ${name}`;
      }
      return `Hello, ${title} ${name}`;
    }
    expect(greet('Ada')).toBe('Hello, Ada');
    expect(greet('Ada', 'Dr.')).toBe('Hello, Dr. Ada');
  });

  it('default parameters provide a fallback — no check required', () => {
    // TODO: give `exclamations` a default value of 1 so the first call works.
    function shout(message: string, exclamations: number): string {
      return message + '!'.repeat(exclamations);
    }
    expect(shout('hey')).toBe('hey!');
    expect(shout('hey', 3)).toBe('hey!!!');
  });
});

describe('rest parameters', () => {
  it('rest parameters gather remaining arguments into an array', () => {
    // TODO: implement `sum` using the rest-parameter syntax so it adds any number of args.
    //       Hint: `...numbers: number[]` in the parameter list.
    function sum(): number {
      return 0;
    }
    expect(sum(1, 2, 3)).toBe(6);
    expect(sum(10, 20, 30, 40)).toBe(100);
    expect(sum()).toBe(0);
  });
});

describe('functions as values — the mental shift', () => {
  // The rest of this file leans on this idea:
  //   a function is a value, the same way a number or a string is a value.
  // You can put one in a variable, pass it around, return it from other functions.
  // If you've used event handlers in Angular or LINQ lambdas in C#, you've been
  // doing this — probably without thinking of it this way.

  it('a function can be assigned to a variable', () => {
    const greet = (name: string): string => `Hello, ${name}`;

    // TODO: call `greet` with any name and assert on the result.
    const result = '';
    expect(result).toBe('Hello, Grace');
  });

  it('a function can be passed as an argument to another function', () => {
    // `applyTwice` takes a function and a value, and applies the function twice.
    function applyTwice(fn: (n: number) => number, value: number): number {
      return fn(fn(value));
    }

    const addOne = (n: number): number => n + 1;

    // TODO: pass `addOne` to `applyTwice` with the starting value 5.
    const result = 0;
    expect(result).toBe(7);
  });

  it('a function can return another function', () => {
    // This is where it starts to feel different.
    // `makeMultiplier` takes a number and returns a function that multiplies by that number.
    function makeMultiplier(factor: number): (n: number) => number {
      return (n) => n * factor;
    }

    const triple = makeMultiplier(3);
    const tenX = makeMultiplier(10);

    // TODO: use `triple` and `tenX` to make these assertions pass.
    expect(triple(4)).toBe(0);
    expect(tenX(7)).toBe(0);
  });

  it('you can describe the shape of a function as a type', () => {
    // Just as `type Person = { name: string }` describes an object's shape,
    // a function type describes what a function takes and returns.
    type Formatter = (input: string) => string;

    // TODO: implement `shout` and `whisper` so both match the Formatter shape.
    const shout: Formatter = (input) => '';
    const whisper: Formatter = (input) => '';

    expect(shout('hello')).toBe('HELLO');
    expect(whisper('hello')).toBe('(hello)');
  });

  // Going deeper:
  //   A function type written as `type Greeter = (name: string) => string` is
  //   what older languages call a "delegate" or a "function pointer." In TS/JS,
  //   it's just a type. This is why Angular's signals, pipes, and effects feel
  //   lighter than their older-framework equivalents — there's no ceremony
  //   around passing behavior around.
  //
  //   Ask your AI to contrast a C# delegate with a TS function type, and ask
  //   what's actually different beyond syntax.
});

describe('higher-order functions on arrays — map, filter, reduce', () => {
  // If you've used LINQ — Select, Where, Aggregate — you have already done this.
  // Same three ideas, fewer brackets.

  const prices = [9.99, 14.5, 29.99, 4.25, 49.0];

  it('map transforms every item in an array', () => {
    // The for-loop way (what you might write out of habit):
    const withTaxLoop: number[] = [];
    for (const p of prices) {
      withTaxLoop.push(p * 1.08);
    }

    // The map way:
    // TODO: use .map to produce the same array — each price multiplied by 1.08.
    const withTaxMap: number[] = [];

    expect(withTaxMap).toEqual(withTaxLoop);
  });

  it('filter keeps items that match a predicate', () => {
    // TODO: use .filter to keep only prices above 10.
    const overTen: number[] = [];
    expect(overTen).toEqual([14.5, 29.99, 49.0]);
  });

  it('reduce combines an array into a single value', () => {
    // The second argument to reduce is the starting value.
    // TODO: use .reduce to sum all the prices.
    const total = 0;
    expect(total).toBeCloseTo(107.73, 2);
  });

  it('chaining reads top-to-bottom like a pipeline', () => {
    type CatalogItem = { name: string; category: string; price: number; approved: boolean };

    const catalog: CatalogItem[] = [
      { name: 'Editor Pro', category: 'editor', price: 99, approved: true },
      { name: 'Old Editor', category: 'editor', price: 29, approved: false },
      { name: 'Shell Plus', category: 'terminal', price: 0, approved: true },
      { name: 'Diagrammer', category: 'graphics', price: 149, approved: true },
    ];

    // TODO: compute the total price of approved items using filter and reduce (in one chain).
    //       Hint: items.filter(...).reduce(...)
    const approvedTotal = 0;
    expect(approvedTotal).toBe(248);

    // TODO: produce a list of just the names of approved items, using filter and map.
    const approvedNames: string[] = [];
    expect(approvedNames).toEqual(['Editor Pro', 'Shell Plus', 'Diagrammer']);
  });

  // Going deeper:
  //   `reduce` is the most powerful and the most misused of the three. Any
  //   `map` or `filter` can technically be written as a `reduce`, but that
  //   doesn't mean you should. Ask your AI:
  //     "When is reduce the right tool, and when is it someone showing off?"
  //   And: "How does a .reduce() expression compare to a for-loop in terms of
  //   readability and performance for a team that isn't deeply familiar with
  //   functional style?"
});
