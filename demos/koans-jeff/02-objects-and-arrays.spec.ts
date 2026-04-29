import { describe, it, expect } from 'vitest';

// INSTRUCTOR COPY — 02 Objects and Arrays
//
// Solutions inline. Student-facing TODOs preserved as STUDENT comments so you
// can see at a glance what they were asked to do.
//
// Full demo choreography and "watch out for" notes:
//   instructor-guide/koans-lead-ins.md § 02
//
// NEXT-TIME NOTES (scratchpad for during/after class — fold in next revision):
// -
// -
// -

describe('object shapes', () => {
  // INSTRUCTOR: The first test's `as any` is a deliberate cheating-escape that
  // students should remove. If a student keeps `as any`, the runtime test will
  // pass against `'forty-something'` being a string (typeof). They need to
  // replace it with a number. Good opportunity to name `as any` as a code smell.

  it('a type describes what properties an object has and what they hold', () => {
    type Person = { name: string; age: number };
    // STUDENT: fix the object below so it actually matches the Person type.
    //          Remove the `as any` escape hatch — that's cheating, and the compiler is telling you so.
    const jeff: Person = { name: 'Jeff', age: 42 };
    expect(jeff.name).toBe('Jeff');
    expect(typeof jeff.age).toBe('number');
  });

  it('optional properties use a ? after the property name', () => {
    // STUDENT: the `email` property is sometimes missing. Change the type so `email` is optional.
    type Contact = { name: string; email?: string };

    const withEmail: Contact = { name: 'Ada', email: 'ada@example.com' };
    const withoutEmail: Contact = { name: 'Grace' };

    expect(withEmail.email).toBe('ada@example.com');
    expect(withoutEmail.email).toBeUndefined();
  });

  it('readonly properties cannot be reassigned after the object is built', () => {
    type Point = { readonly x: number; readonly y: number };
    const origin: Point = { x: 0, y: 0 };
    // Uncomment the next line. TypeScript will refuse — `readonly` blocks assignment.
    // (`readonly` is a compile-time check. JavaScript has no runtime equivalent.
    //  We're going to keep noticing this gap. Day 3 is all about it.)
    //
    // origin.x = 10;
    expect(origin.x).toBe(0);
  });

  // Going deeper:
  //   `readonly` is shallow. It stops reassignment of the property, not mutation
  //   of an object that lives on the property.
  //   Ask your AI: "show me a readonly object in TypeScript whose contents can
  //   still be mutated, and explain why the compiler allows it."
});

describe('type vs interface', () => {
  // INSTRUCTOR: One koan, one message — both work, course uses `type`. If a
  // student pushes on differences, point at the "Going deeper" below and
  // keep moving. The "IFoo-for-every-Foo" verbal riff lands here if it fits.

  it('both can describe an object shape', () => {
    type PersonT = { name: string };
    interface PersonI {
      name: string;
    }

    const a: PersonT = { name: 'Ada' };
    const b: PersonI = { name: 'Ada' };

    // Structurally identical. One was declared with `type`, the other with `interface`,
    // and the compiler doesn't care.
    expect(a).toEqual(b);
  });

  // We will use `type` throughout this course. The two produce nearly the same
  // thing for object shapes, and `type` handles a few patterns (unions,
  // intersections, mapped types) that `interface` can't touch cleanly.
  //
  // Going deeper:
  //   `interface` has one feature `type` does not: declaration merging. If you
  //   declare the same interface name twice in the same scope, the declarations
  //   combine. This is mostly useful for extending third-party types.
  //   Ask your AI to show you when interface merging saves the day — and when
  //   it causes a bug that's hard to find.
});

