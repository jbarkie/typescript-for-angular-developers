import { describe, it, expect } from 'vitest';

// 05 — Narrowing
//
// Narrowing is the most useful thing the TypeScript type system does.
//
// When you check a value — `typeof x === 'string'`, `'id' in obj`, `user !== null` —
// the compiler follows along. Inside that check, it knows more about the value
// than it did on the line above. Your code and the type system are reasoning
// together.
//
// Most of the "types as a thinking tool" payoff comes from this.

type ApplicationEntry = {
  kind: 'application';
  name: string;
  vendor: string;
  licenseCount: number;
};

type LibraryEntry = {
  kind: 'library';
  name: string;
  version: string;
  license: 'MIT' | 'Apache-2.0' | 'proprietary';
};

type ServiceEntry = {
  kind: 'service';
  name: string;
  url: string;
  monthlyCost: number;
};

type CatalogItem = ApplicationEntry | LibraryEntry | ServiceEntry;

describe('typeof narrowing', () => {
  it('checking typeof tells the compiler what you have', () => {
    function lengthOf(value: string | number): number {
      // TODO: inside the `if`, return `value.length`.
      //       Outside, the value is a number — return the number itself.
      if (typeof value === 'string') {
        return 0;
      }
      return 0;
    }
    expect(lengthOf('hello')).toBe(5);
    expect(lengthOf(42)).toBe(42);
  });

  // Look at that. On line 1 of the function, `value` is `string | number`.
  // Inside the `if`, it's narrowed to `string` — `.length` works without any cast.
  // Outside, it's narrowed to `number`.
  // You wrote an `if`. The compiler followed. That's narrowing.
});

describe('truthiness narrowing', () => {
  it('a truthy check narrows nullable values', () => {
    function greet(name: string | null): string {
      // TODO: if `name` is truthy (non-null, non-empty), return `Hello, ${name}`.
      //       Otherwise return `Hello, stranger`.
      if (name) {
        return '';
      }
      return '';
    }
    expect(greet('Ada')).toBe('Hello, Ada');
    expect(greet(null)).toBe('Hello, stranger');
    expect(greet('')).toBe('Hello, stranger');
  });

  // Going deeper:
  //   Truthiness is seductive and occasionally wrong. `0` is falsy. `''` is falsy.
  //   If a `string | null` is `''`, a truthy check treats it the same as `null` —
  //   which may or may not be what you want.
  //   Ask your AI: "show me a TypeScript bug where a truthy check hid a real
  //   value, and a case where an explicit `!== null` check would have caught it."
});

describe('equality narrowing', () => {
  it('comparing two values can narrow them both', () => {
    function sameOrDefault(a: string | undefined, b: string | undefined): string {
      // TODO: if a and b are strictly equal, return their value (pick either — the compiler
      //       now knows they are both the same string). Otherwise return 'default'.
      if (a === b && a !== undefined) {
        return '';
      }
      return '';
    }
    expect(sameOrDefault('yes', 'yes')).toBe('yes');
    expect(sameOrDefault('yes', 'no')).toBe('default');
    expect(sameOrDefault(undefined, undefined)).toBe('default');
  });
});

describe('`in` operator narrowing', () => {
  it('checking for a property narrows to shapes that have it', () => {
    type Cat = { name: string; purr: () => string };
    type Dog = { name: string; bark: () => string };
    type Pet = Cat | Dog;

    function sound(pet: Pet): string {
      // TODO: use the `in` operator to check whether `pet` has a `bark` method.
      //       If it does, call it. Otherwise call `.purr()`.
      if ('bark' in pet) {
        return '';
      }
      return '';
    }

    const fido: Dog = { name: 'Fido', bark: () => 'woof' };
    const whiskers: Cat = { name: 'Whiskers', purr: () => 'prrr' };
    expect(sound(fido)).toBe('woof');
    expect(sound(whiskers)).toBe('prrr');
  });
});

