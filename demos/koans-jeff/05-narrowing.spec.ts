import { describe, it, expect } from 'vitest';

// INSTRUCTOR COPY — 05 Narrowing
//
// Solutions inline. Student-facing TODOs preserved as STUDENT comments so you
// can see at a glance what they were asked to do.
//
// Full demo choreography and "watch out for" notes:
//   instructor-guide/koans-lead-ins.md § 05
//
// ARC NOTE: This file is the engine room for Day 3. Type predicates especially
// — they're the bridge to Zod's safeParse return type. If students get these
// concepts, the Day 3 capstone is already half-installed.
//
// NEXT-TIME NOTES (scratchpad for during/after class — fold in next revision):
// -
// -
// -

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
  // INSTRUCTOR: Open the file with a live demo of hovering inside/outside the
  // `if`. The comment *after* the first koan is where the "thinking tool" beat
  // is made explicit — `you wrote an if, the compiler followed`. Experience
  // before explanation; the koan comes first, the narration comes after.

  it('checking typeof tells the compiler what you have', () => {
    function lengthOf(value: string | number): number {
      // STUDENT: inside the `if`, return `value.length`.
      //          Outside, the value is a number — return the number itself.
      if (typeof value === 'string') {
        return value.length;
      }
      return value;
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
  // INSTRUCTOR: Deliberately uses `if (name)` to catch BOTH null AND empty string.
  // If a student writes `if (name !== null)`, the empty-string case fails and
  // they get a teachable moment — that's the "Going deeper" bait. Let them
  // discover it; truthy-vs-nullish is one of the classic JS footguns.

  it('a truthy check narrows nullable values', () => {
    function greet(name: string | null): string {
      // STUDENT: if `name` is truthy (non-null, non-empty), return `Hello, ${name}`.
      //          Otherwise return `Hello, stranger`.
      if (name) {
        return `Hello, ${name}`;
      }
      return 'Hello, stranger';
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
  // INSTRUCTOR: Short, easy section. The non-obvious bit is that comparing two
  // unions narrows BOTH to their shared members. Most students get this from
  // context without an explanation — worth the 30 seconds to name it explicitly
  // if someone looks puzzled.

  it('comparing two values can narrow them both', () => {
    function sameOrDefault(a: string | undefined, b: string | undefined): string {
      // STUDENT: if a and b are strictly equal, return their value (pick either — the compiler
      //          now knows they are both the same string). Otherwise return 'default'.
      if (a === b && a !== undefined) {
        return a;
      }
      return 'default';
    }
    expect(sameOrDefault('yes', 'yes')).toBe('yes');
    expect(sameOrDefault('yes', 'no')).toBe('default');
    expect(sameOrDefault(undefined, undefined)).toBe('default');
  });
});

describe('`in` operator narrowing', () => {
  // INSTRUCTOR: Works for unions of object types with different shapes (no
  // shared discriminant). Students should know this exists but most real
  // code prefers a discriminant. This is for "shapes from a library I don't
  // control" situations.

  it('checking for a property narrows to shapes that have it', () => {
    type Cat = { name: string; purr: () => string };
    type Dog = { name: string; bark: () => string };
    type Pet = Cat | Dog;

    function sound(pet: Pet): string {
      // STUDENT: use the `in` operator to check whether `pet` has a `bark` method.
      //          If it does, call it. Otherwise call `.purr()`.
      if ('bark' in pet) {
        return pet.bark();
      }
      return pet.purr();
    }

    const fido: Dog = { name: 'Fido', bark: () => 'woof' };
    const whiskers: Cat = { name: 'Whiskers', purr: () => 'prrr' };
    expect(sound(fido)).toBe('woof');
    expect(sound(whiskers)).toBe('prrr');
  });
});

describe('discriminated-union narrowing — the cleanest of them all', () => {
  // INSTRUCTOR: Callback to file 04. Same CatalogItem shape. Emphasize that
  // this is the pattern they'll use MOST often in real Angular code — any
  // time they have domain state with variant shapes, the discriminant check
  // is the narrow. Preview: Day 2 PM list-page refactor uses exactly this.

  it('checking the discriminant narrows to one specific variant', () => {
    function applicationVendor(item: CatalogItem): string {
      // STUDENT: inside the `if`, `item` is narrowed to `ApplicationEntry`.
      //          Return `item.vendor` there.
      //          Outside, return 'n/a'.
      if (item.kind === 'application') {
        return item.vendor;
      }
      return 'n/a';
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
    // STUDENT: complete the switch. For each variant, return a different-shaped summary:
    //   'application' → `app:${name}`
    //   'library'     → `lib:${name}@${version}`
    //   'service'     → `svc:${name}($${monthlyCost})`
    function summarize(item: CatalogItem): string {
      switch (item.kind) {
        case 'application':
          return `app:${item.name}`;
        case 'library':
          return `lib:${item.name}@${item.version}`;
        case 'service':
          return `svc:${item.name}($${item.monthlyCost})`;
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
  // INSTRUCTOR: Protect time here. This is the *trust* moment — a type predicate
  // is a promise. The compiler believes what you say, even if the implementation
  // is wrong. Frame it as trust; foreshadow Day 3: "we'll use this pattern to
  // turn Zod's runtime checks into compile-time knowledge."
  //
  // The koan has a deliberate trap: students must fix the RETURN TYPE, not just
  // the implementation. If they only change the body, the calling code still
  // can't narrow. Let them stumble; it's the lesson.

  it('a type predicate function lets the compiler trust your check', () => {
    // STUDENT: write a type predicate that returns true when the value is a non-empty string,
    //          and narrows the value to `string` when it does.
    //          Signature: `function isNonEmptyString(v: unknown): v is string { ... }`
    function isNonEmptyString(v: unknown): v is string {
      return typeof v === 'string' && v.length > 0;
    }

    const candidate: unknown = 'hello';
    let result = '';
    if (isNonEmptyString(candidate)) {
      // STUDENT: assign the uppercased value to `result` once the predicate return type is fixed.
      result = candidate.toUpperCase();
    }
    expect(result).toBe('HELLO');

    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
  });

  it('a domain-specific predicate narrows to a domain type', () => {
    // STUDENT: write a predicate `isApplication(item: CatalogItem): item is ApplicationEntry`
    //          that checks the `kind` field. (Yes, you could do this inline — but extracting
    //          it as a predicate lets you reuse it in filter/find/etc. with narrowed results.)
    function isApplication(item: CatalogItem): item is ApplicationEntry {
      return item.kind === 'application';
    }

    const catalog: CatalogItem[] = [
      { kind: 'application', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 },
      { kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' },
      { kind: 'service', name: 'Notifier', url: 'https://ntfy.sh', monthlyCost: 12 },
    ];

    // With the predicate fixed, filter will narrow the element type:
    const apps = catalog.filter(isApplication);
    // STUDENT: sum the licenseCount across the filtered apps.
    //          This line should compile without casting once the predicate is correct.
    const totalLicenses = apps.reduce((acc, a) => acc + a.licenseCount, 0);

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
  // INSTRUCTOR: Sibling concept to predicates. Mention, don't dwell. The
  // key mental model: predicates branch; assertion functions throw. Same
  // underlying idea, different ergonomics. The sidebar points students at
  // when to reach for which.

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
      // STUDENT: call `assertIsString(input)` here. After that call, TypeScript
      //          knows `input` is a string — no `if` required.
      assertIsString(input);
      return input.toUpperCase();
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