describe('arrays', () => {
  // INSTRUCTOR: The `noUncheckedIndexedAccess` koan at the end causes the most
  // friction — it's stricter than default Angular tsconfigs. Say out loud:
  // "this project has it on; the Angular app you'll see later does not. This is
  // so you feel the narrowing here before it becomes optional there."

  it('an array of T can be written T[] or Array<T>', () => {
    const primes1: number[] = [2, 3, 5, 7, 11];
    // STUDENT: rewrite the type annotation below using the Array<T> form instead of T[].
    const primes2: Array<number> = [2, 3, 5, 7, 11];
    expect(primes1).toEqual(primes2);
  });

  it('TypeScript infers the element type from the initializer', () => {
    const names = ['Ada', 'Grace', 'Margaret'];
    // TypeScript knows `names` is string[]. The test asserts on that:
    // STUDENT: pick the right type for `first`.
    const first: string | undefined = names[0];
    expect(first).toBe('Ada');
  });

  it('pushing the wrong type into a typed array is a compile error', () => {
    const ages: number[] = [20, 30, 40];
    // The @ts-expect-error below is the whole point: TypeScript catches the bad push at compile time.
    // (At runtime, JavaScript will happily push anyway — types are erased by then.
    //  You're seeing the compile-time / runtime gap in miniature. We'll name it on Day 3.)
    // @ts-expect-error — you cannot push a string into a number[]
    ages.push('fifty');
    // Compile-time: the @ts-expect-error above proves TS caught it.
    // Runtime: JavaScript ran the push — length is 4, contents mixed.
    expect(ages.length).toBe(4);
  });

  it('indexing an array gives you `T | undefined` in strict mode', () => {
    const names = ['Ada', 'Grace', 'Margaret'];
    // With `noUncheckedIndexedAccess` on, TypeScript assumes any index access
    // might return undefined — because at runtime it very well might.
    const maybeFirst = names[0];
    // STUDENT: narrow with a check, then assign to `definitelyFirst`.
    let definitelyFirst = '';
    if (maybeFirst !== undefined) {
      definitelyFirst = maybeFirst;
    }

    expect(definitelyFirst).toBe('Ada');
  });
});

describe('tuples', () => {
  // INSTRUCTOR: Tuples are a smaller beat. If the room looks restless, keep it
  // brief — the two tests establish the idea. Destructuring is what most of
  // them will actually use; make sure they see the `[lat, lng]` pattern.

  it('a tuple is an array with a fixed length and a specific type per position', () => {
    // Common use: a coordinate pair.
    type Coordinate = [number, number];
    const cleveland: Coordinate = [41.5, -81.7];

    // STUDENT: destructure the tuple so `lat` and `lng` hold the two numbers.
    const [lat, lng] = cleveland;

    expect(lat).toBe(41.5);
    expect(lng).toBe(-81.7);
  });

  it('tuple positions can have different types', () => {
    type Entry = [string, number];
    // STUDENT: create an entry with any string key and any number value.
    const score: Entry = ['final', 95];

    expect(typeof score[0]).toBe('string');
    expect(typeof score[1]).toBe('number');
  });
});

describe('structural typing — "if it walks like a duck"', () => {
  // INSTRUCTOR: The second test (excess property check) is where most questions
  // land. Briefly: the check ONLY applies to inline literals. Extract to a
  // variable first, the check is skipped. The reason is "catch the typo at
  // the call site," not a deep type-system rule.

  function describeSeats(place: { name: string; numberOfSeats: number }): string {
    return `${place.name} has ${place.numberOfSeats} seats`;
  }

  it('any object with the right properties is accepted', () => {
    const theater = { name: 'The Capitol', kind: 'Movie Theater', numberOfSeats: 289 };
    const car = { name: 'Old Ford', numberOfSeats: 4, milesPerGallon: 18 };

    // Neither `theater` nor `car` was declared as the function's parameter type.
    // Both have `name` and `numberOfSeats` — so both satisfy the shape.
    expect(describeSeats(theater)).toBe('The Capitol has 289 seats');

    // STUDENT: call describeSeats with `car` and assign the result.
    const carDescription = describeSeats(car);
    expect(carDescription).toBe('Old Ford has 4 seats');
  });

  it('object literals passed inline get an extra strict check', () => {
    // Passing through a variable, extra properties are fine (previous test).
    // Passing an object literal directly, TypeScript applies an "excess property check"
    // and rejects properties you didn't ask for. This catches typos.
    // @ts-expect-error — excess property check rejects the stray `age` property
    describeSeats({ name: 'Home', numberOfSeats: 2, age: 100 });
    expect(true).toBe(true);
  });

  // Going deeper:
  //   Structural typing is wonderful on Day 1 and occasionally a problem later.
  //   Two types can be identical to TypeScript and yet represent completely
  //   different things (a UserId and a ProductId are both `string`, and the
  //   compiler will happily swap them).
  //
  //   We fix that with "branded types" later in the course. For now, just notice
  //   that this is a trade-off, not a free lunch. Ask your AI:
  //     "In TypeScript, when does structural typing cause bugs that nominal
  //      typing would prevent? Give me an Angular-flavored example."
});