describe('discriminated-union narrowing — the cleanest of them all', () => {
  // This is the one you will reach for most often in real Angular code.
  // When you have modeled your domain as a discriminated union, narrowing is
  // just a check on the discriminant.

  it('checking the discriminant narrows to one specific variant', () => {
    function applicationVendor(item: CatalogItem): string {
      // TODO: inside the `if`, `item` is narrowed to `ApplicationEntry`.
      //       Return `item.vendor` there.
      //       Outside, return 'n/a'.
      if (item.kind === 'application') {
        return '';
      }
      return '';
    }
    expect(
      applicationVendor({
        kind: 'application',
        name: 'Editor Pro',
        vendor: 'Acme',
        licenseCount: 50,
      }),
    ).toBe('Acme');

    expect(
      applicationVendor({ kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' }),
    ).toBe('n/a');
  });

  it('a `switch` on the discriminant gives every branch its own shape', () => {
    // TODO: complete the switch. For each variant, return a different-shaped summary:
    //   'application' → `app:${name}`
    //   'library'     → `lib:${name}@${version}`
    //   'service'     → `svc:${name}($${monthlyCost})`
    function summarize(item: CatalogItem): string {
      switch (item.kind) {
        case 'application':
          return '';
        case 'library':
          return '';
        case 'service':
          return '';
      }
    }
    expect(
      summarize({ kind: 'application', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 }),
    ).toBe('app:Editor Pro');

    expect(
      summarize({ kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' }),
    ).toBe('lib:lodash@4.17.21');

    expect(
      summarize({ kind: 'service', name: 'Notifier', url: 'https://ntfy.sh', monthlyCost: 12 }),
    ).toBe('svc:Notifier($12)');
  });
});

describe('user-defined type predicates — teaching the compiler your reasoning', () => {
  // Sometimes the compiler cannot figure out the narrowing from a built-in check.
  // You can write a function that tells the compiler what you learned:
  //
  //   function isFoo(x: unknown): x is Foo { ... }
  //
  // That `x is Foo` return annotation is a *type predicate*. When the function
  // returns true, the compiler narrows `x` to `Foo` in the calling code.
  //
  // This is the tool you will use to turn runtime checks (including ones backed
  // by libraries like Zod, which we'll meet later) into type-level knowledge.

  it('a type predicate function lets the compiler trust your check', () => {
    // TODO: write a type predicate that returns true when the value is a non-empty string,
    //       and narrows the value to `string` when it does.
    //       Signature: `function isNonEmptyString(v: unknown): v is string { ... }`
    function isNonEmptyString(v: unknown): boolean {
      return typeof v === 'string' && v.length > 0;
    }

    const candidate: unknown = 'hello';
    if (isNonEmptyString(candidate)) {
      // With the predicate in place, the next line should compile:
      // candidate.toUpperCase();
      // TODO: assign the uppercased value to `result` once the predicate return type is fixed.
      const result = '';
      expect(result).toBe('HELLO');
    }

    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
  });

  it('a domain-specific predicate narrows to a domain type', () => {
    // TODO: write a predicate `isApplication(item: CatalogItem): item is ApplicationEntry`
    //       that checks the `kind` field. (Yes, you could do this inline — but extracting
    //       it as a predicate lets you reuse it in filter/find/etc. with narrowed results.)
    function isApplication(item: CatalogItem): boolean {
      return item.kind === 'application';
    }

    const catalog: CatalogItem[] = [
      { kind: 'application', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 },
      { kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' },
      { kind: 'service', name: 'Notifier', url: 'https://ntfy.sh', monthlyCost: 12 },
    ];

    // With the predicate fixed, filter will narrow the element type:
    const apps = catalog.filter(isApplication);
    // TODO: sum the licenseCount across the filtered apps.
    //       This line should compile without casting once the predicate is correct.
    const totalLicenses = 0;

    expect(apps.length).toBe(1);
    expect(totalLicenses).toBe(50);
  });

  // Going deeper:
  //   Type predicates are trust. The compiler believes whatever you claim in the
  //   return type — so if your implementation is wrong, the compiler will happily
  //   propagate the wrong narrowing. This is the single biggest footgun in the
  //   TypeScript type system.
  //   Ask your AI: "give me a type predicate whose return type lies about the
  //   actual check. What happens downstream when the predicate is believed?"
});

describe('assertion functions — narrow by throwing', () => {
  it('an assertion function narrows by promising not to return on failure', () => {
    // An assertion function is a sibling of a type predicate.
    // Where a predicate returns true/false, an assertion function returns void —
    // but is typed as `asserts v is T`, which tells the compiler: "if I return at
    // all, v is T. If it wasn't, I threw."

    function assertIsString(v: unknown): asserts v is string {
      if (typeof v !== 'string') {
        throw new Error('not a string');
      }
    }

    function processInput(input: unknown): string {
      // TODO: call `assertIsString(input)` here. After that call, TypeScript
      //       knows `input` is a string — no `if` required.
      return '';
    }

    expect(processInput('hello')).toBe('HELLO');
    expect(() => processInput(42)).toThrow();
  });

  // Going deeper:
  //   Assertion functions are great for the "one bad input ruins everything"
  //   pattern at a boundary — where you'd rather throw than branch.
  //   Ask your AI: "when would I reach for an assertion function instead of a
  //   type predicate? What are the trade-offs in error handling?"
});
